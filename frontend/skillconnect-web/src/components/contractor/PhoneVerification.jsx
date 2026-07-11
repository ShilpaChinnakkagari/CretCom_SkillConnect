import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from '../../firebase/firebaseConfig';

const PhoneVerification = ({ phoneNumber, onVerified, onError }) => {
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const recaptchaRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const setupRecaptcha = () => {
    if (!recaptchaRef.current) {
      try {
        recaptchaRef.current = new RecaptchaVerifier(
          auth,
          'recaptcha-container',
          {
            size: 'invisible',
            callback: () => console.log('reCAPTCHA verified'),
            'expired-callback': () => console.log('reCAPTCHA expired')
          }
        );
      } catch (error) {
        console.error('Error setting up reCAPTCHA:', error);
      }
    }
  };

  const sendOTP = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    try {
      setupRecaptcha();

      const formattedNumber = phoneNumber.startsWith('+') 
        ? phoneNumber 
        : `+91${phoneNumber}`;

      const result = await signInWithPhoneNumber(auth, formattedNumber, recaptchaRef.current);
      setConfirmationResult(result);
      setOtpSent(true);
      setCanResend(false);
      setTimer(60);
      toast.success('OTP sent to your phone!');

      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

    } catch (error) {
      console.error('Error sending OTP:', error);
      const errorMsg = error.code === 'auth/invalid-phone-number' 
        ? 'Invalid phone number. Please check and try again.'
        : error.message || 'Failed to send OTP';
      toast.error(errorMsg);
      if (onError) onError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!otp || otp.length < 6) {
      toast.error('Please enter the 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const result = await confirmationResult.confirm(otp);
      const user = result.user;
      console.log('Phone verified:', user.phoneNumber);
      toast.success('Phone number verified!');
      
      if (onVerified) {
        onVerified(user.phoneNumber);
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      const errorMsg = error.code === 'auth/invalid-verification-code'
        ? 'Invalid OTP. Please try again.'
        : error.message || 'Failed to verify OTP';
      toast.error(errorMsg);
      if (onError) onError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = () => {
    if (canResend) {
      sendOTP();
    }
  };

  return (
    <div className="space-y-3">
      <div id="recaptcha-container"></div>

      {!otpSent ? (
        <button
          type="button"
          onClick={sendOTP}
          disabled={loading || !phoneNumber}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm whitespace-nowrap"
        >
          {loading ? 'Sending...' : 'Send OTP'}
        </button>
      ) : (
        <div className="space-y-2">
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="6-digit OTP"
              maxLength={6}
              className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-center text-lg tracking-widest"
            />
            <button
              type="button"
              onClick={verifyOTP}
              disabled={loading || otp.length < 6}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm whitespace-nowrap"
            >
              {loading ? 'Verifying...' : 'Verify'}
            </button>
          </div>

          <div className="flex items-center gap-3 text-sm">
            {timer > 0 && !canResend ? (
              <span className="text-gray-500">Resend in {timer}s</span>
            ) : (
              <button
                type="button"
                onClick={resendOTP}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Resend OTP
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PhoneVerification;
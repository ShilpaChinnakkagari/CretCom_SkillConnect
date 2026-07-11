import React from 'react';
import { signInWithPopup, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { auth, googleProvider } from '../../firebase/firebaseConfig';
import axios from 'axios';
import { toast } from 'react-hot-toast';

axios.defaults.withCredentials = true;

const GoogleLogin = ({ onSuccess, onError, buttonText = "Sign in with Google" }) => {

  const handleGoogleLogin = async () => {
    try {
      console.log('Starting Google login...');
      
      // Try popup first
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      console.log('Google user:', user.email);

      // Get ID token
      const idToken = await user.getIdToken();

      console.log('Got ID token, sending to backend...');

      // Send to backend
      const response = await axios.post('http://localhost:8080/api/auth/google', {
        idToken: idToken,
        userType: 'CUSTOMER'
      }, {
        withCredentials: true
      });

      console.log('Backend response:', response.data);

      if (onSuccess) {
        onSuccess(response.data);
      }

    } catch (error) {
      console.error('Google login error:', error);
      
      // Handle specific error cases
      if (error.code === 'auth/popup-blocked') {
        toast.error('Popup blocked! Please allow popups for this site.');
        // Fallback to redirect method
        try {
          await signInWithRedirect(auth, googleProvider);
        } catch (redirectError) {
          console.error('Redirect fallback failed:', redirectError);
          if (onError) onError(redirectError);
        }
        return;
      }
      
      if (error.code === 'auth/popup-closed-by-user') {
        console.log('Popup closed by user');
        return;
      }

      if (error.code === 'auth/cancelled-popup-request') {
        console.log('Popup request cancelled');
        return;
      }

      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error('Session expired. Please try again.');
      }

      if (onError) {
        onError(error);
      }
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      type="button"
      className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all duration-300 group"
    >
      <img
        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
        alt="Google"
        className="w-5 h-5"
      />
      <span className="font-medium">{buttonText}</span>
    </button>
  );
};

export default GoogleLogin;
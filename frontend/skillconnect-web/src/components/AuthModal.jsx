import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { signInWithPopup, signInWithRedirect } from 'firebase/auth';
import { auth, googleProvider } from '../firebase/firebaseConfig';

axios.defaults.withCredentials = true;

const AuthModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  // Handle entrance animation
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsVisible(true), 50);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setError('');
      setLoading(false);
      setIsVisible(false);
    }
  }, [isOpen]);

  const handleAuthSuccess = (data) => {
    console.log('Auth success:', data);
    localStorage.setItem('user', JSON.stringify(data));

    toast.success(`Welcome, ${data.name || 'User'}!`);

    setTimeout(() => {
      onClose();
      if (data.userType === 'CONTRACTOR') {
        window.location.href = '/contractor-dashboard';
      } else if (data.userType === 'ADMIN') {
        window.location.href = '/admin-dashboard';
      } else if (data.userType === 'CUSTOMER') {
        window.location.href = '/customer-dashboard';
      } else {
        window.location.href = '/role-selection';
      }
    }, 500);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      console.log('Starting Google login...');
      
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      console.log('Google user:', user.email);

      const idToken = await user.getIdToken();

      console.log('Got ID token, sending to backend...');

      const response = await axios.post('http://localhost:8080/auth/google', {
        idToken: idToken,
        userType: 'USER'
      }, {
        withCredentials: true
      });

      console.log('Backend response:', response.data);
      handleAuthSuccess(response.data);

    } catch (error) {
      console.error('Google login error:', error);
      
      if (error.code === 'auth/popup-blocked') {
        toast.error('Popup blocked! Please allow popups for this site.');
        try {
          await signInWithRedirect(auth, googleProvider);
        } catch (redirectError) {
          console.error('Redirect fallback failed:', redirectError);
          setError('Login failed. Please try again.');
        }
        return;
      }
      
      if (error.code === 'auth/popup-closed-by-user') {
        console.log('Popup closed by user');
        setLoading(false);
        return;
      }

      if (error.code === 'auth/cancelled-popup-request') {
        console.log('Popup request cancelled');
        setLoading(false);
        return;
      }

      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error('Session expired. Please try again.');
      }

      setError('Google login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle close with proper cleanup and event prevention
  const handleClose = useCallback((e) => {
    if (e) {
      e.stopPropagation();
    }
    
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  }, [onClose]);

  // Handle backdrop click separately
  const handleBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      handleClose(e);
    }
  }, [handleClose]);

  // Keyboard escape key handler
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose(e);
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, handleClose]);

  if (!isOpen && !isVisible) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex"
      onKeyDown={(e) => e.key === 'Escape' && handleClose(e)}
    >
      {/* Backdrop with glass blur */}
      <div 
        className={`absolute inset-0 transition-all duration-1000 ease-out ${
          isVisible ? 'bg-black/60 backdrop-blur-lg' : 'bg-black/0 backdrop-blur-none'
        }`}
        onClick={handleBackdropClick}
      />
      
      {/* Slide-in panel with glass effect */}
      <div 
        className={`relative w-1/2 h-full overflow-y-auto transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(135deg, rgba(17, 17, 27, 0.95), rgba(30, 27, 45, 0.95))',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '4px 0 80px rgba(0,0,0,0.6), inset 0 0 80px rgba(99, 102, 241, 0.03)',
        }}
      >
        {/* Animated gradient background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        {/* Close button */}
        <button
          onClick={handleClose}
          type="button"
          className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all duration-500 hover:rotate-90 flex items-center justify-center text-2xl backdrop-blur-sm border border-white/10 hover:border-white/20 z-50 cursor-pointer"
          aria-label="Close modal"
        >
          ✕
        </button>

        <div className="flex flex-col justify-center min-h-full px-12 py-16 relative z-10">
          {/* Logo with glass effect */}
          <div className={`mb-8 transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-2xl shadow-2xl shadow-indigo-500/30 relative">
                <div className="absolute inset-0 rounded-2xl bg-white/20 backdrop-blur-sm"></div>
                <span className="relative">C</span>
              </div>
              <div>
                <span className="text-2xl font-bold text-white">CretCom</span>
                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent ml-2">SkillConnect</span>
              </div>
            </div>
          </div>

          {/* Welcome Message */}
          <div className={`mb-6 transition-all duration-700 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <h2 className="text-4xl font-bold text-white mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-400 text-base">
              Sign in with Google to continue
            </p>
          </div>

          {/* Info Box - tells user about role selection after login */}
          <div className={`mb-6 p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 backdrop-blur-sm transition-all duration-700 delay-350 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="flex items-start gap-3">
              <span className="text-indigo-400 text-lg mt-0.5">ℹ️</span>
              <div>
                <p className="text-gray-300 text-sm font-medium">After signing in, you'll choose your role</p>
                <p className="text-gray-400 text-xs mt-1">Select between <span className="text-pink-400">Customer</span> or <span className="text-blue-400">Contractor</span> to get started</p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className={`mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-sm backdrop-blur-sm transition-all duration-500 ${
              isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}>
              {error}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className={`mb-6 p-4 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-sm text-center backdrop-blur-sm transition-all duration-500 ${
              isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}>
              <div className="flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                <span>Connecting to Google...</span>
              </div>
            </div>
          )}

          {/* Google Login Button - Vibrant Glass & Glow */}
          <div className={`transition-all duration-700 delay-400 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              type="button"
              className="w-full py-4 px-6 rounded-xl bg-white/10 backdrop-blur-md hover:bg-white/20 text-white font-semibold transition-all duration-300 flex items-center justify-center gap-3 border border-white/20 hover:border-white/40 shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed relative group overflow-hidden"
            >
              {/* Glass glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                className="w-6 h-6 relative z-10"
              />
              <span className="text-base relative z-10">
                Continue with Google
              </span>
            </button>
          </div>

          {/* Footer */}
          <div className={`mt-8 text-center transition-all duration-700 delay-500 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}>
            <div className="flex items-center justify-center gap-4 text-xs">
              <span className="text-gray-500">🔒 Secure</span>
              <span className="text-gray-600">•</span>
              <span className="text-gray-500">No password needed</span>
              <span className="text-gray-600">•</span>
              <span className="text-gray-500">Trusted by thousands</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
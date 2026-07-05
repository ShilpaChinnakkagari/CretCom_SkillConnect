import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { getRedirectResult } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import GoogleLogin from '../components/auth/GoogleLogin';

axios.defaults.withCredentials = true;

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle redirect result (for signInWithRedirect fallback)
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          const user = result.user;
          const idToken = await user.getIdToken();
          
          const response = await axios.post('http://localhost:8080/api/auth/google', {
            idToken: idToken,
            userType: 'CUSTOMER'
          }, {
            withCredentials: true
          });

          handleGoogleSuccess(response.data);
        }
      } catch (error) {
        console.error('Redirect result error:', error);
        if (error.code !== 'auth/unauthorized-domain') {
          toast.error('Login failed. Please try again.');
        }
      }
    };

    handleRedirectResult();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', formData, {
        withCredentials: true
      });

      localStorage.setItem('user', JSON.stringify(response.data));

      const user = response.data;

      if (user.userType === 'CONTRACTOR') {
        window.location.href = '/contractor-dashboard';
      } else if (user.userType === 'ADMIN') {
        window.location.href = '/admin-dashboard';
      } else if (user.userType === 'CUSTOMER') {
        window.location.href = '/customer-dashboard';
      } else {
        window.location.href = '/role-selection';
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = (data) => {
    console.log('Google login response:', data);

    localStorage.setItem('user', JSON.stringify(data));

    toast.success(`Welcome, ${data.name || 'User'}!`);

    setTimeout(() => {
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

  const handleGoogleError = (error) => {
    console.error('Google login error:', error);
    
    if (error.code === 'auth/popup-blocked') {
      setError('Popup blocked! Please allow popups for this site.');
    } else {
      setError('Google login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="text-center">
            <span className="text-4xl font-bold text-primary-600">SkillConnect</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
              create a new account
            </Link>
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="mt-8 space-y-6">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
          />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">Or continue with email</span>
            </div>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <input
                  id="email"
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
              <div>
                <input
                  id="password"
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
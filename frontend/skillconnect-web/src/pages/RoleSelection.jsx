import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

axios.defaults.withCredentials = true;

const RoleSelection = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const parsed = JSON.parse(userStr);
      setUser(parsed);

      if (parsed.userType && parsed.userType !== '' && parsed.userType !== null && parsed.userType !== 'null') {
        if (parsed.userType === 'CONTRACTOR') {
          navigate('/contractor-dashboard', { replace: true });
        } else if (parsed.userType === 'ADMIN') {
          navigate('/admin-dashboard', { replace: true });
        } else {
          navigate('/customer-dashboard', { replace: true });
        }
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleRoleSelect = async (role) => {
    setSelectedRole(role);
    setLoading(true);

    try {
      const response = await axios.put(
        'http://localhost:8080/auth/users/role',
        { userType: role },
        { withCredentials: true }
      );

      console.log('Role update response:', response.data);

      const userStr = localStorage.getItem('user');
      if (userStr) {
        const userData = JSON.parse(userStr);
        userData.userType = role;
        userData.role = role;
        localStorage.setItem('user', JSON.stringify(userData));
      }

      toast.success(`Welcome, ${role === 'CONTRACTOR' ? 'Contractor' : 'Customer'}!`);

      if (role === 'CONTRACTOR') {
        navigate('/contractor-registration', { replace: true });
      } else if (role === 'CUSTOMER') {
        navigate('/customer-dashboard', { replace: true });
      } else if (role === 'ADMIN') {
        navigate('/admin-dashboard', { replace: true });
      }

    } catch (error) {
      console.error('Role update error:', error);
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error('Session expired. Please login again.');
        localStorage.removeItem('user');
        navigate('/login');
      } else {
        toast.error(error.response?.data?.message || 'Failed to update role');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 px-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Welcome to <span className="text-primary-600">SkillConnect</span>
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            {user?.name || 'User'}, how would you like to use SkillConnect?
          </p>
          <p className="text-sm text-gray-400 mt-1">Choose your role to get started</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer Card */}
          <div
            onClick={() => !loading && handleRoleSelect('CUSTOMER')}
            className={`bg-white rounded-2xl shadow-lg p-8 text-center cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
              selectedRole === 'CUSTOMER' ? 'ring-4 ring-primary-500 ring-offset-4' : ''
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="text-6xl mb-4">👤</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Customer</h2>
            <p className="text-gray-500 text-sm mb-4">
              Find and book trusted service providers in your area
            </p>
            <ul className="text-sm text-gray-600 text-left space-y-2">
              <li>🔍 Search for professionals</li>
              <li>📅 Book services easily</li>
              <li>⭐ Rate and review providers</li>
              <li>❤️ Save your favorites</li>
            </ul>
            <button
              className={`mt-6 px-8 py-3 rounded-xl text-white font-medium ${
                selectedRole === 'CUSTOMER'
                  ? 'bg-primary-600 hover:bg-primary-700'
                  : 'bg-gray-300 hover:bg-gray-400'
              } transition`}
              disabled={loading}
            >
              Continue as Customer
            </button>
          </div>

          {/* Contractor Card */}
          <div
            onClick={() => !loading && handleRoleSelect('CONTRACTOR')}
            className={`bg-white rounded-2xl shadow-lg p-8 text-center cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
              selectedRole === 'CONTRACTOR' ? 'ring-4 ring-primary-500 ring-offset-4' : ''
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="text-6xl mb-4">🔧</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Contractor</h2>
            <p className="text-gray-500 text-sm mb-4">
              Offer your services and grow your business
            </p>
            <ul className="text-sm text-gray-600 text-left space-y-2">
              <li>📋 Create your professional profile</li>
              <li>📸 Showcase your portfolio</li>
              <li>📩 Receive booking requests</li>
              <li>💰 Manage your earnings</li>
            </ul>
            <button
              className={`mt-6 px-8 py-3 rounded-xl text-white font-medium ${
                selectedRole === 'CONTRACTOR'
                  ? 'bg-primary-600 hover:bg-primary-700'
                  : 'bg-gray-300 hover:bg-gray-400'
              } transition`}
              disabled={loading}
            >
              Continue as Contractor
            </button>
          </div>
        </div>

        {loading && (
          <div className="mt-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p className="text-gray-600 mt-2">Setting up your account...</p>
          </div>
        )}

        <div className="text-center mt-8">
          <p className="text-xs text-gray-400">
            Already have an account? <span className="text-primary-600">Sign in</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
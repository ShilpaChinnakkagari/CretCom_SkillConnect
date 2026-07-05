import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.userType === 'CONTRACTOR') {
          navigate('/contractor-dashboard', { replace: true });
        } else if (user.userType === 'CUSTOMER') {
          navigate('/customer-dashboard', { replace: true });
        } else if (user.userType === 'ADMIN') {
          navigate('/admin-dashboard', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      } catch (e) {
        navigate('/login', { replace: true });
      }
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
};

export default Dashboard;
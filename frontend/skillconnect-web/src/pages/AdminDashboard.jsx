import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary-600">SkillConnect</span>
            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Welcome, {user?.name || 'Admin'}</span>
            <button onClick={handleLogout} className="text-sm text-red-600 hover:text-red-800">Logout</button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-500">👤 Total Users</p>
            <p className="text-2xl font-bold text-primary-600">0</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-500">🔧 Contractors</p>
            <p className="text-2xl font-bold text-green-600">0</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-500">📋 Total Bookings</p>
            <p className="text-2xl font-bold text-yellow-600">0</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-500">⏳ Pending Verification</p>
            <p className="text-2xl font-bold text-orange-600">0</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:shadow-lg transition">
            <span className="text-2xl block mb-1">👥</span>
            <span className="font-medium">Manage Users</span>
          </button>
          <button className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:shadow-lg transition">
            <span className="text-2xl block mb-1">✅</span>
            <span className="font-medium">Verify Contractors</span>
          </button>
          <button className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:shadow-lg transition">
            <span className="text-2xl block mb-1">📂</span>
            <span className="font-medium">Manage Categories</span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
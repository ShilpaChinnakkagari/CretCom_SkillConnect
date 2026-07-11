import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

axios.defaults.baseURL = 'http://localhost:8080';

const ContractorDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [bookingRequests, setBookingRequests] = useState([]);
  const [stats, setStats] = useState({
    totalCustomers: 0,
    completedJobs: 0,
    totalEarnings: 0,
    averageRating: 0
  });

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    } else {
      navigate('/login');
      return;
    }

    checkRegistrationStatus();
  }, []);

  const checkRegistrationStatus = async () => {
    try {
      const userStr = localStorage.getItem('user');
      const userData = userStr ? JSON.parse(userStr) : null;
      const userId = userData?.id || userData?.userId;
      
      if (!userId) {
        navigate('/login');
        return;
      }

      // ✅ FIXED: Added /api prefix
      const response = await axios.get('/api/contractor/profile', {
        params: { userId: userId }
      });
      
      if (response.data && response.data.registrationComplete === true) {
        setProfile(response.data);
        if (response.data.stats) {
          setStats(response.data.stats);
        }
        fetchBookings(userId);
      } else {
        toast.info('Please complete your contractor profile!');
        navigate('/contractor-registration', { replace: true });
      }
    } catch (error) {
      if (error.response?.status === 404) {
        toast.info('Please complete your contractor profile!');
        navigate('/contractor-registration', { replace: true });
      } else {
        console.error('Error checking registration:', error);
        toast.error('Failed to load profile');
        navigate('/contractor-registration', { replace: true });
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async (userId) => {
    try {
      // ✅ FIXED: Added /api prefix
      const bookingsRes = await axios.get('/api/bookings/contractor', {
        params: { userId: userId }
      });
      setBookingRequests(bookingsRes.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const handleAcceptBooking = async (bookingId) => {
    try {
      await axios.put(`/api/bookings/${bookingId}/status`, 'ACCEPTED', {
        headers: { 'Content-Type': 'text/plain' }
      });
      toast.success('Booking accepted!');
      const userStr = localStorage.getItem('user');
      const userData = userStr ? JSON.parse(userStr) : null;
      fetchBookings(userData?.id || userData?.userId);
    } catch (error) {
      toast.error('Failed to accept booking');
    }
  };

  const handleRejectBooking = async (bookingId) => {
    try {
      await axios.put(`/api/bookings/${bookingId}/status`, 'REJECTED', {
        headers: { 'Content-Type': 'text/plain' }
      });
      toast.success('Booking rejected');
      const userStr = localStorage.getItem('user');
      const userData = userStr ? JSON.parse(userStr) : null;
      fetchBookings(userData?.id || userData?.userId);
    } catch (error) {
      toast.error('Failed to reject booking');
    }
  };

  const handleCompleteBooking = async (bookingId) => {
    try {
      await axios.put(`/api/bookings/${bookingId}/status`, 'COMPLETED', {
        headers: { 'Content-Type': 'text/plain' }
      });
      toast.success('Booking completed!');
      const userStr = localStorage.getItem('user');
      const userData = userStr ? JSON.parse(userStr) : null;
      fetchBookings(userData?.id || userData?.userId);
    } catch (error) {
      toast.error('Failed to complete booking');
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout', {});
    } catch (e) { 
      console.error('Logout error:', e); 
    }
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const pendingBookings = bookingRequests.filter(b => b.status === 'PENDING');
  const activeBookings = bookingRequests.filter(b => b.status === 'ACCEPTED');
  const completedBookings = bookingRequests.filter(b => b.status === 'COMPLETED');

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary-600">SkillConnect</span>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Contractor</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Welcome, {user?.name || 'Contractor'}</span>
            <button onClick={handleLogout} className="text-sm text-red-600 hover:text-red-800 transition-colors">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Contractor Dashboard</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-500">👤 Customers</p>
            <p className="text-2xl font-bold text-primary-600">{stats.totalCustomers || 0}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-500">✅ Jobs Completed</p>
            <p className="text-2xl font-bold text-green-600">{stats.completedJobs || 0}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-500">⭐ Rating</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.averageRating || 0}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-500">💰 Earnings</p>
            <p className="text-2xl font-bold text-gray-800">₹{stats.totalEarnings || 0}</p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            📥 Booking Requests
            {pendingBookings.length > 0 && (
              <span className="bg-red-500 text-white px-2.5 py-0.5 rounded-full text-xs">
                {pendingBookings.length} New
              </span>
            )}
          </h2>

          {bookingRequests.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
              <span className="text-4xl block mb-2">📭</span>
              <p className="text-gray-500">No booking requests yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingBookings.map((booking) => (
                <div key={booking.id} className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-yellow-500">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <p className="font-semibold text-gray-800">👤 {booking.customerName || 'Customer'}</p>
                      <p className="text-sm text-gray-600">📅 {booking.date} at {booking.time}</p>
                      <p className="text-sm text-gray-600">📍 {booking.address}</p>
                      <p className="text-sm font-medium text-gray-800">💰 ₹{booking.budget}</p>
                      {booking.description && (
                        <p className="text-sm text-gray-500 mt-1">📝 {booking.description}</p>
                      )}
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => handleAcceptBooking(booking.id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                      >
                        ✅ Accept
                      </button>
                      <button
                        onClick={() => handleRejectBooking(booking.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                      >
                        ❌ Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {activeBookings.map((booking) => (
                <div key={booking.id} className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-blue-500">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <p className="font-semibold text-gray-800">👤 {booking.customerName || 'Customer'}</p>
                      <p className="text-sm text-gray-600">📅 {booking.date} at {booking.time}</p>
                      <p className="text-sm text-gray-600">📍 {booking.address}</p>
                      <p className="text-sm font-medium text-gray-800">💰 ₹{booking.budget}</p>
                    </div>
                    <button
                      onClick={() => handleCompleteBooking(booking.id)}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm"
                    >
                      ✅ Mark Complete
                    </button>
                  </div>
                </div>
              ))}

              {completedBookings.map((booking) => (
                <div key={booking.id} className="bg-gray-50 rounded-xl shadow-sm p-4 border-l-4 border-green-500">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <p className="font-semibold text-gray-800">👤 {booking.customerName || 'Customer'}</p>
                      <p className="text-sm text-gray-600">📅 {booking.date} at {booking.time}</p>
                      <p className="text-sm font-medium text-gray-800">💰 ₹{booking.budget}</p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      ✅ Completed
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button className="bg-primary-600 text-white rounded-xl p-4 text-center hover:bg-primary-700 transition">
            <span className="text-2xl block mb-1">📊</span>
            <span className="font-medium">My Services</span>
          </button>
          <button className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:shadow-lg transition">
            <span className="text-2xl block mb-1">📷</span>
            <span className="font-medium">Manage Portfolio</span>
          </button>
          <button className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:shadow-lg transition">
            <span className="text-2xl block mb-1">⚙️</span>
            <span className="font-medium">Profile Settings</span>
          </button>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-700">
            💡 Need to hire someone? You can also use SkillConnect as a customer!
          </p>
          <button
            onClick={() => navigate('/customer-dashboard')}
            className="mt-2 text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Switch to Customer Mode →
          </button>
        </div>
      </main>
    </div>
  );
};

export default ContractorDashboard;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import LanguageSwitcher from '../components/LanguageSwitcher';

axios.defaults.withCredentials = true;

const ContractorDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({
    totalCustomers: 0,
    completedJobs: 0,
    averageRating: 0,
    totalEarnings: 0
  });

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      navigate('/');
      return;
    }
    const userData = JSON.parse(userStr);
    setUser(userData);

    if (userData.userType !== 'CONTRACTOR') {
      navigate('/customer-dashboard');
      return;
    }

    fetchProfile();
    fetchBookings();
  }, []);

  const fetchProfile = async () => {
    try {
      const userStr = localStorage.getItem('user');
      const userData = userStr ? JSON.parse(userStr) : null;
      const userId = userData?.id || userData?.userId;

      const response = await axios.get(`http://localhost:8080/contractor/profile`, {
        params: { userId: userId },
        withCredentials: true
      });
      setProfile(response.data);
      
      // Update stats from profile
      if (response.data.stats) {
        setStats({
          totalCustomers: response.data.stats.totalCustomers || 0,
          completedJobs: response.data.stats.completedJobs || 0,
          averageRating: response.data.stats.averageRating || 0,
          totalEarnings: response.data.stats.totalEarnings || 0
        });
      }
    } catch (error) {
      if (error.response?.status === 404) {
        navigate('/contractor-registration');
      } else {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await axios.get('http://localhost:8080/bookings/contractor', {
        withCredentials: true
      });
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const handleBookingStatus = async (bookingId, status) => {
    try {
      await axios.put(`http://localhost:8080/bookings/${bookingId}/status`, {
        status: status
      }, {
        withCredentials: true
      });
      toast.success(`Booking ${status.toLowerCase()}!`);
      fetchBookings();
    } catch (error) {
      console.error('Error updating booking:', error);
      toast.error('Failed to update booking');
    }
  };

  const handleSwitchToCustomer = async () => {
    try {
      const userStr = localStorage.getItem('user');
      const userData = userStr ? JSON.parse(userStr) : null;
      
      await axios.put('http://localhost:8080/auth/users/role', {
        userType: 'CUSTOMER'
      }, {
        withCredentials: true
      });
      
      if (userData) {
        userData.userType = 'CUSTOMER';
        userData.role = 'CUSTOMER';
        localStorage.setItem('user', JSON.stringify(userData));
      }
      
      toast.success('Switched to Customer mode!');
      navigate('/customer-dashboard');
    } catch (error) {
      console.error('Error switching role:', error);
      toast.error('Failed to switch mode');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
        <LanguageSwitcher />
      </div>
    );
  }

  // Calculate pending bookings count
  const pendingBookings = bookings.filter(b => b.status === 'PENDING').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">Contractor Dashboard</h1>
            <span className="text-sm text-gray-500">Welcome, {user?.name || 'User'}</span>
          </div>
          <div className="flex items-center gap-4">
            {profile?.registrationComplete !== true && (
              <button
                onClick={() => navigate('/contractor-registration')}
                className="px-4 py-2 text-sm bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
              >
                Complete Profile
              </button>
            )}
            <button
              onClick={() => {
                localStorage.removeItem('user');
                navigate('/');
              }}
              className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-500">👤 Customers</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-500">✅ Jobs Completed</p>
            <p className="text-2xl font-bold text-green-600">{stats.completedJobs}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-500">⭐ Rating</p>
            <p className="text-2xl font-bold text-yellow-500">{stats.averageRating.toFixed(1)}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p className="text-sm text-gray-500">💰 Earnings</p>
            <p className="text-2xl font-bold text-green-600">₹{stats.totalEarnings}</p>
          </div>
        </div>

        {/* Profile Status */}
        {profile && profile.registrationComplete !== true && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-8">
            <p className="text-yellow-800">
              ⚠️ Your profile is incomplete. Please complete your registration to start receiving bookings.
              <button
                onClick={() => navigate('/contractor-registration')}
                className="ml-4 px-4 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition text-sm"
              >
                Complete Now
              </button>
            </p>
          </div>
        )}

        {/* Bookings */}
        <h2 className="text-xl font-bold text-gray-900 mb-4">📥 Booking Requests</h2>
        {bookings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <p className="text-gray-500 text-lg">📭 No booking requests yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">Booking #{booking.id}</p>
                    <p className="text-sm text-gray-500">Customer: {booking.customerName || 'N/A'}</p>
                    <p className="text-sm text-gray-500">Service: {booking.service || 'General'}</p>
                    <p className="text-sm text-gray-500">Date: {new Date(booking.createdAt).toLocaleDateString()}</p>
                    <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                      booking.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                      booking.status === 'ACCEPTED' ? 'bg-blue-100 text-blue-800' :
                      booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                  {booking.status === 'PENDING' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleBookingStatus(booking.id, 'ACCEPTED')}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleBookingStatus(booking.id, 'REJECTED')}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                  {booking.status === 'ACCEPTED' && (
                    <button
                      onClick={() => handleBookingStatus(booking.id, 'COMPLETED')}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition text-sm"
                    >
                      Mark Complete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/contractor-registration')}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition group"
          >
            <span className="text-3xl block mb-2">📊</span>
            <p className="text-gray-700 font-medium group-hover:text-primary-600 transition">My Services</p>
          </button>
          <button
            onClick={() => toast.info('Portfolio management coming soon!')}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition group"
          >
            <span className="text-3xl block mb-2">📷</span>
            <p className="text-gray-700 font-medium group-hover:text-primary-600 transition">Manage Portfolio</p>
          </button>
          <button
            onClick={() => toast.info('Profile settings coming soon!')}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition group"
          >
            <span className="text-3xl block mb-2">⚙️</span>
            <p className="text-gray-700 font-medium group-hover:text-primary-600 transition">Profile Settings</p>
          </button>
        </div>

        {/* Switch to Customer Mode */}
        <div className="mt-8 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl border border-primary-200 p-6">
          <p className="text-gray-700 text-center">
            💡 Need to hire someone? You can also use SkillConnect as a customer!
          </p>
          <div className="flex justify-center mt-3">
            <button
              onClick={handleSwitchToCustomer}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
            >
              Switch to Customer Mode →
            </button>
          </div>
        </div>
      </div>

      {/* ===== LANGUAGE SWITCHER ===== */}
      <LanguageSwitcher />
    </div>
  );
};

export default ContractorDashboard;
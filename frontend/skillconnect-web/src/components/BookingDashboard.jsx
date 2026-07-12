import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const BookingDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('http://localhost:8080/bookings/customer', {
        withCredentials: true
      });
      setBookings(response.data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'ACCEPTED': return 'bg-blue-100 text-blue-800';
      case 'STARTED': return 'bg-purple-100 text-purple-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING': return '⏳';
      case 'ACCEPTED': return '✅';
      case 'STARTED': return '🚀';
      case 'COMPLETED': return '🎉';
      case 'CANCELLED': return '❌';
      default: return '📌';
    }
  };

  const filteredBookings = activeFilter === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === activeFilter);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">📅 My Bookings</h2>
        <div className="flex gap-2">
          <span className="text-sm text-gray-500">Total: {bookings.length}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['all', 'PENDING', 'ACCEPTED', 'STARTED', 'COMPLETED', 'CANCELLED'].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-lg text-sm capitalize transition ${
              activeFilter === filter
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {filter === 'all' ? '📋 All' :
             filter === 'PENDING' ? '⏳ Pending' :
             filter === 'ACCEPTED' ? '✅ Accepted' :
             filter === 'STARTED' ? '🚀 Started' :
             filter === 'COMPLETED' ? '🎉 Completed' :
             '❌ Cancelled'}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-500 text-lg">📭 No bookings found</p>
          <p className="text-sm text-gray-400 mt-2">Start exploring services and book a professional!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition">
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{booking.service || 'General Service'}</h3>
                  <p className="text-sm text-gray-600">With {booking.contractorName || 'Contractor'}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-500">
                    <span>📅 {new Date(booking.date).toLocaleDateString()}</span>
                    <span>⏰ {new Date(booking.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {booking.budget && <span>💰 ₹{booking.budget}</span>}
                  </div>
                  {booking.description && (
                    <p className="text-sm text-gray-600 mt-1">{booking.description}</p>
                  )}
                </div>
                <div className="text-right">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                    {getStatusIcon(booking.status)} {booking.status}
                  </span>
                  <p className="text-xs text-gray-400 mt-1">{new Date(booking.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              {booking.status === 'PENDING' && (
                <div className="mt-3 pt-3 border-t border-gray-100 flex gap-2">
                  <button 
                    onClick={() => toast.info('Cancel booking feature coming soon!')}
                    className="text-sm text-red-500 hover:text-red-700"
                  >
                    Cancel Request
                  </button>
                </div>
              )}

              {booking.status === 'COMPLETED' && (
                <div className="mt-3 pt-3 border-t border-gray-100 flex gap-2">
                  <button 
                    onClick={() => toast.info('Review feature coming soon!')}
                    className="text-sm text-indigo-600 hover:text-indigo-700"
                  >
                    ⭐ Write Review
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingDashboard;
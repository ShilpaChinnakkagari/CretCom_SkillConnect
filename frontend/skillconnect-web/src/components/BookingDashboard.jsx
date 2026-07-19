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
      case 'PENDING': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'ACCEPTED': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'COMPLETED': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'REJECTED': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'CANCELLED': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING': return '⏳';
      case 'ACCEPTED': return '✅';
      case 'COMPLETED': return '🎉';
      case 'REJECTED': return '❌';
      case 'CANCELLED': return '🚫';
      default: return '📌';
    }
  };

  const filteredBookings = activeFilter === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === activeFilter);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">📅 My Bookings</h2>
        <div className="flex gap-2">
          <span className="text-sm text-gray-400">Total: {bookings.length}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['all', 'PENDING', 'ACCEPTED', 'COMPLETED', 'REJECTED', 'CANCELLED'].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-lg text-sm capitalize transition ${
              activeFilter === filter
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {filter === 'all' ? '📋 All' :
             filter === 'PENDING' ? '⏳ Pending' :
             filter === 'ACCEPTED' ? '✅ Accepted' :
             filter === 'COMPLETED' ? '🎉 Completed' :
             filter === 'REJECTED' ? '❌ Rejected' :
             '🚫 Cancelled'}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="rounded-xl p-12 text-center" style={{ background: '#161B22', border: '1px solid #30363D' }}>
          <p className="text-gray-400 text-lg">📭 No bookings found</p>
          <p className="text-sm text-gray-500 mt-2">Start exploring services and book a professional!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div key={booking.id} className="rounded-xl p-4" style={{ background: '#161B22', border: '1px solid #30363D' }}>
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                      {getStatusIcon(booking.status)} {booking.status}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-semibold text-white mt-1">{booking.service || 'General Service'}</h3>
                  <p className="text-sm text-gray-400">With {booking.contractorName || 'Contractor'}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-400">
                    <span>📅 {booking.date ? new Date(booking.date).toLocaleDateString() : 'N/A'}</span>
                    <span>⏰ {booking.date ? new Date(booking.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}</span>
                    {booking.budget && <span>💰 ₹{booking.budget}</span>}
                  </div>
                  {booking.description && (
                    <p className="text-sm text-gray-400 mt-1">{booking.description}</p>
                  )}
                  
                  {/* ✅ SHOW REJECTION REASON - Customer can see why contractor rejected */}
                  {booking.status === 'REJECTED' && booking.rejectionReason && (
                    <div className="mt-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <p className="text-xs text-red-400 font-medium">❌ Rejection Reason:</p>
                      <p className="text-sm text-red-300">{booking.rejectionReason}</p>
                    </div>
                  )}
                  
                  {/* ✅ SHOW CANCELLATION REASON - Customer can see why they cancelled */}
                  {booking.status === 'CANCELLED' && booking.cancelReason && (
                    <div className="mt-2 p-3 bg-gray-500/10 border border-gray-500/20 rounded-lg">
                      <p className="text-xs text-gray-400 font-medium">🚫 Cancellation Reason:</p>
                      <p className="text-sm text-gray-300">{booking.cancelReason}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* ✅ ONLY ONE BUTTON FOR PENDING BOOKINGS - Cancel Request */}
              {booking.status === 'PENDING' && (
                <div className="mt-3 pt-3 border-t border-gray-700 flex gap-2">
                  <button 
                    onClick={() => {
                      // ✅ Open cancel reason modal for customer
                      const reason = window.prompt('Please provide a reason for cancelling this request:');
                      if (reason !== null && reason.trim()) {
                        // Call API to cancel with reason
                        axios.put(`http://localhost:8080/bookings/${booking.id}/status`, {
                          status: 'CANCELLED',
                          reason: reason.trim()
                        }, { withCredentials: true })
                        .then(() => {
                          toast.success('Booking cancelled');
                          fetchBookings();
                        })
                        .catch(() => toast.error('Failed to cancel booking'));
                      } else if (reason !== null && !reason.trim()) {
                        toast.error('Please provide a reason to cancel');
                      }
                    }}
                    className="text-sm text-red-400 hover:text-red-300 transition"
                  >
                    ❌ Cancel Request
                  </button>
                </div>
              )}

              {booking.status === 'COMPLETED' && (
                <div className="mt-3 pt-3 border-t border-gray-700 flex gap-2">
                  <button 
                    onClick={() => toast.success('Review feature coming soon!')}
                    className="text-sm text-blue-400 hover:text-blue-300 transition"
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
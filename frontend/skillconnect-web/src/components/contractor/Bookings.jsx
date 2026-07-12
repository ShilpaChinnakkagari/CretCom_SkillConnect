import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const filters = [
    { id: 'ALL', label: '📋 All', color: 'text-gray-400' },
    { id: 'PENDING', label: '⏳ Pending', color: 'text-yellow-400' },
    { id: 'ACCEPTED', label: '✅ Accepted', color: 'text-blue-400' },
    { id: 'COMPLETED', label: '🎉 Completed', color: 'text-green-400' },
    { id: 'CANCELLED', label: '❌ Cancelled', color: 'text-red-400' },
  ];

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('http://localhost:8080/bookings/contractor', {
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

  const handleStatusUpdate = async (bookingId, status) => {
    try {
      await axios.put(`http://localhost:8080/bookings/${bookingId}/status`, {
        status: status
      }, {
        withCredentials: true
      });
      toast.success(`Booking ${status.toLowerCase()}!`);
      fetchBookings();
      setShowDetails(false);
    } catch (error) {
      console.error('Error updating booking:', error);
      toast.error('Failed to update booking');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'ACCEPTED': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'COMPLETED': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'CANCELLED': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING': return '⏳';
      case 'ACCEPTED': return '✅';
      case 'COMPLETED': return '🎉';
      case 'CANCELLED': return '❌';
      default: return '📌';
    }
  };

  const filteredBookings = activeFilter === 'ALL' 
    ? bookings 
    : bookings.filter(b => b.status === activeFilter);

  const pendingCount = bookings.filter(b => b.status === 'PENDING').length;
  const acceptedCount = bookings.filter(b => b.status === 'ACCEPTED').length;
  const completedCount = bookings.filter(b => b.status === 'COMPLETED').length;
  const cancelledCount = bookings.filter(b => b.status === 'CANCELLED').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      
      {/* ===== STATS ROW ===== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-xl p-3 text-center" style={{ background: '#161B22', border: '1px solid #30363D' }}>
          <p className="text-2xl font-bold text-white">{pendingCount}</p>
          <p className="text-xs text-yellow-400">⏳ Pending</p>
        </div>
        <div className="rounded-xl p-3 text-center" style={{ background: '#161B22', border: '1px solid #30363D' }}>
          <p className="text-2xl font-bold text-white">{acceptedCount}</p>
          <p className="text-xs text-blue-400">✅ Accepted</p>
        </div>
        <div className="rounded-xl p-3 text-center" style={{ background: '#161B22', border: '1px solid #30363D' }}>
          <p className="text-2xl font-bold text-white">{completedCount}</p>
          <p className="text-xs text-green-400">🎉 Completed</p>
        </div>
        <div className="rounded-xl p-3 text-center" style={{ background: '#161B22', border: '1px solid #30363D' }}>
          <p className="text-2xl font-bold text-white">{cancelledCount}</p>
          <p className="text-xs text-red-400">❌ Cancelled</p>
        </div>
      </div>

      {/* ===== FILTERS ===== */}
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeFilter === filter.id
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
            style={{ background: activeFilter === filter.id ? '#2563EB' : 'transparent' }}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* ===== BOOKING LIST ===== */}
      {filteredBookings.length === 0 ? (
        <div className="rounded-xl p-12 text-center" style={{ background: '#161B22', border: '1px solid #30363D' }}>
          <p className="text-gray-400 text-lg">📭 No bookings found</p>
          <p className="text-sm text-gray-500 mt-1">Bookings will appear here when customers request your services</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredBookings.map((booking) => (
            <div 
              key={booking.id}
              className="rounded-xl p-4 cursor-pointer hover:bg-[#1C2333] transition"
              style={{ background: '#161B22', border: '1px solid #30363D' }}
              onClick={() => {
                setSelectedBooking(booking);
                setShowDetails(true);
              }}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${getStatusColor(booking.status)}`}>
                      {getStatusIcon(booking.status)} {booking.status}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-white font-medium mt-1 truncate">
                    {booking.service || 'General Service'}
                  </p>
                  <p className="text-gray-400 text-sm truncate">
                    👤 {booking.customerName || 'Customer'}
                  </p>
                  {booking.budget && (
                    <p className="text-green-400 text-sm">💰 ₹{booking.budget.toLocaleString()}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-gray-500 text-sm">→</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===== BOOKING DETAILS MODAL ===== */}
      {showDetails && selectedBooking && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-[#161B22] rounded-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto border border-gray-700">
            
            <div className="sticky top-0 bg-[#161B22] z-10 p-4 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">📋 Booking Details</h2>
              <button 
                onClick={() => setShowDetails(false)} 
                className="text-gray-400 hover:text-white text-2xl transition"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <span className={`text-sm px-3 py-1 rounded-full border ${getStatusColor(selectedBooking.status)}`}>
                  {getStatusIcon(selectedBooking.status)} {selectedBooking.status}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(selectedBooking.createdAt).toLocaleString()}
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500">Service</p>
                  <p className="text-white font-medium">{selectedBooking.service || 'General Service'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Customer</p>
                  <p className="text-white">{selectedBooking.customerName || 'Unknown'}</p>
                </div>
                {selectedBooking.description && (
                  <div>
                    <p className="text-xs text-gray-500">Description</p>
                    <p className="text-gray-300 text-sm">{selectedBooking.description}</p>
                  </div>
                )}
                {selectedBooking.date && (
                  <div>
                    <p className="text-xs text-gray-500">Date & Time</p>
                    <p className="text-white">{new Date(selectedBooking.date).toLocaleString()}</p>
                  </div>
                )}
                {selectedBooking.location && (
                  <div>
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="text-white">{selectedBooking.location}</p>
                  </div>
                )}
                {selectedBooking.budget && (
                  <div>
                    <p className="text-xs text-gray-500">Budget</p>
                    <p className="text-green-400 font-medium">₹{selectedBooking.budget.toLocaleString()}</p>
                  </div>
                )}
              </div>

              {/* ===== ACTIONS ===== */}
              {selectedBooking.status === 'PENDING' && (
                <div className="flex gap-3 pt-4 border-t border-gray-700">
                  <button
                    onClick={() => handleStatusUpdate(selectedBooking.id, 'ACCEPTED')}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    ✅ Accept
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedBooking.id, 'REJECTED')}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    ❌ Reject
                  </button>
                </div>
              )}

              {selectedBooking.status === 'ACCEPTED' && (
                <div className="flex gap-3 pt-4 border-t border-gray-700">
                  <button
                    onClick={() => handleStatusUpdate(selectedBooking.id, 'COMPLETED')}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    ✅ Mark Complete
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedBooking.id, 'CANCELLED')}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    ❌ Cancel
                  </button>
                </div>
              )}

              {selectedBooking.status === 'PENDING' && (
                <button
                  onClick={() => handleStatusUpdate(selectedBooking.id, 'CANCELLED')}
                  className="w-full px-4 py-2 bg-red-600/20 text-red-400 border border-red-600/30 rounded-lg hover:bg-red-600/30 transition"
                >
                  ❌ Cancel Booking
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;
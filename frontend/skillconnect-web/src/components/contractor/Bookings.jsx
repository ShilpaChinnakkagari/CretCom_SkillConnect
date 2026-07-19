import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Bookings = ({ onBookingUpdate }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  
  // ✅ State for Rejection Modal
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectBookingId, setRejectBookingId] = useState(null);

  const filters = [
    { id: 'ALL', label: '📋 All' },
    { id: 'PENDING', label: '⏳ Pending' },
    { id: 'ACCEPTED', label: '✅ Accepted' },
    { id: 'COMPLETED', label: '🎉 Completed' },
    { id: 'REJECTED', label: '❌ Rejected' },
    { id: 'CANCELLED', label: '🚫 Cancelled' },
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

  const handleStatusUpdate = async (bookingId, status, reason = null) => {
    try {
      const payload = { status };
      if (reason) {
        payload.reason = reason;
      }

      await axios.put(`http://localhost:8080/bookings/${bookingId}/status`, payload, {
        withCredentials: true
      });
      toast.success(`Booking ${status.toLowerCase()}!`);
      
      // ✅ Refresh bookings
      await fetchBookings();
      
      // ✅ Call the callback to refresh parent (ContractorDashboard)
      if (onBookingUpdate) {
        onBookingUpdate();
      }
      
      setShowDetails(false);
      setShowRejectModal(false);
      setRejectReason('');
    } catch (error) {
      console.error('Error updating booking:', error);
      toast.error(error.response?.data?.error || 'Failed to update booking');
    }
  };

  const openRejectModal = (bookingId) => {
    setRejectBookingId(bookingId);
    setRejectReason('');
    setShowRejectModal(true);
    setShowDetails(false);
  };

  const submitRejection = () => {
    if (!rejectReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }
    handleStatusUpdate(rejectBookingId, 'REJECTED', rejectReason);
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

  const filteredBookings = activeFilter === 'ALL' 
    ? bookings 
    : bookings.filter(b => b.status === activeFilter);

  const pendingCount = bookings.filter(b => b.status === 'PENDING').length;
  const acceptedCount = bookings.filter(b => b.status === 'ACCEPTED').length;
  const completedCount = bookings.filter(b => b.status === 'COMPLETED').length;
  const rejectedCount = bookings.filter(b => b.status === 'REJECTED').length;
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
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="rounded-xl p-3 text-center" style={{ background: '#161B22', border: '1px solid #30363D' }}>
          <p className="text-2xl font-bold text-yellow-400">{pendingCount}</p>
          <p className="text-xs text-yellow-400">⏳ Pending</p>
        </div>
        <div className="rounded-xl p-3 text-center" style={{ background: '#161B22', border: '1px solid #30363D' }}>
          <p className="text-2xl font-bold text-blue-400">{acceptedCount}</p>
          <p className="text-xs text-blue-400">✅ Accepted</p>
        </div>
        <div className="rounded-xl p-3 text-center" style={{ background: '#161B22', border: '1px solid #30363D' }}>
          <p className="text-2xl font-bold text-green-400">{completedCount}</p>
          <p className="text-xs text-green-400">🎉 Completed</p>
        </div>
        <div className="rounded-xl p-3 text-center" style={{ background: '#161B22', border: '1px solid #30363D' }}>
          <p className="text-2xl font-bold text-red-400">{rejectedCount}</p>
          <p className="text-xs text-red-400">❌ Rejected</p>
        </div>
        <div className="rounded-xl p-3 text-center" style={{ background: '#161B22', border: '1px solid #30363D' }}>
          <p className="text-2xl font-bold text-gray-400">{cancelledCount}</p>
          <p className="text-xs text-gray-400">🚫 Cancelled</p>
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
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${getStatusColor(booking.status)}`}>
                      {getStatusIcon(booking.status)} {booking.status}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </span>
                    {booking.status === 'REJECTED' && booking.rejectionReason && (
                      <span className="text-xs text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full">
                        💬 {booking.rejectionReason.length > 20 ? booking.rejectionReason.substring(0, 20) + '...' : booking.rejectionReason}
                      </span>
                    )}
                    {booking.status === 'CANCELLED' && booking.cancelReason && (
                      <span className="text-xs text-gray-400 bg-gray-500/10 px-2 py-0.5 rounded-full">
                        💬 {booking.cancelReason.length > 20 ? booking.cancelReason.substring(0, 20) + '...' : booking.cancelReason}
                      </span>
                    )}
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
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-sm px-3 py-1 rounded-full border ${getStatusColor(selectedBooking.status)}`}>
                  {getStatusIcon(selectedBooking.status)} {selectedBooking.status}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(selectedBooking.createdAt).toLocaleString()}
                </span>
                
                {/* ✅ Show rejection reason if REJECTED */}
                {selectedBooking.status === 'REJECTED' && selectedBooking.rejectionReason && (
                  <div className="w-full mt-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-xs text-red-400 font-medium">❌ Rejection Reason:</p>
                    <p className="text-sm text-red-300">{selectedBooking.rejectionReason}</p>
                  </div>
                )}
                
                {/* ✅ Show cancellation reason if CANCELLED */}
                {selectedBooking.status === 'CANCELLED' && selectedBooking.cancelReason && (
                  <div className="w-full mt-2 p-3 bg-gray-500/10 border border-gray-500/20 rounded-lg">
                    <p className="text-xs text-gray-400 font-medium">🚫 Cancellation Reason:</p>
                    <p className="text-sm text-gray-300">{selectedBooking.cancelReason}</p>
                  </div>
                )}
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

              {/* ===== ACTIONS - ONLY 2 BUTTONS: Accept & Reject ===== */}
              {selectedBooking.status === 'PENDING' && (
                <div className="flex gap-3 pt-4 border-t border-gray-700">
                  <button
                    onClick={() => handleStatusUpdate(selectedBooking.id, 'ACCEPTED')}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    ✅ Accept
                  </button>
                  <button
                    onClick={() => openRejectModal(selectedBooking.id)}
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
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    ✅ Mark Complete
                  </button>
                </div>
              )}

              {/* ✅ Customer cancelled - contractor just views */}
              {selectedBooking.status === 'CANCELLED' && (
                <div className="pt-4 border-t border-gray-700">
                  <p className="text-sm text-gray-400 text-center">This booking was cancelled by the customer</p>
                </div>
              )}

              {/* ✅ Rejected - contractor just views */}
              {selectedBooking.status === 'REJECTED' && (
                <div className="pt-4 border-t border-gray-700">
                  <p className="text-sm text-gray-400 text-center">This booking was rejected</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===== REJECTION REASON MODAL ===== */}
      {showRejectModal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-[#161B22] rounded-2xl max-w-md w-full mx-4 border border-gray-700 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">❌ Reject Booking</h3>
              <button 
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                }}
                className="text-gray-400 hover:text-white text-2xl transition"
              >
                ✕
              </button>
            </div>

            <p className="text-gray-400 text-sm mb-4">
              Please provide a reason for rejecting this booking. This will be shared with the customer.
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Rejection Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g., I'm not available on this date, or I don't offer this service..."
                rows="4"
                className="w-full px-4 py-3 bg-[#0D1117] border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
              />
              <p className="text-xs text-gray-500 mt-1">{rejectReason.length}/500</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                }}
                className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={submitRejection}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                disabled={!rejectReason.trim()}
              >
                Reject Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;
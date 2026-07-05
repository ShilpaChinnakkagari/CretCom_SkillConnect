import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

axios.defaults.withCredentials = true;

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:8080/api/bookings/customer', {
        withCredentials: true
      });
      console.log('Bookings response:', response.data);
      setBookings(response.data);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      console.error('Error response:', error.response);
      setError(error.response?.data || 'Failed to load bookings');
      toast.error('Could not load your bookings');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-700';
      case 'PENDING': return 'bg-yellow-100 text-yellow-700';
      case 'ACCEPTED': return 'bg-blue-100 text-blue-700';
      case 'REJECTED': return 'bg-red-100 text-red-700';
      case 'CANCELLED': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading bookings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-sm">
        <span className="text-6xl block mb-4">⚠️</span>
        <h3 className="text-xl font-semibold text-red-600">Error loading bookings</h3>
        <p className="text-gray-400">{typeof error === 'string' ? error : 'Please try again'}</p>
        <button
          onClick={fetchBookings}
          className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-sm">
        <span className="text-6xl block mb-4">📋</span>
        <h3 className="text-xl font-semibold text-gray-600">No bookings yet</h3>
        <p className="text-gray-400">Start searching for service providers!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Provider</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Service</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Date</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Amount</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {bookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{booking.contractorName || 'N/A'}</td>
                <td className="px-4 py-3 text-gray-600">{booking.serviceCategory || 'N/A'}</td>
                <td className="px-4 py-3 text-gray-600">{booking.date || 'N/A'}</td>
                <td className="px-4 py-3 font-semibold">₹{booking.budget || 0}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                    {booking.status || 'PENDING'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingHistory;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

axios.defaults.withCredentials = true;

const BookingModal = ({ contractorId, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [contractor, setContractor] = useState(null);
  const [formData, setFormData] = useState({
    service: '',
    description: '',
    date: '',
    time: '',
    location: '',
    budget: ''
  });

  useEffect(() => {
    if (contractorId) {
      fetchContractorDetails();
    }
  }, [contractorId]);

  const fetchContractorDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/contractor/profile/full/${contractorId}`, {
        withCredentials: true
      });
      setContractor(response.data);
    } catch (error) {
      console.error('Error fetching contractor:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.service || !formData.date || !formData.time) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8080/bookings/create', {
        contractorId: contractorId,
        service: formData.service,
        description: formData.description,
        date: `${formData.date}T${formData.time}`,
        location: formData.location,
        budget: formData.budget ? parseFloat(formData.budget) : null
      }, {
        withCredentials: true
      });

      if (response.data) {
        toast.success('Booking request sent successfully!');
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error(error.response?.data?.error || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  if (!contractor) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-[#161B22] rounded-2xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-white mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-[#161B22] rounded-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto border border-gray-700">
        <div className="sticky top-0 bg-[#161B22] z-10 p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Book Service</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">✕</button>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-3 mb-4 p-3 bg-[#0D1117] rounded-lg border border-gray-700">
            <div className="w-12 h-12 rounded-full bg-gray-700 overflow-hidden flex-shrink-0">
              {contractor.profilePhoto ? (
                <img src={contractor.profilePhoto} alt={contractor.fullName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl text-gray-400">👤</div>
              )}
            </div>
            <div>
              <p className="text-white font-semibold">{contractor.fullName}</p>
              <p className="text-sm text-gray-400">{contractor.primaryCategory}</p>
              <p className="text-xs text-gray-500">⭐ {contractor.averageRating?.toFixed(1) || 0}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Service <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="service"
                value={formData.service}
                onChange={handleChange}
                placeholder="What service do you need?"
                className="w-full px-4 py-2 bg-[#0D1117] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                placeholder="Describe your requirement in detail..."
                className="w-full px-4 py-2 bg-[#0D1117] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-[#0D1117] border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-[#0D1117] border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Where should the service be provided?"
                className="w-full px-4 py-2 bg-[#0D1117] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Budget Expectation (₹)</label>
              <input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                placeholder="e.g., 5000"
                className="w-full px-4 py-2 bg-[#0D1117] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Recommended: ₹{contractor.minimumPrice || 0} - ₹{contractor.maximumPrice || 'Negotiable'}</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-medium"
            >
              {loading ? 'Sending request...' : '📩 Send Booking Request'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
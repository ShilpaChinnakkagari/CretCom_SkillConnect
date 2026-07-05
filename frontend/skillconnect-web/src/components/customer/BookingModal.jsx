import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

axios.defaults.withCredentials = true;

const BookingModal = ({ contractor, onClose, onSuccess, user }) => {
    const [formData, setFormData] = useState({
        date: '',
        time: '',
        address: '',
        description: '',
        budget: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.date) newErrors.date = 'Date is required';
        if (!formData.time) newErrors.time = 'Time is required';
        if (!formData.address) newErrors.address = 'Address is required';
        if (!formData.budget) newErrors.budget = 'Budget is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            const payload = {
                contractorId: contractor.id,
                date: formData.date,
                time: formData.time,
                address: formData.address,
                description: formData.description,
                budget: parseFloat(formData.budget)
            };

            console.log('Sending booking payload:', payload);

            const response = await axios.post('http://localhost:8080/api/bookings', payload, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log('Booking response:', response.data);

            toast.success('Booking request sent successfully!');
            onSuccess();
        } catch (error) {
            console.error('Booking error:', error);
            console.error('Error response:', error.response);
            console.error('Error data:', error.response?.data);
            
            if (error.response?.status === 401 || error.response?.status === 403) {
                toast.error('Session expired. Please login again.');
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
            } else {
                toast.error(error.response?.data?.message || 'Failed to book. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Book Service</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-2xl"
                    >
                        ✕
                    </button>
                </div>

                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <p className="font-semibold text-gray-800">{contractor.fullName}</p>
                    <p className="text-sm text-gray-600">{contractor.primaryCategory}</p>
                    <p className="text-sm text-gray-600">⭐ {contractor.stats?.averageRating || 0} ({contractor.stats?.totalCustomers || 0} customers)</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Date <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            min={new Date().toISOString().split('T')[0]}
                        />
                        {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Time <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="time"
                            name="time"
                            value={formData.time}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        />
                        {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Address <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Enter your address"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        />
                        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Budget (₹) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            name="budget"
                            value={formData.budget}
                            onChange={handleChange}
                            placeholder="Enter your budget"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        />
                        <p className="text-xs text-gray-400 mt-1">Recommended: ₹{contractor.minimumPrice} - ₹{contractor.maximumPrice}</p>
                        {errors.budget && <p className="text-red-500 text-sm mt-1">{errors.budget}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe what service you need..."
                            rows="3"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
                    >
                        {loading ? 'Sending Request...' : '📩 Send Booking Request'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BookingModal;
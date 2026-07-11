import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const pricingTypes = ['FIXED', 'HOURLY', 'PER_PROJECT', 'NEGOTIABLE'];
const serviceTypes = ['ONSITE', 'OFFSITE', 'BOTH'];

const Stage3Pricing = ({ formData, updateFormData, onNext, onBack, loading, setLoading }) => {
  const [errors, setErrors] = useState({});
  const [newArea, setNewArea] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    updateFormData({
      location: { ...formData.location, [name]: value }
    });
  };

  const handleAddServiceArea = () => {
    if (!newArea.trim()) {
      toast.error('Please enter a location');
      return;
    }

    const currentAreas = formData.serviceAreas || [];
    if (currentAreas.includes(newArea.trim())) {
      toast.error('Location already added');
      return;
    }

    updateFormData({
      serviceAreas: [...currentAreas, newArea.trim()]
    });
    setNewArea('');
    setErrors(prev => ({ ...prev, serviceAreas: '' }));
  };

  const handleRemoveServiceArea = (area) => {
    const updated = (formData.serviceAreas || []).filter(a => a !== area);
    updateFormData({ serviceAreas: updated });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.pricingType) newErrors.pricingType = 'Pricing type is required';
    if (!formData.minimumPrice) newErrors.minimumPrice = 'Minimum price is required';
    if (!formData.location?.address) newErrors.location = 'Location address is required';
    if (!formData.serviceAreas?.length) newErrors.serviceAreas = 'Add at least one service area';
    if (!formData.serviceType) newErrors.serviceType = 'Service type is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const userStr = localStorage.getItem('user');
      const userData = userStr ? JSON.parse(userStr) : null;
      const userId = userData?.id || userData?.userId;

      const stageData = {
        userId: userId,
        stage: 3,
        pricingType: formData.pricingType,
        baseServiceCharge: formData.baseServiceCharge,
        minimumPrice: formData.minimumPrice,
        maximumPrice: formData.maximumPrice,
        emergencyCharge: formData.emergencyCharge,
        priceNegotiable: formData.priceNegotiable,
        location: formData.location,
        serviceAreas: formData.serviceAreas || [],
        serviceRadius: formData.serviceRadius,
        homeServiceAvailable: formData.homeServiceAvailable,
        serviceType: formData.serviceType
      };

      console.log('Saving Stage 3:', stageData);
      const response = await axios.post('http://localhost:8080/contractor/register/stage', stageData, {
        withCredentials: true
      });

      if (response.data.success) {
        toast.success('Pricing & location saved!');
        onNext();
      }
    } catch (error) {
      console.error('Error saving stage 3:', error);
      toast.error(error.response?.data?.error || 'Failed to save pricing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">Pricing & Location</h2>
      <p className="text-gray-500 text-sm mb-6">Set your rates and service areas</p>

      <div className="space-y-6">
        {/* Pricing Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pricing Type <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-4">
            {pricingTypes.map(type => (
              <label key={type} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="pricingType"
                  value={type}
                  checked={formData.pricingType === type}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary-600"
                />
                <span className="text-sm capitalize">{type.toLowerCase().replace('_', ' ')}</span>
              </label>
            ))}
          </div>
          {errors.pricingType && <p className="text-red-500 text-sm mt-1">{errors.pricingType}</p>}
        </div>

        {/* Price Range */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Price (₹) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="minimumPrice"
              value={formData.minimumPrice}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="500"
            />
            {errors.minimumPrice && <p className="text-red-500 text-sm mt-1">{errors.minimumPrice}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Maximum Price (₹) <span className="text-gray-400 text-xs">(Optional)</span>
            </label>
            <input
              type="number"
              name="maximumPrice"
              value={formData.maximumPrice}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="5000"
            />
          </div>
        </div>

        {/* Emergency Charge & Negotiable */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Emergency Charge (₹) <span className="text-gray-400 text-xs">(Optional)</span>
            </label>
            <input
              type="number"
              name="emergencyCharge"
              value={formData.emergencyCharge}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price Negotiable?
            </label>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="priceNegotiable"
                  value="true"
                  checked={formData.priceNegotiable === true}
                  onChange={() => updateFormData({ priceNegotiable: true })}
                  className="w-4 h-4 text-primary-600"
                />
                <span className="text-sm">Yes</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="priceNegotiable"
                  value="false"
                  checked={formData.priceNegotiable === false}
                  onChange={() => updateFormData({ priceNegotiable: false })}
                  className="w-4 h-4 text-primary-600"
                />
                <span className="text-sm">No</span>
              </label>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="border-t pt-4">
          <h3 className="font-medium text-gray-700 mb-3">Location <span className="text-red-500">*</span></h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={formData.location?.address || ''}
                onChange={handleLocationChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Enter your full address"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.location?.city || ''}
                  onChange={handleLocationChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Mumbai"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.location?.pincode || ''}
                  onChange={handleLocationChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="400001"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <input
                type="text"
                name="state"
                value={formData.location?.state || ''}
                onChange={handleLocationChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Maharashtra"
              />
            </div>
            {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
          </div>
        </div>

        {/* Service Areas */}
        <div className="border-t pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Service Areas <span className="text-red-500">*</span>
          </label>
          
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newArea}
              onChange={(e) => setNewArea(e.target.value)}
              placeholder="Enter location (e.g., Andheri, Mumbai)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
            <button
              type="button"
              onClick={handleAddServiceArea}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
            >
              + Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {(formData.serviceAreas || []).map((area, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full"
              >
                <span className="text-sm">{area}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveServiceArea(area)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {errors.serviceAreas && <p className="text-red-500 text-sm mt-1">{errors.serviceAreas}</p>}
        </div>

        {/* Service Radius */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Service Radius (km)
          </label>
          <input
            type="number"
            name="serviceRadius"
            value={formData.serviceRadius}
            onChange={handleChange}
            min="1"
            max="100"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            placeholder="10"
          />
        </div>

        {/* Service Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Service Type <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-4">
            {serviceTypes.map(type => (
              <label key={type} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="serviceType"
                  value={type}
                  checked={formData.serviceType === type}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary-600"
                />
                <span className="text-sm capitalize">
                  {type === 'ONSITE' ? 'Go to customer' : 
                   type === 'OFFSITE' ? 'Customer comes to me' : 
                   'Both'}
                </span>
              </label>
            ))}
          </div>
          {errors.serviceType && <p className="text-red-500 text-sm mt-1">{errors.serviceType}</p>}
        </div>

        {/* Home Service */}
        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.homeServiceAvailable}
              onChange={() => updateFormData({ homeServiceAvailable: !formData.homeServiceAvailable })}
              className="w-4 h-4 text-primary-600"
            />
            <span className="text-sm">I offer home service (I travel to customer's location)</span>
          </label>
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-6 border-t">
          <button
            onClick={onBack}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            ← Back
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save & Continue →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Stage3Pricing;
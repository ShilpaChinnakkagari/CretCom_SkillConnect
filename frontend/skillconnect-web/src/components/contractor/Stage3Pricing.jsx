import React, { useState, useRef } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import AddressAutocomplete from '../AddressAutocomplete';

const pricingTypes = ['FIXED', 'HOURLY', 'PER_PROJECT', 'NEGOTIABLE'];
const serviceTypes = ['ONSITE', 'OFFSITE', 'BOTH'];

const Stage3Pricing = ({ formData, updateFormData, onNext, onBack, loading, setLoading }) => {
  const [errors, setErrors] = useState({});
  const [newArea, setNewArea] = useState('');
  const [resetKey, setResetKey] = useState(0);
  const inputRef = useRef(null);

  // ===== STARS (SUBTLE) =====
  const stars = Array.from({ length: 150 }, (_, i) => ({
    id: i,
    size: Math.random() * 2 + 0.5,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: 10 + Math.random() * 15,
    delay: Math.random() * 6,
    opacity: 0.2 + Math.random() * 0.4,
    isShining: Math.random() > 0.7,
    shineDuration: 2 + Math.random() * 3,
    shineDelay: Math.random() * 5,
  }));

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

  // ✅ Reset the input field
  const resetServiceAreaInput = () => {
    setNewArea('');
    setResetKey(prev => prev + 1); // Force re-render of AddressAutocomplete
  };

  // ✅ Handle Service Area autocomplete selection
  const handleServiceAreaSelect = (areaData) => {
    const areaName = areaData.address || areaData.label || areaData;
    const currentAreas = formData.serviceAreas || [];
    
    if (currentAreas.includes(areaName)) {
      toast.error('Location already added');
      resetServiceAreaInput();
      return;
    }

    updateFormData({
      serviceAreas: [...currentAreas, areaName]
    });
    resetServiceAreaInput();
    setErrors(prev => ({ ...prev, serviceAreas: '' }));
    toast.success('Service area added!');
  };

  const handleAddServiceArea = () => {
    if (!newArea.trim()) {
      toast.error('Please enter a location');
      return;
    }

    const currentAreas = formData.serviceAreas || [];
    if (currentAreas.includes(newArea.trim())) {
      toast.error('Location already added');
      resetServiceAreaInput();
      return;
    }

    updateFormData({
      serviceAreas: [...currentAreas, newArea.trim()]
    });
    resetServiceAreaInput();
    setErrors(prev => ({ ...prev, serviceAreas: '' }));
    toast.success('Service area added!');
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
    <div className="relative min-h-screen py-8 px-4 overflow-hidden bg-[#0a0a12]">

      {/* ===== SUBTLE BACKGROUND STARS ===== */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {stars.map((star) => (
          <div
            key={star.id}
            className={`absolute rounded-full ${star.isShining ? 'star-shining' : 'star-float'}`}
            style={{
              width: `${star.size}px`,
              height: `${star.size}px`,
              top: `${star.y}%`,
              left: `${star.x}%`,
              background: 'white',
              opacity: star.opacity,
              boxShadow: star.isShining 
                ? `0 0 ${star.size * 4}px rgba(255,255,255,0.3)`
                : 'none',
              '--duration': `${star.duration}s`,
              '--delay': `${star.delay}s`,
              '--shine-duration': `${star.shineDuration}s`,
              '--shine-delay': `${star.shineDelay}s`,
            }}
          />
        ))}
      </div>

      {/* ===== SUBTLE GLOW ORBS ===== */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 -left-48 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 -right-48 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* ===== INNER CARD ===== */}
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="bg-white rounded-2xl p-10 shadow-2xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Pricing & Location</h2>
          <p className="text-gray-500 text-sm mb-6">Set your rates and service areas</p>

          <div className="space-y-6">
            {/* Pricing Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pricing Type <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-4">
                {pricingTypes.map(type => (
                  <label key={type} className="flex items-center gap-2 text-gray-700">
                    <input
                      type="radio"
                      name="pricingType"
                      value={type}
                      checked={formData.pricingType === type}
                      onChange={handleChange}
                      className="w-4 h-4 text-indigo-600"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-800 placeholder-gray-400"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-800 placeholder-gray-400"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-800 placeholder-gray-400"
                  placeholder="200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price Negotiable?
                </label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2 text-gray-700">
                    <input
                      type="radio"
                      name="priceNegotiable"
                      value="true"
                      checked={formData.priceNegotiable === true}
                      onChange={() => updateFormData({ priceNegotiable: true })}
                      className="w-4 h-4 text-indigo-600"
                    />
                    <span className="text-sm">Yes</span>
                  </label>
                  <label className="flex items-center gap-2 text-gray-700">
                    <input
                      type="radio"
                      name="priceNegotiable"
                      value="false"
                      checked={formData.priceNegotiable === false}
                      onChange={() => updateFormData({ priceNegotiable: false })}
                      className="w-4 h-4 text-indigo-600"
                    />
                    <span className="text-sm">No</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-medium text-gray-700 mb-3">Location <span className="text-red-500">*</span></h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.location?.address || ''}
                    onChange={handleLocationChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-800 placeholder-gray-400"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-800 placeholder-gray-400"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-800 placeholder-gray-400"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-800 placeholder-gray-400"
                    placeholder="Maharashtra"
                  />
                </div>
                {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
              </div>
            </div>

            {/* Service Areas - WITH AUTOCOMPLETE & RESET */}
            <div className="border-t border-gray-200 pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Areas <span className="text-red-500">*</span>
              </label>
              
              <div className="flex gap-2 mb-3">
                <div className="flex-1">
                  <AddressAutocomplete
                    key={resetKey}
                    value={newArea}
                    onChange={handleServiceAreaSelect}
                    placeholder="Search and add service areas..."
                    className="w-full"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddServiceArea}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition whitespace-nowrap"
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
                    <span className="text-sm text-gray-700">{area}</span>
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-800 placeholder-gray-400"
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
                  <label key={type} className="flex items-center gap-2 text-gray-700">
                    <input
                      type="radio"
                      name="serviceType"
                      value={type}
                      checked={formData.serviceType === type}
                      onChange={handleChange}
                      className="w-4 h-4 text-indigo-600"
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
              <label className="flex items-center gap-2 text-gray-700">
                <input
                  type="checkbox"
                  checked={formData.homeServiceAvailable}
                  onChange={() => updateFormData({ homeServiceAvailable: !formData.homeServiceAvailable })}
                  className="w-4 h-4 text-indigo-600"
                />
                <span className="text-sm">I offer home service (I travel to customer's location)</span>
              </label>
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-6 border-t border-gray-200">
              <button
                onClick={onBack}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                ← Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save & Continue →'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(10px, -15px) scale(1.1); }
          50% { transform: translate(-5px, 10px) scale(0.9); }
          75% { transform: translate(15px, 5px) scale(1.05); }
          100% { transform: translate(0, 0) scale(1); }
        }
        .star-float {
          animation: float var(--duration) ease-in-out infinite;
          animation-delay: var(--delay);
          will-change: transform, opacity;
        }

        @keyframes starShine {
          0% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.5); opacity: 0.8; }
          100% { transform: scale(1); opacity: 0.2; }
        }
        .star-shining {
          animation: starShine var(--shine-duration) ease-in-out infinite;
          animation-delay: var(--shine-delay);
          will-change: transform, opacity;
        }
      `}</style>
    </div>
  );
};

export default Stage3Pricing;
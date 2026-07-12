import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const CustomerProfile = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phoneNumber: '',
    location: '',
    languages: [],
    preferences: {
      categories: [],
      budgetRange: '',
      locations: []
    }
  });
  const [isEditing, setIsEditing] = useState(false);

  const languages = ['Hindi', 'English', 'Telugu', 'Tamil', 'Kannada', 'Malayalam', 'Marathi', 'Gujarati', 'Bengali', 'Punjabi'];
  const categories = ['Construction', 'Beauty', 'Education', 'Technology', 'Home Services', 'Events', 'Property', 'Health', 'Pet Services', 'Food Services', 'Art & Hobby', 'Appliance Service'];

  useEffect(() => {
    fetchCustomerProfile();
  }, [user]);

  const fetchCustomerProfile = async () => {
    try {
      // You can create a separate endpoint for customer profile
      // For now, we'll use user data
      setProfile(prev => ({
        ...prev,
        name: user?.name || '',
        email: user?.email || '',
        phoneNumber: user?.phoneNumber || '',
      }));
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handlePreferencesChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      preferences: { ...prev.preferences, [field]: value }
    }));
  };

  const toggleArrayField = (field, value) => {
    setProfile(prev => {
      const current = prev[field] || [];
      const updated = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value];
      return { ...prev, [field]: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Save customer profile
      await axios.put('http://localhost:8080/customer/profile', profile, {
        withCredentials: true
      });
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">👤 My Profile</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          {isEditing ? 'Cancel' : '✏️ Edit Profile'}
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Basic Info */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg ${
                  isEditing ? 'focus:ring-2 focus:ring-indigo-500 focus:border-transparent' : 'bg-gray-50'
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={profile.email}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
              />
              <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={profile.phoneNumber}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg ${
                  isEditing ? 'focus:ring-2 focus:ring-indigo-500 focus:border-transparent' : 'bg-gray-50'
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={profile.location}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg ${
                  isEditing ? 'focus:ring-2 focus:ring-indigo-500 focus:border-transparent' : 'bg-gray-50'
                }`}
              />
            </div>
          </div>

          {isEditing && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Languages Spoken</label>
              <div className="flex flex-wrap gap-2">
                {languages.map(lang => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => toggleArrayField('languages', lang)}
                    className={`px-3 py-1 rounded-full text-sm transition ${
                      profile.languages?.includes(lang)
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!isEditing && profile.languages?.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700">Languages</p>
              <p className="text-gray-600">{profile.languages.join(', ')}</p>
            </div>
          )}
        </div>

        {/* Preferences */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Categories</label>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      if (isEditing) {
                        const current = profile.preferences?.categories || [];
                        const updated = current.includes(cat)
                          ? current.filter(c => c !== cat)
                          : [...current, cat];
                        handlePreferencesChange('categories', updated);
                      }
                    }}
                    className={`px-3 py-1 rounded-full text-sm transition ${
                      profile.preferences?.categories?.includes(cat)
                        ? 'bg-indigo-600 text-white'
                        : isEditing ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              {!isEditing && !profile.preferences?.categories?.length && (
                <p className="text-gray-500 text-sm">No preferences set</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Budget Range</label>
              <select
                name="budgetRange"
                value={profile.preferences?.budgetRange || ''}
                onChange={(e) => handlePreferencesChange('budgetRange', e.target.value)}
                disabled={!isEditing}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg ${
                  isEditing ? 'focus:ring-2 focus:ring-indigo-500 focus:border-transparent' : 'bg-gray-50'
                }`}
              >
                <option value="">Select budget range</option>
                <option value="0-500">₹0 - ₹500</option>
                <option value="500-2000">₹500 - ₹2,000</option>
                <option value="2000-5000">₹2,000 - ₹5,000</option>
                <option value="5000-10000">₹5,000 - ₹10,000</option>
                <option value="10000+">₹10,000+</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">0</p>
              <p className="text-xs text-gray-500">Services Booked</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">0</p>
              <p className="text-xs text-gray-500">Favorite Experts</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">0</p>
              <p className="text-xs text-gray-500">Reviews Given</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">₹0</p>
              <p className="text-xs text-gray-500">Total Spent</p>
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="mt-6 flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : '💾 Save Changes'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default CustomerProfile;
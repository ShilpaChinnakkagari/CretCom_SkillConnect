import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

axios.defaults.withCredentials = true;

const CustomerProfile = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    location: user?.location || '',
    languages: user?.languages || [],
    preferences: user?.preferences || {
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

  const getCurrentUserId = () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      const userData = JSON.parse(userStr);
      return userData?.id || userData?.userId || null;
    } catch {
      return null;
    }
  };

  const fetchCustomerProfile = async () => {
    try {
      const userId = getCurrentUserId();
      if (!userId) return;

      const response = await axios.get('http://localhost:8080/customer/profile', {
        withCredentials: true
      });

      if (response.data) {
        const userData = response.data;
        setProfile({
          name: userData.name || user?.name || '',
          email: userData.email || user?.email || '',
          phoneNumber: userData.phoneNumber || '',
          location: userData.location || '',
          languages: userData.languages || [],
          preferences: userData.preferences || {
            categories: [],
            budgetRange: '',
            locations: []
          }
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Fallback to user data from localStorage
      if (user) {
        setProfile(prev => ({
          ...prev,
          name: user.name || '',
          email: user.email || '',
          phoneNumber: user.phoneNumber || '',
        }));
      }
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
      const response = await axios.put('http://localhost:8080/customer/profile', {
        name: profile.name,
        phoneNumber: profile.phoneNumber,
        location: profile.location,
        languages: profile.languages || [],
        preferences: profile.preferences || {}
      }, {
        withCredentials: true
      });

      if (response.data) {
        toast.success('Profile updated successfully!');
        setIsEditing(false);
        
        // Update user in localStorage
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const userData = JSON.parse(userStr);
          userData.name = profile.name;
          userData.phoneNumber = profile.phoneNumber;
          userData.location = profile.location;
          userData.languages = profile.languages;
          userData.preferences = profile.preferences;
          localStorage.setItem('user', JSON.stringify(userData));
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl p-6" style={{ background: '#161B22', border: '1px solid #30363D' }}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">👤 My Profile</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          {isEditing ? 'Cancel' : '✏️ Edit Profile'}
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-2 border rounded-lg text-white ${
                  isEditing 
                    ? 'bg-[#0D1117] border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                    : 'bg-[#0D1117]/50 border-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
              <input
                type="email"
                value={profile.email}
                disabled
                className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-[#0D1117]/50 text-gray-400 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={profile.phoneNumber}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-2 border rounded-lg text-white ${
                  isEditing 
                    ? 'bg-[#0D1117] border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                    : 'bg-[#0D1117]/50 border-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={profile.location}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-2 border rounded-lg text-white ${
                  isEditing 
                    ? 'bg-[#0D1117] border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                    : 'bg-[#0D1117]/50 border-gray-700 text-gray-400 cursor-not-allowed'
                }`}
                placeholder="e.g., City, State, Country"
              />
            </div>
          </div>

          {isEditing && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Languages Spoken</label>
              <div className="flex flex-wrap gap-2">
                {languages.map(lang => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => toggleArrayField('languages', lang)}
                    className={`px-3 py-1 rounded-full text-sm transition ${
                      profile.languages?.includes(lang)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
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
              <p className="text-sm font-medium text-gray-300">Languages</p>
              <p className="text-gray-400">{profile.languages.join(', ')}</p>
            </div>
          )}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Preferences</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Preferred Categories</label>
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
                        ? 'bg-blue-600 text-white'
                        : isEditing 
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                          : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              {!isEditing && !profile.preferences?.categories?.length && (
                <p className="text-gray-500 text-sm mt-1">No preferences set</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Budget Range</label>
              <select
                name="budgetRange"
                value={profile.preferences?.budgetRange || ''}
                onChange={(e) => handlePreferencesChange('budgetRange', e.target.value)}
                disabled={!isEditing}
                className={`w-full px-4 py-2 border rounded-lg text-white ${
                  isEditing 
                    ? 'bg-[#0D1117] border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                    : 'bg-[#0D1117]/50 border-gray-700 text-gray-400 cursor-not-allowed'
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

        <div className="mt-6 pt-6 border-t border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Activity Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#0D1117] rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-white">0</p>
              <p className="text-xs text-gray-400">Services Booked</p>
            </div>
            <div className="bg-[#0D1117] rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-white">0</p>
              <p className="text-xs text-gray-400">Favorite Experts</p>
            </div>
            <div className="bg-[#0D1117] rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-white">0</p>
              <p className="text-xs text-gray-400">Reviews Given</p>
            </div>
            <div className="bg-[#0D1117] rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-white">₹0</p>
              <p className="text-xs text-gray-400">Total Spent</p>
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="mt-6 flex justify-end gap-3 pt-6 border-t border-gray-700">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-6 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
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
import React, { useState, useRef } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const languages = [
  'Hindi', 'English', 'Telugu', 'Tamil', 'Kannada',
  'Malayalam', 'Marathi', 'Gujarati', 'Punjabi', 'Bengali'
];

const Stage1BasicProfile = ({ formData, updateFormData, onNext, user, loading, setLoading }) => {
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleLanguageToggle = (lang) => {
    const current = formData.languagesSpoken || [];
    const updated = current.includes(lang)
      ? current.filter(l => l !== lang)
      : [...current, lang];
    updateFormData({ languagesSpoken: updated });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateFormData({ profilePhoto: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName?.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.phoneNumber?.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (formData.phoneNumber?.length < 10) newErrors.phoneNumber = 'Phone number must be at least 10 digits';
    if (!formData.languagesSpoken?.length) newErrors.languagesSpoken = 'Select at least one language';
    if (!formData.aboutMe?.trim()) newErrors.aboutMe = 'About me is required';
    if (formData.aboutMe?.length < 20) newErrors.aboutMe = 'About me must be at least 20 characters';
    if (!formData.profilePhoto) newErrors.profilePhoto = 'Profile photo is required';
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
        stage: 1,
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        whatsappNumber: formData.whatsappNumber,
        languagesSpoken: formData.languagesSpoken,
        aboutMe: formData.aboutMe,
        preferredContact: formData.preferredContact,
        profilePhoto: formData.profilePhoto
      };

      console.log('Saving Stage 1:', stageData);
      const response = await axios.post('http://localhost:8080/contractor/register/stage', stageData, {
        withCredentials: true
      });

      if (response.data.success) {
        toast.success('Profile saved!');
        onNext();
      }
    } catch (error) {
      console.error('Error saving stage 1:', error);
      toast.error(error.response?.data?.error || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">Basic Profile</h2>
      <p className="text-gray-500 text-sm mb-6">Tell us about yourself</p>

      <div className="space-y-6">
        {/* Profile Photo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profile Photo <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center border-2 border-dashed border-gray-300">
              {formData.profilePhoto ? (
                <img src={formData.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-400 text-2xl">📸</span>
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
            >
              Upload Photo
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />
          </div>
          {errors.profilePhoto && <p className="text-red-500 text-sm mt-1">{errors.profilePhoto}</p>}
        </div>

        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Enter your full name"
          />
          {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
        </div>

        {/* Email (Read-only) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={formData.email}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
            readOnly
          />
          <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Enter phone number"
          />
          {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
        </div>

        {/* WhatsApp Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            WhatsApp Number <span className="text-gray-400 text-xs">(Optional)</span>
          </label>
          <input
            type="tel"
            name="whatsappNumber"
            value={formData.whatsappNumber}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Enter WhatsApp number"
          />
        </div>

        {/* Languages Spoken */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Languages Spoken <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {languages.map(lang => (
              <button
                key={lang}
                type="button"
                onClick={() => handleLanguageToggle(lang)}
                className={`px-3 py-1 rounded-full text-sm transition ${
                  formData.languagesSpoken?.includes(lang)
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
          {errors.languagesSpoken && <p className="text-red-500 text-sm mt-1">{errors.languagesSpoken}</p>}
        </div>

        {/* About Me */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            About Me <span className="text-red-500">*</span>
          </label>
          <textarea
            name="aboutMe"
            value={formData.aboutMe}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Tell customers about your experience, expertise, and what makes you special..."
          />
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">{formData.aboutMe?.length || 0} characters</span>
            {errors.aboutMe && <span className="text-red-500">{errors.aboutMe}</span>}
          </div>
        </div>

        {/* Preferred Contact */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Contact Method <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-4">
            {['CALL', 'WHATSAPP', 'IN_APP_CHAT'].map(method => (
              <label key={method} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="preferredContact"
                  value={method}
                  checked={formData.preferredContact === method}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary-600"
                />
                <span className="text-sm">{method.replace('_', ' ')}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-end pt-6 border-t">
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

export default Stage1BasicProfile;
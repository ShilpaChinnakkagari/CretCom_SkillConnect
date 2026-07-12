import React, { useState, useRef } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import PhoneVerification from './PhoneVerification';

const languages = [
  'Hindi', 'English', 'Telugu', 'Tamil', 'Kannada',
  'Malayalam', 'Marathi', 'Gujarati', 'Punjabi', 'Bengali'
];

const Stage1BasicProfile = ({ formData, updateFormData, onNext, user, loading, setLoading }) => {
  const [errors, setErrors] = useState({});
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const fileInputRef = useRef(null);

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

  const handlePhoneVerification = (verifiedPhone) => {
    setIsOtpVerified(true);
    toast.success('Phone number verified successfully!');
  };

  const handlePhoneVerificationError = (error) => {
    console.error('Phone verification error:', error);
    setIsOtpVerified(false);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName?.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.phoneNumber?.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (formData.phoneNumber?.length < 10) newErrors.phoneNumber = 'Phone number must be at least 10 digits';
    if (!isOtpVerified) newErrors.phoneNumber = 'Please verify your phone number first';
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
        phoneVerified: isOtpVerified,
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

      {/* ===== INNER CARD - WIDER ===== */}
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="bg-white rounded-2xl p-10 shadow-2xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Basic Profile</h2>
          <p className="text-gray-500 text-sm mb-6">Tell us about yourself</p>

          <div className="space-y-6">
            {/* Profile Photo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Photo <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center border-2 border-dashed border-gray-300">
                  {formData.profilePhoto ? (
                    <img src={formData.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-400 text-2xl">📸</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 text-gray-700 text-sm transition"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-800 placeholder-gray-400"
                placeholder="Enter your full name"
              />
              {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                readOnly
              />
              <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-3 items-end">
                <div className="flex-1">
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    disabled={isOtpVerified}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-800 placeholder-gray-400 ${
                      isOtpVerified ? 'bg-green-50 border-green-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter phone number (e.g., 9876543210)"
                  />
                </div>
                <div className="flex-shrink-0">
                  <PhoneVerification
                    phoneNumber={formData.phoneNumber}
                    onVerified={handlePhoneVerification}
                    onError={handlePhoneVerificationError}
                  />
                </div>
              </div>
              {isOtpVerified && (
                <p className="text-green-600 text-sm mt-1">✅ Phone number verified</p>
              )}
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-800 placeholder-gray-400"
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
                        ? 'bg-indigo-600 text-white'
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-800 placeholder-gray-400"
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
                  <label key={method} className="flex items-center gap-2 text-gray-700">
                    <input
                      type="radio"
                      name="preferredContact"
                      value={method}
                      checked={formData.preferredContact === method}
                      onChange={handleChange}
                      className="w-4 h-4 text-indigo-600"
                    />
                    <span className="text-sm">{method.replace('_', ' ')}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-end pt-6 border-t border-gray-200">
              <button
                onClick={handleSubmit}
                disabled={loading || !isOtpVerified}
                className={`px-6 py-2 rounded-lg transition ${
                  isOtpVerified 
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105 shadow-lg shadow-indigo-500/25' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {loading ? 'Saving...' : 'Save & Continue →'}
              </button>
            </div>
            {!isOtpVerified && (
              <p className="text-amber-500 text-sm text-right">
                ⚠️ Please verify your phone number to continue
              </p>
            )}
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

export default Stage1BasicProfile;
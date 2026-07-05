import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

import Stage1BasicProfile from '../components/contractor/Stage1BasicProfile';
import Stage2Skills from '../components/contractor/Stage2Skills';
import Stage3Pricing from '../components/contractor/Stage3Pricing';
import Stage4Portfolio from '../components/contractor/Stage4Portfolio';
import Stage5Availability from '../components/contractor/Stage5Availability';

axios.defaults.withCredentials = true;

const ContractorRegistration = () => {
  const navigate = useNavigate();
  const [currentStage, setCurrentStage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [existingProfile, setExistingProfile] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    whatsappNumber: '',
    languagesSpoken: [],
    aboutMe: '',
    preferredContact: 'CALL',
    profilePhoto: null,
    primaryCategory: '',
    secondarySkills: [],
    yearsOfExperience: '',
    skillLevel: 'INTERMEDIATE',
    workTypes: [],
    specializations: [],
    teamSize: 'SOLO',
    idType: '',
    idNumber: '',
    idProofUrl: null,
    pricingType: 'FIXED',
    baseServiceCharge: '',
    minimumPrice: '',
    maximumPrice: '',
    emergencyCharge: '',
    priceNegotiable: true,
    location: {
      address: '',
      latitude: '',
      longitude: '',
      city: '',
      state: '',
      country: 'India',
      pincode: ''
    },
    serviceAreas: [],
    serviceRadius: 10,
    homeServiceAvailable: true,
    serviceType: 'BOTH',
    portfolio: [],
    socialLinks: [],
    shopName: '',
    shopAddress: '',
    shopPhotos: [],
    weeklySchedule: [
      { day: 'MONDAY', available: true, startTime: '09:00', endTime: '18:00' },
      { day: 'TUESDAY', available: true, startTime: '09:00', endTime: '18:00' },
      { day: 'WEDNESDAY', available: true, startTime: '09:00', endTime: '18:00' },
      { day: 'THURSDAY', available: true, startTime: '09:00', endTime: '18:00' },
      { day: 'FRIDAY', available: true, startTime: '09:00', endTime: '18:00' },
      { day: 'SATURDAY', available: true, startTime: '09:00', endTime: '14:00' },
      { day: 'SUNDAY', available: false, startTime: '', endTime: '' }
    ],
    timeSlots: ['FULL_DAY'],
    emergencyAvailability: false,
    holidayWorking: false,
    blockedDates: [],
    termsAccepted: false
  });

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const parsed = JSON.parse(userStr);
      setUser(parsed);
      setFormData(prev => ({
        ...prev,
        fullName: parsed.name || '',
        email: parsed.email || ''
      }));
    } else {
      navigate('/login');
    }

    // Check if contractor profile already exists
    checkExistingProfile();
  }, []);

  const checkExistingProfile = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/contractor/profile', {
        withCredentials: true
      });
      if (response.data && response.data.id) {
        setExistingProfile(true);
        toast.info('You already have a contractor profile. Redirecting to dashboard...');
        setTimeout(() => navigate('/contractor-dashboard'), 1500);
      }
    } catch (error) {
      // 404 means no profile exists - that's fine
      if (error.response?.status !== 404) {
        console.error('Error checking profile:', error);
      }
    }
  };

  const updateFormData = (newData) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const handleNext = () => {
    setCurrentStage(prev => prev + 1);
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setCurrentStage(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  if (existingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Your profile exists. Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  const totalStages = 5;

  const renderStage = () => {
    switch (currentStage) {
      case 1:
        return (
          <Stage1BasicProfile
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext}
            user={user}
            loading={loading}
            setLoading={setLoading}
          />
        );
      case 2:
        return (
          <Stage2Skills
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext}
            onBack={handleBack}
            loading={loading}
            setLoading={setLoading}
          />
        );
      case 3:
        return (
          <Stage3Pricing
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext}
            onBack={handleBack}
            loading={loading}
            setLoading={setLoading}
          />
        );
      case 4:
        return (
          <Stage4Portfolio
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext}
            onBack={handleBack}
            loading={loading}
            setLoading={setLoading}
          />
        );
      case 5:
        return (
          <Stage5Availability
            formData={formData}
            updateFormData={updateFormData}
            onBack={handleBack}
            loading={loading}
            setLoading={setLoading}
            navigate={navigate}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Become a Service Provider</h1>
          <p className="text-gray-600 mt-2">
            Complete your profile to start receiving bookings
          </p>
        </div>

        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-primary-600">
              Stage {currentStage} of {totalStages}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round((currentStage / totalStages) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-primary-600 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${(currentStage / totalStages) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          {renderStage()}
        </div>

        <div className="flex justify-center mt-6 gap-2">
          {[...Array(totalStages)].map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-colors ${
                index + 1 === currentStage
                  ? 'bg-primary-600'
                  : index + 1 < currentStage
                  ? 'bg-primary-300'
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContractorRegistration;
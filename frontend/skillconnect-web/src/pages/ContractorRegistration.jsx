import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

import Stage1BasicProfile from '../components/contractor/Stage1BasicProfile';
import Stage2Skills from '../components/contractor/Stage2Skills';
import Stage3Pricing from '../components/contractor/Stage3Pricing';
import Stage4Portfolio from '../components/contractor/Stage4Portfolio';
import Stage5Availability from '../components/contractor/Stage5Availability';

axios.defaults.baseURL = 'http://localhost:8080';

const ContractorRegistration = () => {
  const navigate = useNavigate();
  const [currentStage, setCurrentStage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [checkingProfile, setCheckingProfile] = useState(true);
  const [existingContractor, setExistingContractor] = useState(null);

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
      return;
    }

    checkExistingProfile();
  }, []);

  const checkExistingProfile = async () => {
    try {
      const userStr = localStorage.getItem('user');
      const userData = userStr ? JSON.parse(userStr) : null;
      const userId = userData?.id || userData?.userId;
      
      if (!userId) {
        setCheckingProfile(false);
        return;
      }

      // ============ FIX: Check registration stage to resume ============
      const response = await axios.get('/contractor/profile/stage', {
        params: { userId: userId }
      });
      
      if (response.data.exists && response.data.registrationComplete === true) {
        toast.success('You are already registered!');
        navigate('/contractor-dashboard');
        return;
      }
      
      if (response.data.exists && response.data.contractor) {
        // Resume from saved stage
        const contractor = response.data.contractor;
        setExistingContractor(contractor);
        
        // Populate form data with saved contractor data
        const savedStage = contractor.currentRegistrationStage || 1;
        setCurrentStage(savedStage + 1); // Go to next stage after saved
        
        // Load saved data into form
        setFormData(prev => ({
          ...prev,
          fullName: contractor.fullName || prev.fullName,
          phoneNumber: contractor.phoneNumber || prev.phoneNumber,
          whatsappNumber: contractor.whatsappNumber || prev.whatsappNumber,
          languagesSpoken: contractor.languagesSpoken || prev.languagesSpoken,
          aboutMe: contractor.aboutMe || prev.aboutMe,
          preferredContact: contractor.preferredContact || prev.preferredContact,
          profilePhoto: contractor.profilePhoto || prev.profilePhoto,
          primaryCategory: contractor.primaryCategory || prev.primaryCategory,
          secondarySkills: contractor.secondarySkills || prev.secondarySkills,
          yearsOfExperience: contractor.yearsOfExperience || prev.yearsOfExperience,
          skillLevel: contractor.skillLevel || prev.skillLevel,
          workTypes: contractor.workTypes || prev.workTypes,
          teamSize: contractor.teamSize || prev.teamSize,
          pricingType: contractor.pricingType || prev.pricingType,
          baseServiceCharge: contractor.baseServiceCharge || prev.baseServiceCharge,
          minimumPrice: contractor.minimumPrice || prev.minimumPrice,
          maximumPrice: contractor.maximumPrice || prev.maximumPrice,
          emergencyCharge: contractor.emergencyCharge || prev.emergencyCharge,
          priceNegotiable: contractor.priceNegotiable !== null ? contractor.priceNegotiable : prev.priceNegotiable,
          location: contractor.location || prev.location,
          serviceAreas: contractor.serviceAreas || prev.serviceAreas,
          serviceRadius: contractor.serviceRadius || prev.serviceRadius,
          homeServiceAvailable: contractor.homeServiceAvailable !== null ? contractor.homeServiceAvailable : prev.homeServiceAvailable,
          serviceType: contractor.serviceType || prev.serviceType,
          portfolio: contractor.portfolio || prev.portfolio,
          socialLinks: contractor.socialLinks || prev.socialLinks,
          shopName: contractor.shopName || prev.shopName,
          shopAddress: contractor.shopAddress || prev.shopAddress,
          shopPhotos: contractor.shopPhotos || prev.shopPhotos,
          weeklySchedule: contractor.weeklySchedule || prev.weeklySchedule,
          timeSlots: contractor.timeSlots || prev.timeSlots,
          emergencyAvailability: contractor.emergencyAvailability !== null ? contractor.emergencyAvailability : prev.emergencyAvailability,
          holidayWorking: contractor.holidayWorking !== null ? contractor.holidayWorking : prev.holidayWorking,
          termsAccepted: contractor.termsAccepted || prev.termsAccepted
        }));
        
        toast.info(`Resuming from Stage ${savedStage + 1}`);
      }
      
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('No existing profile - new user registration');
      } else {
        console.error('Error checking profile:', error);
      }
    } finally {
      setCheckingProfile(false);
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

  const handleFinalSubmit = async () => {
    setLoading(true);
    try {
      const userStr = localStorage.getItem('user');
      const userData = userStr ? JSON.parse(userStr) : null;
      
      const submitData = {
        ...formData,
        userId: userData?.id || userData?.userId
      };
      
      console.log('Submitting registration data with userId:', submitData.userId);
      const response = await axios.post('/contractor/register/complete', submitData);
      
      if (response.data) {
        toast.success('🎉 Registration complete! Welcome to SkillConnect!');
        setTimeout(() => {
          navigate('/contractor-dashboard');
        }, 1500);
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errorMsg = error.response?.data?.error || error.response?.data || 'Failed to complete registration';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (checkingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking your profile...</p>
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
            onSubmit={handleFinalSubmit}
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
          <p className="text-gray-600 mt-2">Complete your profile to start receiving bookings</p>
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
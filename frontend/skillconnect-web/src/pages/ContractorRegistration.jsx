import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import LanguageSwitcher from '../components/LanguageSwitcher';

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

  const stars = Array.from({ length: 200 }, (_, i) => ({
    id: i,
    size: Math.random() * 2.5 + 0.5,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: 10 + Math.random() * 15,
    delay: Math.random() * 6,
    opacity: 0.3 + Math.random() * 0.7,
    isShining: Math.random() > 0.6,
    shineDuration: 1.5 + Math.random() * 2,
    shineDelay: Math.random() * 5,
  }));

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

      const response = await axios.get('/contractor/profile/stage', {
        params: { userId: userId }
      });
      
      if (response.data.exists && response.data.registrationComplete === true) {
        toast.success('You are already registered!');
        navigate('/contractor-dashboard');
        return;
      }
      
      if (response.data.exists && response.data.contractor) {
        const contractor = response.data.contractor;
        setExistingContractor(contractor);
        
        const savedStage = contractor.currentRegistrationStage || 1;
        setCurrentStage(savedStage + 1);
        
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
      <div className="relative min-h-screen flex items-center justify-center bg-[#0a0a12] overflow-hidden">
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
                background: star.isShining 
                  ? 'radial-gradient(circle, rgba(255,255,255,1), rgba(255,255,255,0.5))'
                  : 'white',
                opacity: star.opacity,
                boxShadow: star.isShining 
                  ? `0 0 ${star.size * 6}px rgba(255,255,255,0.8), 0 0 ${star.size * 12}px rgba(255,255,255,0.4)`
                  : `0 0 ${star.size * 2}px rgba(255,255,255,${star.opacity * 0.15})`,
                '--duration': `${star.duration}s`,
                '--delay': `${star.delay}s`,
                '--shine-duration': `${star.shineDuration}s`,
                '--shine-delay': `${star.shineDelay}s`,
              }}
            />
          ))}
        </div>
        <div className="text-center relative z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-400">Checking your profile...</p>
        </div>
        <LanguageSwitcher />
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
    <div className="relative min-h-screen py-8 px-4 overflow-hidden bg-[#0a0a12]">

      {/* ===== OUTER BACKGROUND STARS ===== */}
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
              background: star.isShining 
                ? 'radial-gradient(circle, rgba(255,255,255,1), rgba(255,255,255,0.5))'
                : 'white',
              opacity: star.opacity,
              boxShadow: star.isShining 
                ? `0 0 ${star.size * 6}px rgba(255,255,255,0.8), 0 0 ${star.size * 12}px rgba(255,255,255,0.4)`
                : `0 0 ${star.size * 2}px rgba(255,255,255,${star.opacity * 0.15})`,
              '--duration': `${star.duration}s`,
              '--delay': `${star.delay}s`,
              '--shine-duration': `${star.shineDuration}s`,
              '--shine-delay': `${star.shineDelay}s`,
            }}
          />
        ))}
      </div>

      {/* ===== OUTER GLOW ORBS ===== */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* ===== MAIN CONTENT - 70% WIDE ===== */}
      <div className="max-w-5xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Become a Service Provider</h1>
          <p className="text-gray-300 mt-2">Complete your profile to start receiving bookings</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-indigo-400">
              Stage {currentStage} of {totalStages}
            </span>
            <span className="text-sm text-gray-400">
              {Math.round((currentStage / totalStages) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-700/50 rounded-full h-2.5">
            <div
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${(currentStage / totalStages) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Inner Card - Glass Effect */}
        <div 
          className="rounded-2xl p-6 md:p-8 border border-white/10"
          style={{
            background: 'linear-gradient(135deg, rgba(17, 17, 27, 0.95), rgba(30, 27, 45, 0.95))',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.3), inset 0 0 60px rgba(255,255,255,0.02)',
          }}
        >
          {renderStage()}
        </div>

        {/* Dots */}
        <div className="flex justify-center mt-6 gap-2">
          {[...Array(totalStages)].map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-colors ${
                index + 1 === currentStage
                  ? 'bg-indigo-500'
                  : index + 1 < currentStage
                  ? 'bg-indigo-400/50'
                  : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>

      <LanguageSwitcher />

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
          0% { transform: scale(1) rotate(0deg); opacity: 0.3; }
          25% { transform: scale(1.8) rotate(45deg); opacity: 1; }
          50% { transform: scale(0.7) rotate(90deg); opacity: 0.5; }
          75% { transform: scale(2) rotate(135deg); opacity: 0.9; }
          100% { transform: scale(1) rotate(180deg); opacity: 0.3; }
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

export default ContractorRegistration;
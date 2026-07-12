import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
const timeSlots = ['MORNING', 'AFTERNOON', 'EVENING', 'FULL_DAY'];

const Stage5Availability = ({ formData, updateFormData, onBack, loading, setLoading, navigate, onSubmit }) => {
  const [errors, setErrors] = useState({});

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

  const handleScheduleChange = (index, field, value) => {
    const schedule = [...(formData.weeklySchedule || [])];
    schedule[index] = { ...schedule[index], [field]: value };
    updateFormData({ weeklySchedule: schedule });
  };

  const handleTimeSlotToggle = (slot) => {
    const current = formData.timeSlots || [];
    const updated = current.includes(slot)
      ? current.filter(s => s !== slot)
      : [...current, slot];
    updateFormData({ timeSlots: updated });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.weeklySchedule?.some(d => d.available)) {
      newErrors.weeklySchedule = 'Select at least one working day';
    }
    if (!formData.termsAccepted) {
      newErrors.termsAccepted = 'You must accept the terms to continue';
    }
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
        stage: 5,
        weeklySchedule: formData.weeklySchedule || [],
        timeSlots: formData.timeSlots || [],
        emergencyAvailability: formData.emergencyAvailability,
        holidayWorking: formData.holidayWorking,
        blockedDates: formData.blockedDates || [],
        termsAccepted: formData.termsAccepted
      };

      console.log('Saving Stage 5 (Completing Registration):', stageData);
      const response = await axios.post('http://localhost:8080/contractor/register/stage', stageData, {
        withCredentials: true
      });

      if (response.data.success) {
        toast.success('🎉 Registration Complete! Welcome to SkillConnect!');
        setTimeout(() => {
          navigate('/contractor-dashboard');
        }, 1500);
      }
    } catch (error) {
      console.error('Error completing registration:', error);
      toast.error(error.response?.data?.error || 'Failed to complete registration');
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

      {/* ===== INNER CARD - SAME AS STAGE 1, 2, 3 & 4 ===== */}
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="bg-white rounded-2xl p-10 shadow-2xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Availability & Submit</h2>
          <p className="text-gray-500 text-sm mb-6">Set your working hours and complete registration</p>

          <div className="space-y-6">
            {/* Weekly Schedule */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Weekly Schedule <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                {days.map((day, index) => {
                  const schedule = formData.weeklySchedule?.[index] || {};
                  return (
                    <div key={day} className="flex items-center gap-4">
                      <div className="w-24">
                        <label className="flex items-center gap-2 text-gray-700">
                          <input
                            type="checkbox"
                            checked={schedule.available || false}
                            onChange={(e) => handleScheduleChange(index, 'available', e.target.checked)}
                            className="w-4 h-4 text-indigo-600"
                          />
                          <span className="text-sm font-medium">{day.charAt(0) + day.slice(1).toLowerCase()}</span>
                        </label>
                      </div>
                      {schedule.available && (
                        <>
                          <input
                            type="time"
                            value={schedule.startTime || '09:00'}
                            onChange={(e) => handleScheduleChange(index, 'startTime', e.target.value)}
                            className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                          <span className="text-sm text-gray-600">to</span>
                          <input
                            type="time"
                            value={schedule.endTime || '18:00'}
                            onChange={(e) => handleScheduleChange(index, 'endTime', e.target.value)}
                            className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
              {errors.weeklySchedule && <p className="text-red-500 text-sm mt-1">{errors.weeklySchedule}</p>}
            </div>

            {/* Time Slots */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Time Slots
              </label>
              <div className="flex flex-wrap gap-3">
                {timeSlots.map(slot => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => handleTimeSlotToggle(slot)}
                    className={`px-4 py-2 rounded-lg text-sm transition ${
                      formData.timeSlots?.includes(slot)
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {slot.charAt(0) + slot.slice(1).toLowerCase().replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Extra Availability */}
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center gap-2 text-gray-700">
                <input
                  type="checkbox"
                  checked={formData.emergencyAvailability}
                  onChange={() => updateFormData({ emergencyAvailability: !formData.emergencyAvailability })}
                  className="w-4 h-4 text-indigo-600"
                />
                <span className="text-sm">Available for emergency jobs</span>
              </label>
              <label className="flex items-center gap-2 text-gray-700">
                <input
                  type="checkbox"
                  checked={formData.holidayWorking}
                  onChange={() => updateFormData({ holidayWorking: !formData.holidayWorking })}
                  className="w-4 h-4 text-indigo-600"
                />
                <span className="text-sm">Work on holidays</span>
              </label>
            </div>

            {/* Terms */}
            <div className="border-t border-gray-200 pt-4">
              <label className="flex items-start gap-3 text-gray-700">
                <input
                  type="checkbox"
                  checked={formData.termsAccepted}
                  onChange={() => updateFormData({ termsAccepted: !formData.termsAccepted })}
                  className="w-5 h-5 text-indigo-600 mt-0.5"
                />
                <div>
                  <span className="text-sm font-medium">I agree to the Terms & Conditions</span>
                  <p className="text-xs text-gray-400">
                    By checking this, you confirm that all information provided is accurate and you agree to our 
                    terms of service, privacy policy, and community guidelines.
                  </p>
                </div>
              </label>
              {errors.termsAccepted && <p className="text-red-500 text-sm mt-1">{errors.termsAccepted}</p>}
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
                className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 text-lg font-medium"
              >
                {loading ? 'Submitting...' : '✅ Complete Registration'}
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

export default Stage5Availability;
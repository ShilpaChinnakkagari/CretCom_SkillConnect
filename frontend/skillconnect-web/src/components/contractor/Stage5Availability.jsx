import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
const timeSlots = ['MORNING', 'AFTERNOON', 'EVENING', 'FULL_DAY'];

const Stage5Availability = ({ formData, updateFormData, onBack, loading, setLoading, navigate, onSubmit }) => {
  const [errors, setErrors] = useState({});

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

    // ✅ If onSubmit prop exists, use it (parent handles saving)
    if (onSubmit) {
      onSubmit();
      return;
    }

    // Fallback - should not be used
    toast.error('Please complete all stages first');
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">Availability & Submit</h2>
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
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={schedule.available || false}
                        onChange={(e) => handleScheduleChange(index, 'available', e.target.checked)}
                        className="w-4 h-4 text-primary-600"
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
                        className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                      />
                      <span className="text-sm">to</span>
                      <input
                        type="time"
                        value={schedule.endTime || '18:00'}
                        onChange={(e) => handleScheduleChange(index, 'endTime', e.target.value)}
                        className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
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
                    ? 'bg-primary-600 text-white'
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
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.emergencyAvailability}
              onChange={() => updateFormData({ emergencyAvailability: !formData.emergencyAvailability })}
              className="w-4 h-4 text-primary-600"
            />
            <span className="text-sm">Available for emergency jobs</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.holidayWorking}
              onChange={() => updateFormData({ holidayWorking: !formData.holidayWorking })}
              className="w-4 h-4 text-primary-600"
            />
            <span className="text-sm">Work on holidays</span>
          </label>
        </div>

        {/* Terms */}
        <div className="border-t pt-4">
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={formData.termsAccepted}
              onChange={() => updateFormData({ termsAccepted: !formData.termsAccepted })}
              className="w-5 h-5 text-primary-600 mt-0.5"
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
            className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 text-lg font-medium"
          >
            {loading ? 'Submitting...' : '✅ Complete Registration'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Stage5Availability;
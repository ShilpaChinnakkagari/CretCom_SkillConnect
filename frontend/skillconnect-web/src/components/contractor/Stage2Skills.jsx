import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const categories = {
  'Construction': [
    'Mason', 'Painter', 'Carpenter', 'Electrician', 'Plumber',
    'Tile Worker', 'Interior Designer', 'Demolition', 'TV Fix',
    'Geyser Fix', 'Fans', 'AC Install & Service'
  ],
  'Beauty & Personal Care': [
    'Makeup Artist', 'Bridal Makeup', 'Hair Stylist', 'Mehendi Artist',
    'Nail Artist', 'Beautician', 'Barber', 'Spa Therapist', 'Skin Care Specialist'
  ],
  'Stitching & Fashion': [
    'Tailor', "Women's Boutique", "Men's Tailor", 'Kids Wear Stitching',
    'Fashion Designer', 'Alteration Services', 'Embroidery',
    'Uniform Stitching', 'Tattoos'
  ],
  'Events': [
    'Photographer', 'Videographer', 'Decorator', 'Caterer',
    'DJ', 'Event Planner', 'Tent House', 'Flower Decoration',
    'Sound System', 'Lighting'
  ],
  'Property': [
    'Land Seller', 'House Seller', 'House for Rent',
    'Commercial Property', 'Real Estate Agent', 'Property Consultant'
  ],
  'Education': [
    'Home Tutor', 'Online Tutor', 'Spoken English Trainer',
    'Music Teacher', 'Dance Teacher', 'Internships',
    'Trainings', 'Yoga Trainer', 'Coding Tutor'
  ],
  'Health & Wellness': [
    'Doctor', 'Dentist', 'Physiotherapist', 'Nurse',
    'Caretaker', 'Fitness Trainer', 'Dietitian'
  ],
  'Technology': [
    'Laptop Repair', 'Mobile Repair', 'CCTV Technician',
    'Wi-Fi Installation', 'Printer Repair', 'TV Fix', 'Computer Service'
  ],
  'Home Services': [
    'House Cleaning', 'Laundry', 'Cook', 'Maid',
    'Baby Sitter', 'Elder Care', 'Security Guard', 'Gardener'
  ],
  'Business Services': [
    'Lawyer', 'Accountant', 'Tax Consultant', 'Graphic Designer',
    'Digital Marketing', 'Content Writer', 'Modeling', 'Ads'
  ],
  'Pet Services': [
    'Pet Grooming', 'Pet Boarding', 'Dog Trainer', 'Veterinary Doctor'
  ],
  'Art & Hobby Trainer': [
    'Dance Trainer', 'Music Teacher', 'Singing Coach',
    'Drawing / Painting', 'Games Trainer'
  ],
  'Food Services': [
    'Home Chef', 'Tiffin Service', 'Catering', 'Bakers', 'Sweet Makers'
  ],
  'Appliance Service': [
    'AC Repair', 'Refrigerator Repair', 'Washing Machine Repair',
    'TV Repair', 'RO Water Purifier Service', 'Microwave Repair'
  ]
};

const skillLevels = ['BEGINNER', 'INTERMEDIATE', 'EXPERT'];
const workTypes = ['RESIDENTIAL', 'COMMERCIAL', 'INDUSTRIAL'];
const teamSizes = ['SOLO', 'SMALL_TEAM', 'COMPANY'];
const idTypes = ['AADHAAR', 'PAN', 'DRIVING_LICENSE'];

const Stage2Skills = ({ formData, updateFormData, onNext, onBack, loading, setLoading }) => {
  const [errors, setErrors] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('');
  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    if (formData.primaryCategory) {
      for (const [cat, subs] of Object.entries(categories)) {
        if (subs.includes(formData.primaryCategory)) {
          setSelectedCategory(cat);
          setSubcategories(subs);
          break;
        }
      }
    }
  }, [formData.primaryCategory]);

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    setSubcategories(categories[category] || []);
    updateFormData({ primaryCategory: '' });
    setErrors(prev => ({ ...prev, primaryCategory: '' }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleMultiSelect = (key, value) => {
    const current = formData[key] || [];
    const updated = current.includes(value)
      ? current.filter(item => item !== value)
      : [...current, value];
    updateFormData({ [key]: updated });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.primaryCategory) newErrors.primaryCategory = 'Subcategory is required';
    if (!formData.yearsOfExperience) newErrors.yearsOfExperience = 'Years of experience is required';
    if (!formData.skillLevel) newErrors.skillLevel = 'Skill level is required';
    if (!formData.workTypes?.length) newErrors.workTypes = 'Select at least one work type';
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
        stage: 2,
        primaryCategory: formData.primaryCategory,
        secondarySkills: formData.secondarySkills || [],
        yearsOfExperience: formData.yearsOfExperience,
        skillLevel: formData.skillLevel,
        workTypes: formData.workTypes || [],
        specializations: formData.specializations || [],
        teamSize: formData.teamSize,
        idType: formData.idType,
        idNumber: formData.idNumber,
        idProofUrl: formData.idProofUrl
      };

      console.log('Saving Stage 2:', stageData);
      const response = await axios.post('http://localhost:8080/contractor/register/stage', stageData, {
        withCredentials: true
      });

      if (response.data.success) {
        toast.success('Skills saved!');
        onNext();
      }
    } catch (error) {
      console.error('Error saving stage 2:', error);
      toast.error(error.response?.data?.error || 'Failed to save skills');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">Skills & Trust</h2>
      <p className="text-gray-500 text-sm mb-6">Select your category and tell us about your expertise</p>

      <div className="space-y-6">
        {/* Category Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Category <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Choose your category</option>
            {Object.keys(categories).map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Subcategory Selection */}
        {selectedCategory && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Your Service <span className="text-red-500">*</span>
            </label>
            <select
              name="primaryCategory"
              value={formData.primaryCategory}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Choose your service</option>
              {subcategories.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
            {errors.primaryCategory && <p className="text-red-500 text-sm mt-1">{errors.primaryCategory}</p>}
          </div>
        )}

        {/* Secondary Skills */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Secondary Skills <span className="text-gray-400 text-xs">(Optional, up to 3)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {subcategories.filter(s => s !== formData.primaryCategory).slice(0, 15).map(sub => (
              <button
                key={sub}
                type="button"
                onClick={() => handleMultiSelect('secondarySkills', sub)}
                className={`px-3 py-1 rounded-full text-sm transition ${
                  formData.secondarySkills?.includes(sub)
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>

        {/* Years of Experience */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Years of Experience <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="yearsOfExperience"
            value={formData.yearsOfExperience}
            onChange={handleChange}
            min="0"
            max="50"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            placeholder="Enter years of experience"
          />
          {errors.yearsOfExperience && <p className="text-red-500 text-sm mt-1">{errors.yearsOfExperience}</p>}
        </div>

        {/* Skill Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Skill Level <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-4">
            {skillLevels.map(level => (
              <label key={level} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="skillLevel"
                  value={level}
                  checked={formData.skillLevel === level}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary-600"
                />
                <span className="text-sm capitalize">{level.toLowerCase()}</span>
              </label>
            ))}
          </div>
          {errors.skillLevel && <p className="text-red-500 text-sm mt-1">{errors.skillLevel}</p>}
        </div>

        {/* Work Types */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Work Types <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-4">
            {workTypes.map(type => (
              <label key={type} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.workTypes?.includes(type)}
                  onChange={() => handleMultiSelect('workTypes', type)}
                  className="w-4 h-4 text-primary-600"
                />
                <span className="text-sm capitalize">{type.toLowerCase()}</span>
              </label>
            ))}
          </div>
          {errors.workTypes && <p className="text-red-500 text-sm mt-1">{errors.workTypes}</p>}
        </div>

        {/* Team Size */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Team Size <span className="text-gray-400 text-xs">(Optional)</span>
          </label>
          <div className="flex gap-4">
            {teamSizes.map(size => (
              <label key={size} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="teamSize"
                  value={size}
                  checked={formData.teamSize === size}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary-600"
                />
                <span className="text-sm capitalize">{size.toLowerCase().replace('_', ' ')}</span>
              </label>
            ))}
          </div>
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
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save & Continue →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Stage2Skills;
import React, { useState } from 'react';

const SearchFilterSidebar = ({ contractors, onFilter, onFollowToggle, onNavigateToSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    minRating: 0,
    minExperience: 0,
    maxBudget: 100000,
    skill: '',
    verified: false,
    emergencyAvailable: false
  });

  const allCategories = [...new Set(contractors.map(c => c.primaryCategory).filter(Boolean))];
  const allLocations = [...new Set(contractors.flatMap(c => c.serviceAreas || []).filter(Boolean))];
  const allSkills = [...new Set(contractors.flatMap(c => c.secondarySkills || []).filter(Boolean))];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
  };

  // ===== APPLY SEARCH ON BUTTON CLICK =====
  const handleSearchClick = () => {
    // ✅ Navigate to Search tab first
    if (onNavigateToSearch) {
      onNavigateToSearch();
    }
    // Then apply filters
    applyFilters(searchTerm, filters);
  };

  // ===== APPLY SEARCH ON ENTER KEY =====
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      // ✅ Navigate to Search tab first
      if (onNavigateToSearch) {
        onNavigateToSearch();
      }
      applyFilters(searchTerm, filters);
    }
  };

  const applyFilters = (term, filterState) => {
    let filtered = contractors;

    // Search term
    if (term) {
      const lowerTerm = term.toLowerCase();
      filtered = filtered.filter(c =>
        c.fullName?.toLowerCase().includes(lowerTerm) ||
        c.primaryCategory?.toLowerCase().includes(lowerTerm) ||
        c.aboutMe?.toLowerCase().includes(lowerTerm) ||
        c.shopName?.toLowerCase().includes(lowerTerm) ||
        c.serviceAreas?.some(area => area.toLowerCase().includes(lowerTerm)) ||
        c.secondarySkills?.some(skill => skill.toLowerCase().includes(lowerTerm))
      );
    }

    // Category filter
    if (filterState.category) {
      filtered = filtered.filter(c => c.primaryCategory === filterState.category);
    }

    // Location filter
    if (filterState.location) {
      filtered = filtered.filter(c =>
        c.serviceAreas?.some(area => area.includes(filterState.location)) ||
        c.location?.city?.includes(filterState.location) ||
        c.location?.state?.includes(filterState.location)
      );
    }

    // Rating filter
    if (filterState.minRating > 0) {
      filtered = filtered.filter(c => (c.averageRating || 0) >= filterState.minRating);
    }

    // Experience filter
    if (filterState.minExperience > 0) {
      filtered = filtered.filter(c => (c.yearsOfExperience || 0) >= filterState.minExperience);
    }

    // Budget filter
    filtered = filtered.filter(c => (c.minimumPrice || 0) <= filterState.maxBudget);

    // Skill filter
    if (filterState.skill) {
      filtered = filtered.filter(c =>
        c.secondarySkills?.some(skill => skill.includes(filterState.skill)) ||
        c.primaryCategory?.includes(filterState.skill)
      );
    }

    // Verified filter
    if (filterState.verified) {
      filtered = filtered.filter(c => c.isVerified === true);
    }

    // Emergency available filter
    if (filterState.emergencyAvailable) {
      filtered = filtered.filter(c => c.emergencyAvailability === true);
    }

    onFilter(filtered);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilters({
      category: '',
      location: '',
      minRating: 0,
      minExperience: 0,
      maxBudget: 100000,
      skill: '',
      verified: false,
      emergencyAvailable: false
    });
    onFilter(contractors);
  };

  return (
    <div className="rounded-xl p-4" style={{ background: '#161B22', border: '1px solid #30363D' }}>
      <h3 className="text-white font-semibold mb-3">🔍 Search Contractors</h3>

      {/* ===== SEARCH INPUT WITH BUTTON ===== */}
      <div className="mb-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyPress={handleKeyPress}
            placeholder="Search by name, skill, location..."
            className="flex-1 px-3 py-2 bg-[#0D1117] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 text-sm"
          />
          <button
            onClick={handleSearchClick}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm whitespace-nowrap"
          >
            🔍 Search
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-3">
        <label className="text-xs text-gray-400 block mb-1">📂 Category</label>
        <select
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          className="w-full px-3 py-2 bg-[#0D1117] border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
        >
          <option value="">All Categories</option>
          {allCategories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Location Filter */}
      <div className="mb-3">
        <label className="text-xs text-gray-400 block mb-1">📍 Location</label>
        <select
          value={filters.location}
          onChange={(e) => handleFilterChange('location', e.target.value)}
          className="w-full px-3 py-2 bg-[#0D1117] border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
        >
          <option value="">All Locations</option>
          {allLocations.map(loc => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
      </div>

      {/* Skill Filter */}
      <div className="mb-3">
        <label className="text-xs text-gray-400 block mb-1">🛠️ Skill</label>
        <select
          value={filters.skill}
          onChange={(e) => handleFilterChange('skill', e.target.value)}
          className="w-full px-3 py-2 bg-[#0D1117] border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
        >
          <option value="">All Skills</option>
          {allSkills.map(skill => (
            <option key={skill} value={skill}>{skill}</option>
          ))}
        </select>
      </div>

      {/* Rating Filter */}
      <div className="mb-3">
        <label className="text-xs text-gray-400 block mb-1">⭐ Minimum Rating</label>
        <div className="flex gap-2">
          {[0, 3, 4, 4.5].map(rating => (
            <button
              key={rating}
              onClick={() => handleFilterChange('minRating', rating)}
              className={`px-3 py-1 rounded-lg text-xs transition ${
                filters.minRating === rating
                  ? 'bg-blue-600 text-white'
                  : 'bg-[#0D1117] text-gray-400 border border-gray-700 hover:border-gray-500'
              }`}
            >
              {rating === 0 ? 'All' : `${rating}+`}
            </button>
          ))}
        </div>
      </div>

      {/* Experience Filter */}
      <div className="mb-3">
        <label className="text-xs text-gray-400 block mb-1">🎖️ Experience</label>
        <div className="flex gap-2 flex-wrap">
          {[0, 1, 3, 5, 10].map(exp => (
            <button
              key={exp}
              onClick={() => handleFilterChange('minExperience', exp)}
              className={`px-3 py-1 rounded-lg text-xs transition ${
                filters.minExperience === exp
                  ? 'bg-blue-600 text-white'
                  : 'bg-[#0D1117] text-gray-400 border border-gray-700 hover:border-gray-500'
              }`}
            >
              {exp === 0 ? 'All' : `${exp}+ yrs`}
            </button>
          ))}
        </div>
      </div>

      {/* Budget Filter */}
      <div className="mb-3">
        <label className="text-xs text-gray-400 block mb-1">💰 Max Budget (₹)</label>
        <input
          type="range"
          min="0"
          max="100000"
          step="1000"
          value={filters.maxBudget}
          onChange={(e) => handleFilterChange('maxBudget', parseInt(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>₹0</span>
          <span>₹{filters.maxBudget.toLocaleString()}</span>
          <span>₹100,000</span>
        </div>
      </div>

      {/* Verified Filter */}
      <div className="mb-3 flex items-center gap-2">
        <input
          type="checkbox"
          checked={filters.verified}
          onChange={(e) => handleFilterChange('verified', e.target.checked)}
          className="w-4 h-4 accent-blue-600"
        />
        <label className="text-sm text-gray-300">✅ Verified only</label>
      </div>

      {/* Emergency Filter */}
      <div className="mb-4 flex items-center gap-2">
        <input
          type="checkbox"
          checked={filters.emergencyAvailable}
          onChange={(e) => handleFilterChange('emergencyAvailable', e.target.checked)}
          className="w-4 h-4 accent-blue-600"
        />
        <label className="text-sm text-gray-300">🚨 Emergency available</label>
      </div>

      {/* Buttons Row */}
      <div className="flex gap-2">
        <button
          onClick={handleSearchClick}
          className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
        >
          🔍 Search
        </button>
        <button
          onClick={resetFilters}
          className="flex-1 py-2 bg-[#0D1117] border border-gray-700 text-gray-400 rounded-lg hover:border-gray-500 hover:text-white transition text-sm"
        >
          🔄 Reset
        </button>
      </div>
    </div>
  );
};

export default SearchFilterSidebar;
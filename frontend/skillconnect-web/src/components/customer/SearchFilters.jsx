import React, { useState } from 'react';

const categories = [
  'Construction',
  'Beauty & Personal Care',
  'Stitching & Fashion',
  'Events',
  'Property',
  'Education',
  'Health & Wellness',
  'Technology',
  'Home Services',
  'Business Services',
  'Pet Services',
  'Art & Hobby Trainer',
  'Food Services',
  'Appliance Service'
];

const subcategories = {
  'Construction': ['Mason', 'Painter', 'Carpenter', 'Electrician', 'Plumber', 'Tile Worker', 'Interior Designer'],
  'Beauty & Personal Care': ['Makeup Artist', 'Bridal Makeup', 'Hair Stylist', 'Mehendi Artist', 'Nail Artist', 'Beautician'],
  'Education': ['Home Tutor', 'Online Tutor', 'Music Teacher', 'Dance Teacher', 'Yoga Trainer', 'Coding Tutor'],
  // Add more subcategories as needed
};

const SearchFilters = ({ onSearch }) => {
  const [filters, setFilters] = useState({
    category: '',
    subcategory: '',
    location: '',
    maxPrice: '',
    minRating: '',
    searchQuery: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleReset = () => {
    const reset = {
      category: '',
      subcategory: '',
      location: '',
      maxPrice: '',
      minRating: '',
      searchQuery: ''
    };
    setFilters(reset);
    onSearch(reset);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Search Query */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <input
            type="text"
            name="searchQuery"
            value={filters.searchQuery}
            onChange={handleChange}
            placeholder="Search providers..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            name="category"
            value={filters.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Subcategory */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory</label>
          <select
            name="subcategory"
            value={filters.subcategory}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Services</option>
            {filters.category && subcategories[filters.category]?.map(sub => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input
            type="text"
            name="location"
            value={filters.location}
            onChange={handleChange}
            placeholder="City or area..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Max Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Max Price (₹)</label>
          <input
            type="number"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleChange}
            placeholder="5000"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Min Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Min Rating</label>
          <select
            name="minRating"
            value={filters.minRating}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Any Rating</option>
            <option value="4.5">4.5+</option>
            <option value="4.0">4.0+</option>
            <option value="3.5">3.5+</option>
            <option value="3.0">3.0+</option>
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-4 pt-4 border-t">
        <button
          type="submit"
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
        >
          🔍 Search
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
        >
          Reset Filters
        </button>
      </div>
    </form>
  );
};

export default SearchFilters;
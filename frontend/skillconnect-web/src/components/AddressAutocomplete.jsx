import React, { useState, useRef, useEffect } from 'react';
import { OpenStreetMapProvider } from 'leaflet-geosearch';

const AddressAutocomplete = ({ value, onChange, placeholder, className }) => {
  const [inputValue, setInputValue] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const provider = useRef(new OpenStreetMapProvider());
  const timeoutRef = useRef(null);

  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  const handleInputChange = async (e) => {
    const query = e.target.value;
    setInputValue(query);
    setShowSuggestions(true);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);

    timeoutRef.current = setTimeout(async () => {
      try {
        const results = await provider.current.search({ query });
        setSuggestions(results.slice(0, 8));
      } catch (error) {
        console.error('Search error:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 500);
  };

  const handleSelectSuggestion = (suggestion) => {
    setInputValue(suggestion.label);
    setSuggestions([]);
    setShowSuggestions(false);

    const parts = suggestion.label.split(',');
    const city = parts[0]?.trim() || '';
    const state = parts[1]?.trim() || '';
    const country = parts[parts.length - 1]?.trim() || 'India';

    onChange({
      address: suggestion.label,
      city: city,
      state: state,
      country: country,
      latitude: suggestion.y || suggestion.lat || 0,
      longitude: suggestion.x || suggestion.lon || 0,
      raw: suggestion
    });
  };

  const handleBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  const handleFocus = () => {
    if (inputValue.length >= 3) {
      setShowSuggestions(true);
    }
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder || "Search for your address..."}
        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-800 placeholder-gray-400 ${className || ''}`}
      />
      
      {isLoading && (
        <div className="absolute right-3 top-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
        </div>
      )}

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="px-4 py-2 hover:bg-indigo-50 cursor-pointer text-gray-800 text-sm border-b border-gray-100 last:border-0"
              onMouseDown={() => handleSelectSuggestion(suggestion)}
            >
              <div className="font-medium">{suggestion.label.split(',')[0]}</div>
              <div className="text-xs text-gray-500">{suggestion.label.split(',').slice(1).join(',').trim()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressAutocomplete;
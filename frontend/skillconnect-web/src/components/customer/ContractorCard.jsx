import React, { useState, useEffect } from 'react';
import axios from 'axios';

axios.defaults.withCredentials = true;

const ContractorCard = ({ contractor, onBookNow }) => {
  const [isBooked, setIsBooked] = useState(false);
  const [bookingStatus, setBookingStatus] = useState(null);

  const {
    id,
    fullName,
    profilePhoto,
    primaryCategory,
    yearsOfExperience,
    aboutMe,
    minimumPrice,
    maximumPrice,
    serviceAreas,
    stats
  } = contractor;

  const averageRating = stats?.averageRating || 0;
  const totalCustomers = stats?.totalCustomers || 0;
  const completedJobs = stats?.completedJobs || 0;

  // Check if user has already booked this contractor
  useEffect(() => {
    const checkBookingStatus = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/bookings/customer', {
          withCredentials: true
        });
        const bookings = response.data;
        const existingBooking = bookings.find(b => b.contractorId === id);
        if (existingBooking) {
          setIsBooked(true);
          setBookingStatus(existingBooking.status);
        }
      } catch (error) {
        console.error('Failed to check booking status:', error);
      }
    };
    checkBookingStatus();
  }, [id]);

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-6 relative">
      {/* Booked Badge */}
      {isBooked && (
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            bookingStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
            bookingStatus === 'ACCEPTED' ? 'bg-blue-100 text-blue-700' :
            bookingStatus === 'COMPLETED' ? 'bg-green-100 text-green-700' :
            bookingStatus === 'REJECTED' ? 'bg-red-100 text-red-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {bookingStatus === 'PENDING' ? '⏳ Pending' :
             bookingStatus === 'ACCEPTED' ? '✅ Accepted' :
             bookingStatus === 'COMPLETED' ? '✅ Completed' :
             bookingStatus === 'REJECTED' ? '❌ Rejected' :
             '📋 Booked'}
          </span>
        </div>
      )}

      {/* Profile */}
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
          {profilePhoto ? (
            <img src={profilePhoto} alt={fullName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl text-gray-400">
              👤
            </div>
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800">{fullName}</h3>
          <p className="text-sm text-primary-600">{primaryCategory}</p>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-yellow-500">⭐</span>
            <span className="text-sm font-medium">{averageRating}</span>
            <span className="text-sm text-gray-400">({totalCustomers} customers)</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 mt-3 line-clamp-2">{aboutMe}</p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mt-3 py-2 border-t border-b">
        <div className="text-center">
          <p className="text-lg font-bold text-primary-600">{yearsOfExperience}+</p>
          <p className="text-xs text-gray-500">Years</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-green-600">{completedJobs}</p>
          <p className="text-xs text-gray-500">Jobs Done</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-gray-800">₹{minimumPrice}</p>
          <p className="text-xs text-gray-500">Starting from</p>
        </div>
      </div>

      {/* Services Areas */}
      <div className="flex flex-wrap gap-1 mt-3">
        {serviceAreas?.slice(0, 3).map((area, index) => (
          <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
            📍 {area}
          </span>
        ))}
        {serviceAreas?.length > 3 && (
          <span className="text-xs text-gray-400">+{serviceAreas.length - 3} more</span>
        )}
      </div>

      {/* Price Range & Book Button */}
      <div className="flex justify-between items-center mt-4 pt-3 border-t">
        <div>
          <p className="text-sm text-gray-500">Price Range</p>
          <p className="font-semibold text-gray-800">₹{minimumPrice} - ₹{maximumPrice}</p>
        </div>
        {isBooked ? (
          <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
            {bookingStatus === 'PENDING' ? '⏳ Request Sent' :
             bookingStatus === 'ACCEPTED' ? '✅ Accepted' :
             bookingStatus === 'COMPLETED' ? '✅ Completed' :
             '📋 Booked'}
          </span>
        ) : (
          <button
            onClick={() => onBookNow(contractor)}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition text-sm"
          >
            Book Now
          </button>
        )}
      </div>
    </div>
  );
};

export default ContractorCard;
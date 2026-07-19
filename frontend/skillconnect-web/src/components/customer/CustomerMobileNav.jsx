import React from 'react';

const CustomerMobileNav = ({ activeTab, onTabChange }) => {

  // ✅ Customer Mobile Nav - NO Create Post button
  const navItems = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'search', icon: '🔍', label: 'Search' },
    { id: 'bookings', icon: '📅', label: 'Bookings' },
    { id: 'profile', icon: '👤', label: 'Profile' },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
      <div 
        className="flex justify-around items-center py-2 px-4 border-t"
        style={{ background: '#161B22', borderColor: '#30363D' }}
      >
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition ${
              activeTab === item.id
                ? 'text-blue-400'
                : 'text-gray-400'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-[10px]">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CustomerMobileNav;
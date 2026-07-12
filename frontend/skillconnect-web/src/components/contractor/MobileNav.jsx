import React from 'react';

const MobileNav = ({ activeTab, onTabChange, onCreatePost }) => {

  const navItems = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'posts', icon: '📰', label: 'Posts' },
    { id: 'create', icon: '➕', label: 'Create', isSpecial: true },
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
            onClick={() => {
              if (item.id === 'create') {
                onCreatePost();
              } else {
                onTabChange(item.id);
              }
            }}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition ${
              activeTab === item.id && item.id !== 'create'
                ? 'text-blue-400'
                : 'text-gray-400'
            } ${item.isSpecial ? 'relative' : ''}`}
          >
            {item.isSpecial ? (
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-2xl -mt-6 shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition">
                {item.icon}
              </div>
            ) : (
              <>
                <span className="text-xl">{item.icon}</span>
                <span className="text-[10px]">{item.label}</span>
              </>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MobileNav;
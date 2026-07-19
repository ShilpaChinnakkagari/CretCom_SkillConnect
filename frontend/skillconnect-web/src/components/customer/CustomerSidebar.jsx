import React from 'react';

const CustomerSidebar = ({ 
  user, 
  following, 
  onShowFollowing,
  activeTab,
  onTabChange,
  onFollowToggle
}) => {

  // ✅ Customer Nav Items - NO Posts, Stories, Analytics, Reviews, Services
  const navItems = [
    { id: 'home', label: '🏠 Home', icon: '🏠' },
    { id: 'search', label: '🔍 Search', icon: '🔍' },
    { id: 'bookings', label: '📅 Bookings', icon: '📅' },
    { id: 'messages', label: '💬 Messages', icon: '💬' },
    { id: 'profile', label: '👤 Profile', icon: '👤' },
    { id: 'settings', label: '⚙ Settings', icon: '⚙' },
  ];

  return (
    <div className="rounded-xl p-4 sticky top-4" style={{ background: '#161B22', border: '1px solid #30363D' }}>
      
      {/* ===== PROFILE CARD ===== */}
      <div className="text-center mb-6">
        <div className="relative inline-block">
          <div className="w-20 h-20 rounded-full bg-gray-700 mx-auto overflow-hidden border-2 border-blue-500">
            {user?.profilePicture ? (
              <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl text-gray-400">👤</div>
            )}
          </div>
          <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-2 border-[#161B22]"></div>
        </div>

        <h3 className="text-white font-semibold text-lg mt-3">{user?.name || 'Customer'}</h3>
        <p className="text-sm text-gray-400">Customer</p>

        {/* ===== FOLLOWING COUNT ===== */}
        <div className="flex justify-center gap-6 mt-4 text-sm">
          <button 
            onClick={onShowFollowing}
            className="text-center hover:opacity-80 transition"
          >
            <span className="block text-white font-semibold">{following?.length || 0}</span>
            <span className="text-gray-400 text-xs">Following</span>
          </button>
        </div>
      </div>

      {/* ===== DIVIDER ===== */}
      <div className="border-t border-gray-700 my-4"></div>

      {/* ===== NAVIGATION ===== */}
      <nav className="space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
              activeTab === item.id
                ? 'bg-blue-600/20 text-blue-400'
                : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default CustomerSidebar;
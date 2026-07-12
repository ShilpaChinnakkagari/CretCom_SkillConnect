import React from 'react';

const Sidebar = ({ 
  user, 
  profile, 
  followers, 
  following, 
  onShowFollowers, 
  onShowFollowing,
  activeTab,
  onTabChange
}) => {

  const navItems = [
    { id: 'home', label: '🏠 Home', icon: '🏠' },
    { id: 'analytics', label: '📊 Analytics', icon: '📊' },
    { id: 'bookings', label: '📅 Bookings', icon: '📅' },
    { id: 'posts', label: '📰 Posts', icon: '📰' },
    { id: 'stories', label: '📸 Stories', icon: '📸' },
    { id: 'messages', label: '💬 Messages', icon: '💬' },
    { id: 'reviews', label: '⭐ Reviews', icon: '⭐' },
    { id: 'services', label: '💼 Services', icon: '💼' },
    { id: 'profile', label: '👤 Profile', icon: '👤' },
    { id: 'settings', label: '⚙ Settings', icon: '⚙' },
  ];

  return (
    <div className="rounded-xl p-4 sticky top-4" style={{ background: '#161B22', border: '1px solid #30363D' }}>
      
      {/* ===== PROFILE CARD ===== */}
      <div className="text-center mb-6">
        <div className="relative inline-block">
          <div className="w-20 h-20 rounded-full bg-gray-700 mx-auto overflow-hidden border-2 border-blue-500">
            {profile?.profilePhoto ? (
              <img src={profile.profilePhoto} alt={profile.fullName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl text-gray-400">👤</div>
            )}
          </div>
          <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-2 border-[#161B22]"></div>
        </div>

        <h3 className="text-white font-semibold text-lg mt-3">{profile?.fullName || user?.name || 'Contractor'}</h3>
        
        <div className="flex items-center justify-center gap-2 mt-1">
          <span className="text-sm text-gray-400">{profile?.primaryCategory || 'Service Provider'}</span>
          {profile?.isVerified && (
            <span className="text-green-400 text-sm">✔️</span>
          )}
        </div>

        <div className="flex items-center justify-center gap-1 mt-1">
          <span className="text-yellow-400">⭐</span>
          <span className="text-white text-sm font-medium">{profile?.averageRating?.toFixed(1) || '0.0'}</span>
        </div>

        {/* ===== FOLLOWERS / FOLLOWING (CLICKABLE) ===== */}
        <div className="flex justify-center gap-6 mt-4 text-sm">
          <button 
            onClick={onShowFollowers}
            className="text-center hover:opacity-80 transition"
          >
            <span className="block text-white font-semibold">{followers?.length || 0}</span>
            <span className="text-gray-400 text-xs">Followers</span>
          </button>
          <button 
            onClick={onShowFollowing}
            className="text-center hover:opacity-80 transition"
          >
            <span className="block text-white font-semibold">{following?.length || 0}</span>
            <span className="text-gray-400 text-xs">Following</span>
          </button>
        </div>

        {/* ===== PROFILE COMPLETENESS ===== */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Profile Strength</span>
            <span>80%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-1.5">
            <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '80%' }}></div>
          </div>
        </div>

        {profile?.registrationComplete !== true && (
          <button 
            className="mt-4 w-full py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
            onClick={() => window.location.href = '/contractor-registration'}
          >
            Complete Profile
          </button>
        )}
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

export default Sidebar;
import React from 'react';

const RightSidebar = ({ profile, bookings, recommended, onRefresh, onFollowToggle }) => {

  const pending = bookings.filter(b => b.status === 'PENDING').length;
  const accepted = bookings.filter(b => b.status === 'ACCEPTED').length;
  const completed = bookings.filter(b => b.status === 'COMPLETED').length;
  const cancelled = bookings.filter(b => b.status === 'CANCELLED').length;

  return (
    <div className="space-y-4">
      
      {/* ===== TODAY'S STATS ===== */}
      <div className="rounded-xl p-4" style={{ background: '#161B22', border: '1px solid #30363D' }}>
        <h4 className="text-sm font-medium text-gray-400 mb-3">📊 Today's Stats</h4>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">👁️ Views</span>
            <span className="text-white font-semibold">{profile?.totalViews || 0}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">👥 Followers</span>
            <span className="text-white font-semibold">{profile?.followersCount || 0}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">📩 Requests</span>
            <span className="text-white font-semibold">{pending}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">💬 Messages</span>
            <span className="text-white font-semibold">0</span>
          </div>
        </div>
      </div>

      {/* ===== BOOKING OVERVIEW ===== */}
      <div className="rounded-xl p-4" style={{ background: '#161B22', border: '1px solid #30363D' }}>
        <h4 className="text-sm font-medium text-gray-400 mb-3">📋 Booking Overview</h4>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-yellow-400 text-sm">⏳ Pending</span>
            <span className="text-white font-semibold">{pending}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-blue-400 text-sm">✅ Accepted</span>
            <span className="text-white font-semibold">{accepted}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-green-400 text-sm">🎉 Completed</span>
            <span className="text-white font-semibold">{completed}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-red-400 text-sm">❌ Cancelled</span>
            <span className="text-white font-semibold">{cancelled}</span>
          </div>
        </div>
      </div>

      {/* ===== PERFORMANCE ===== */}
      <div className="rounded-xl p-4" style={{ background: '#161B22', border: '1px solid #30363D' }}>
        <h4 className="text-sm font-medium text-gray-400 mb-3">📈 Performance</h4>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Profile Views</span>
            <span className="text-white font-semibold">{profile?.totalViews || 0}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Response Rate</span>
            <span className="text-white font-semibold">{profile?.completionRate || 0}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">⭐ Rating</span>
            <span className="text-white font-semibold">{profile?.averageRating?.toFixed(1) || '0.0'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">💰 Revenue</span>
            <span className="text-white font-semibold">₹{profile?.totalEarnings || 0}</span>
          </div>
        </div>
      </div>

      {/* ===== RECOMMENDED CONTRACTORS ===== */}
      {recommended && recommended.length > 0 && (
        <div className="rounded-xl p-4" style={{ background: '#161B22', border: '1px solid #30363D' }}>
          <h4 className="text-sm font-medium text-gray-400 mb-3">👥 Recommended</h4>
          <div className="space-y-3">
            {recommended.slice(0, 3).map((contractor) => (
              <div key={contractor.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-700 overflow-hidden flex-shrink-0">
                    {contractor.profilePhoto ? (
                      <img src={contractor.profilePhoto} alt={contractor.fullName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">👤</div>
                    )}
                  </div>
                  <div>
                    <p className="text-white text-xs font-medium">{contractor.fullName}</p>
                    <p className="text-gray-400 text-xs">{contractor.primaryCategory}</p>
                  </div>
                </div>
                <button 
                  className="text-xs text-blue-400 hover:text-blue-300"
                  onClick={() => onFollowToggle && onFollowToggle(contractor.userId, false)}
                >
                  Follow
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== REFRESH ===== */}
      <button 
        onClick={onRefresh}
        className="w-full py-2 text-sm text-gray-400 hover:text-white transition rounded-lg border border-gray-700 hover:border-gray-500"
      >
        🔄 Refresh
      </button>
    </div>
  );
};

export default RightSidebar;
import React from 'react';

const CustomerRightSidebar = ({ recommended, onRefresh, onFollowToggle, followingList }) => {

  const isFollowing = (userId) => {
    return followingList?.includes(userId) || false;
  };

  return (
    <div className="space-y-4">
      
      {/* ===== RECOMMENDED CONTRACTORS ===== */}
      {recommended && recommended.length > 0 && (
        <div className="rounded-xl p-4" style={{ background: '#161B22', border: '1px solid #30363D' }}>
          <h4 className="text-sm font-medium text-gray-400 mb-3">👥 Recommended for You</h4>
          <div className="space-y-3">
            {recommended.slice(0, 5).map((contractor) => {
              const isUserFollowing = isFollowing(contractor.userId);
              return (
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
                      <p className="text-white text-xs font-medium truncate max-w-[80px]">{contractor.fullName}</p>
                      <p className="text-gray-400 text-xs">{contractor.primaryCategory}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      if (onFollowToggle) {
                        onFollowToggle(contractor.userId, isUserFollowing);
                      }
                    }}
                    className={`text-xs px-3 py-1 rounded-full transition ${
                      isUserFollowing
                        ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                        : 'bg-blue-400/10 text-blue-400 hover:bg-blue-400/20'
                    }`}
                  >
                    {isUserFollowing ? '✅ Following' : '+ Follow'}
                  </button>
                </div>
              );
            })}
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

export default CustomerRightSidebar;
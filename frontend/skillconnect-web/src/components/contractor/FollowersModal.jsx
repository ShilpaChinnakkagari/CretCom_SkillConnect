import React, { useState } from 'react';

const FollowersModal = ({ type, users, onClose, onFollow }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(user => 
    user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user?.primaryCategory?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-[#161B22] rounded-2xl max-w-md w-full mx-4 max-h-[80vh] flex flex-col border border-gray-700">
        
        {/* ===== HEADER ===== */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">
            {type === 'followers' ? '👥 Followers' : '👤 Following'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl transition"
          >
            ✕
          </button>
        </div>

        {/* ===== SEARCH ===== */}
        <div className="p-4 border-b border-gray-700">
          <input
            type="text"
            placeholder={`Search ${type}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 bg-[#0D1117] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* ===== USER LIST ===== */}
        <div className="flex-1 overflow-y-auto p-2">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-sm">
              No {type} found
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-700/30 transition">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-700 overflow-hidden flex-shrink-0">
                    {user.profilePhoto ? (
                      <img src={user.profilePhoto} alt={user.fullName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl text-gray-400">👤</div>
                    )}
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{user.fullName || user.name}</p>
                    <p className="text-gray-400 text-xs">{user.primaryCategory || 'Service Provider'}</p>
                  </div>
                </div>
                <button
                  onClick={() => onFollow(user.id, user.isFollowing)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
                    user.isFollowing
                      ? 'bg-gray-700 text-white hover:bg-gray-600'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {user.isFollowing ? 'Following' : 'Follow'}
                </button>
              </div>
            ))
          )}
        </div>

        {/* ===== FOOTER ===== */}
        <div className="p-4 border-t border-gray-700 text-center text-xs text-gray-500">
          {filteredUsers.length} {type}
        </div>
      </div>
    </div>
  );
};

export default FollowersModal;
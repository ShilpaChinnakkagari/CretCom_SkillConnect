import React from 'react';

const Stories = ({ stories, onViewStory, user, profile, onAddStory, onDeleteStory }) => {
  
  // ✅ GROUP BY CONTRACTOR - Show only LATEST story per contractor
  const contractorMap = new Map();
  
  stories.forEach(story => {
    const existing = contractorMap.get(story.contractorId);
    if (!existing || new Date(story.createdAt) > new Date(existing.createdAt)) {
      contractorMap.set(story.contractorId, story);
    }
  });
  
  const uniqueStories = Array.from(contractorMap.values())
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  const displayStories = uniqueStories.slice(0, 7);

  const userProfilePic = profile?.profilePhoto || user?.profilePicture || null;
  const currentUserId = user?.id || user?.userId || null;

  // ✅ Get ALL stories for a contractor (for the viewer)
  const getContractorStories = (contractorId) => {
    return stories
      .filter(s => s.contractorId === contractorId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  // ✅ Check if ANY story belongs to current user
  const hasOwnStories = (contractorId) => {
    return stories.some(s => s.contractorId === contractorId && s.contractorId === currentUserId);
  };

  // ✅ Get all story IDs for a contractor
  const getStoryIdsForContractor = (contractorId) => {
    return stories
      .filter(s => s.contractorId === contractorId)
      .map(s => s.id);
  };

  return (
    <div 
      className="rounded-xl p-4 overflow-x-auto scrollbar-hide"
      style={{ background: '#161B22', border: '1px solid #30363D' }}
    >
      <div className="flex gap-4" style={{ minWidth: 'max-content' }}>
        
        {/* ===== ADD STORY ===== */}
        <div 
          className="flex flex-col items-center cursor-pointer flex-shrink-0"
          onClick={onAddStory}
          style={{ width: '80px' }}
        >
          <div className="relative w-20 h-20 rounded-full">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 p-0.5">
              <div className="w-full h-full rounded-full bg-[#161B22] overflow-hidden">
                {userProfilePic ? (
                  <img 
                    src={userProfilePic} 
                    alt="Add Story" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl text-gray-400">👤</div>
                )}
              </div>
            </div>
            <div className="absolute bottom-0 right-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-[#161B22]">
              <span className="text-white text-sm font-bold">+</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-1 truncate max-w-[80px]">Add Story</p>
        </div>

        {/* ===== STORIES ===== */}
        {displayStories.map((story) => {
          const contractorStories = getContractorStories(story.contractorId);
          const hasMultiple = contractorStories.length > 1;
          const ownStories = hasOwnStories(story.contractorId);
          const storyIds = getStoryIdsForContractor(story.contractorId);
          
          return (
            <div 
              key={story.contractorId}
              className="flex flex-col items-center flex-shrink-0 relative"
              style={{ width: '80px' }}
            >
              {/* ===== STORY CIRCLE ===== */}
              <div 
                className="cursor-pointer"
                onClick={() => {
                  onViewStory(contractorStories);
                }}
              >
                <div className="w-20 h-20 rounded-full p-0.5 relative">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-0.5">
                    <div className="w-full h-full rounded-full bg-[#161B22] overflow-hidden">
                      {story.type === 'VIDEO' ? (
                        <div className="w-full h-full bg-gray-800 flex items-center justify-center text-2xl">▶️</div>
                      ) : (
                        <img 
                          src={story.mediaUrl || 'https://via.placeholder.com/80'} 
                          alt={story.caption || 'Story'} 
                          className="w-full h-full rounded-full object-cover"
                          onError={(e) => e.target.src = 'https://via.placeholder.com/80'}
                        />
                      )}
                    </div>
                  </div>
                  
                  {/* ✅ Multiple stories count badge */}
                  {hasMultiple && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold border-2 border-[#161B22]">
                      {contractorStories.length}
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-300 mt-1 truncate max-w-[80px] text-center">
                  {story.contractorName || 'User'}
                </p>
              </div>

              {/* ✅ DELETE BUTTON - ONLY on OWN stories */}
              {/* Shows a small X on the profile circle to indicate you can delete */}
              {ownStories && onDeleteStory && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // ✅ Show which stories will be deleted
                    const storyCount = storyIds.length;
                    if (storyCount === 1) {
                      if (window.confirm(`Delete your story from ${story.contractorName}?`)) {
                        onDeleteStory(storyIds[0]);
                      }
                    } else {
                      if (window.confirm(`Delete all ${storyCount} stories from ${story.contractorName}?`)) {
                        // Delete each story individually
                        storyIds.forEach(id => onDeleteStory(id));
                      }
                    }
                  }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-[#161B22] transition z-10"
                  title={`Delete ${storyIds.length} story(s)`}
                >
                  ✕
                </button>
              )}
            </div>
          );
        })}

        {/* ===== MORE STORIES ===== */}
        {uniqueStories.length > 7 && (
          <div 
            className="flex flex-col items-center cursor-pointer flex-shrink-0"
            onClick={() => {
              const allStories = [...stories].sort((a, b) => 
                new Date(b.createdAt) - new Date(a.createdAt)
              );
              onViewStory(allStories);
            }}
            style={{ width: '80px' }}
          >
            <div className="w-20 h-20 rounded-full bg-gray-700 p-0.5">
              <div className="w-full h-full rounded-full bg-[#161B22] flex items-center justify-center">
                <span className="text-white text-xl font-bold">+{uniqueStories.length - 7}</span>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-1 truncate max-w-[80px]">More</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Stories;
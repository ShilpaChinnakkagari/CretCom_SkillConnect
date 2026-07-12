import React from 'react';

const Stories = ({ stories, onViewStory, user, profile, onAddStory }) => {
  
  // Get first 8 stories
  const displayStories = stories.slice(0, 7);

  return (
    <div 
      className="rounded-xl p-4 overflow-x-auto"
      style={{ background: '#161B22', border: '1px solid #30363D' }}
    >
      <div className="flex gap-4">
        
        {/* ===== ADD STORY ===== */}
        <div 
          className="flex-shrink-0 w-20 cursor-pointer text-center"
          onClick={onAddStory}
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 p-0.5">
            <div className="w-full h-full rounded-full bg-[#161B22] flex items-center justify-center text-3xl">
              ➕
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-1 truncate">Add Story</p>
        </div>

        {/* ===== STORIES ===== */}
        {displayStories.map((story, index) => (
          <div 
            key={story.id} 
            className="flex-shrink-0 w-20 cursor-pointer text-center"
            onClick={() => onViewStory(index)}
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-0.5">
              <div className="w-full h-full rounded-full bg-[#161B22] p-0.5 overflow-hidden">
                {story.type === 'VIDEO' ? (
                  <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center text-2xl">
                    ▶️
                  </div>
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
            <p className="text-xs text-gray-400 mt-1 truncate">
              {story.contractorName || 'User'}
            </p>
          </div>
        ))}

        {/* ===== MORE STORIES ===== */}
        {stories.length > 8 && (
          <div className="flex-shrink-0 w-20 cursor-pointer text-center">
            <div className="w-20 h-20 rounded-full bg-gray-700 p-0.5">
              <div className="w-full h-full rounded-full bg-[#161B22] flex items-center justify-center text-xl text-gray-400">
                +{stories.length - 8}
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-1 truncate">More</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Stories;
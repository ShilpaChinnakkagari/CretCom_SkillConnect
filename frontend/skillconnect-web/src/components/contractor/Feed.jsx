import React from 'react';
import Stories from './Stories';
import PostCard from './PostCard';
import CreatePost from './CreatePost';

const Feed = ({ 
  posts, 
  stories, 
  profile, 
  user, 
  onViewStory, 
  onCreatePost, 
  onRefresh,
  onFollowToggle,
  onLike,
  onComment,
  onShare,
  onSave,
  onPostDeleted,
  onPostEdited
}) => {

  return (
    <div className="space-y-4">
      
      {/* ===== STORIES SECTION ===== */}
      <Stories 
        stories={stories} 
        onViewStory={onViewStory}
        user={user}
        profile={profile}
        onAddStory={onCreatePost}
      />

      {/* ===== CREATE POST CARD ===== */}
      <div 
        className="rounded-xl p-4 cursor-pointer hover:bg-[#1C2333] transition"
        style={{ background: '#161B22', border: '1px solid #30363D' }}
        onClick={onCreatePost}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden flex-shrink-0">
            {profile?.profilePhoto ? (
              <img src={profile.profilePhoto} alt={profile.fullName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xl text-gray-400">👤</div>
            )}
          </div>
          <div className="flex-1">
            <div className="bg-[#0D1117] rounded-full px-4 py-2 text-gray-400 text-sm border border-gray-700 hover:border-gray-500 transition">
              What's happening today?
            </div>
          </div>
        </div>
        <div className="flex justify-around mt-3 pt-3 border-t border-gray-700">
          <button className="text-gray-400 hover:text-blue-400 text-sm transition flex items-center gap-1">
            <span>📷</span> Photo
          </button>
          <button className="text-gray-400 hover:text-purple-400 text-sm transition flex items-center gap-1">
            <span>🎥</span> Video
          </button>
          <button className="text-gray-400 hover:text-green-400 text-sm transition flex items-center gap-1">
            <span>🏗</span> Project
          </button>
          <button className="text-gray-400 hover:text-yellow-400 text-sm transition flex items-center gap-1">
            <span>🎉</span> Achievement
          </button>
          <button className="text-gray-400 hover:text-orange-400 text-sm transition flex items-center gap-1">
            <span>💰</span> Offer
          </button>
        </div>
      </div>

      {/* ===== REFRESH BUTTON ===== */}
      <div className="flex justify-end">
        <button 
          onClick={onRefresh}
          className="text-gray-400 hover:text-white text-sm transition flex items-center gap-1"
        >
          🔄 Refresh Feed
        </button>
      </div>

      {/* ===== FEED POSTS ===== */}
      {posts.length === 0 ? (
        <div 
          className="rounded-xl p-8 text-center"
          style={{ background: '#161B22', border: '1px solid #30363D' }}
        >
          <p className="text-gray-400">No posts yet. Follow contractors to see their updates!</p>
        </div>
      ) : (
        posts.map((post) => (
          <PostCard 
            key={post.id}
            post={post}
            onLike={onLike}
            onComment={onComment}
            onShare={onShare}
            onSave={onSave}
            onFollowToggle={onFollowToggle}
            onViewProfile={() => {}}
            onPostDeleted={onPostDeleted}
            onPostEdited={onPostEdited}
          />
        ))
      )}
    </div>
  );
};

export default Feed;
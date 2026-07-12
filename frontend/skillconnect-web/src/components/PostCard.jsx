import React, { useState } from 'react';

const PostCard = ({ post, onLike, onComment, onViewProfile }) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  const handleLike = () => {
    if (onLike) onLike(post.id);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (commentText.trim() && onComment) {
      onComment(post.id, commentText);
      setCommentText('');
    }
  };

  const postTypeIcons = {
    'PROJECT_SHOWCASE': '🔨',
    'ACHIEVEMENT': '🎉',
    'EDUCATIONAL': '📚',
    'OFFER': '🔥'
  };

  const postTypeColors = {
    'PROJECT_SHOWCASE': 'border-blue-500',
    'ACHIEVEMENT': 'border-green-500',
    'EDUCATIONAL': 'border-purple-500',
    'OFFER': 'border-orange-500'
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border-l-4 ${postTypeColors[post.type] || 'border-gray-300'} border border-gray-200 p-4`}>
      {/* Header */}
      <div className="flex items-start gap-3">
        <div 
          className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden cursor-pointer flex-shrink-0"
          onClick={() => onViewProfile && onViewProfile(post.contractorId)}
        >
          {post.contractorProfilePhoto ? (
            <img src={post.contractorProfilePhoto} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xl">👤</div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span 
              className="font-semibold text-gray-900 cursor-pointer hover:text-indigo-600"
              onClick={() => onViewProfile && onViewProfile(post.contractorId)}
            >
              {post.contractorName || 'Unknown'}
            </span>
            {post.isVerified && (
              <span className="text-blue-500 text-xs">✅</span>
            )}
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-400">
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-400">{postTypeIcons[post.type] || '📝'}</span>
            <span className="text-xs text-gray-400">{post.type?.replace('_', ' ') || 'Post'}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mt-3">
        {post.title && (
          <h3 className="text-lg font-semibold text-gray-900">{post.title}</h3>
        )}
        {post.description && (
          <p className="text-gray-700 mt-1 whitespace-pre-wrap">{post.description}</p>
        )}
        
        {/* Images */}
        {post.images && post.images.length > 0 && (
          <div className={`grid gap-2 mt-3 ${
            post.images.length === 1 ? 'grid-cols-1' :
            post.images.length === 2 ? 'grid-cols-2' :
            'grid-cols-3'
          }`}>
            {post.images.map((img, index) => (
              <div key={index} className="rounded-lg overflow-hidden">
                <img 
                  src={img} 
                  alt={`Post image ${index + 1}`} 
                  className="w-full h-48 object-cover hover:scale-105 transition duration-300"
                  onError={(e) => e.target.src = 'https://via.placeholder.com/300x200?text=Image'}
                />
              </div>
            ))}
          </div>
        )}

        {post.videoUrl && (
          <div className="mt-3 rounded-lg overflow-hidden">
            <video src={post.videoUrl} controls className="w-full max-h-96 object-cover" />
          </div>
        )}

        {/* Location & Budget */}
        <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
          {post.location && (
            <span>📍 {post.location}</span>
          )}
          {post.category && (
            <span>🔧 {post.category}</span>
          )}
          {post.budget && (
            <span>💰 ₹{post.budget}</span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-6">
          <button onClick={handleLike} className="flex items-center gap-1 text-gray-500 hover:text-blue-500 transition">
            <span>👍</span>
            <span>{post.likes || 0}</span>
          </button>
          <button 
            onClick={() => setShowComments(!showComments)} 
            className="flex items-center gap-1 text-gray-500 hover:text-blue-500 transition"
          >
            <span>💬</span>
            <span>{post.comments?.length || 0}</span>
          </button>
          <button className="flex items-center gap-1 text-gray-500 hover:text-blue-500 transition">
            <span>🔗</span>
            <span>Share</span>
          </button>
        </div>

        {/* Comments */}
        {showComments && (
          <div className="mt-3">
            {/* Comment List */}
            {post.comments && post.comments.length > 0 && (
              <div className="space-y-2 max-h-40 overflow-y-auto mb-3">
                {post.comments.map((comment, index) => (
                  <div key={index} className="flex items-start gap-2 bg-gray-50 p-2 rounded-lg">
                    <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                      {comment.userProfilePhoto ? (
                        <img src={comment.userProfilePhoto} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs">👤</div>
                      )}
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-900">{comment.userName}</span>
                      <p className="text-sm text-gray-700">{comment.text}</p>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Comment Input */}
            <form onSubmit={handleCommentSubmit} className="flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              />
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 text-sm"
              >
                Post
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;
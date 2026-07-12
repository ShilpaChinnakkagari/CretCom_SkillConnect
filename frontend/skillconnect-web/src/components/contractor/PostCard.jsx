import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const PostCard = ({ post, onLike, onComment, onShare, onSave, onFollowToggle, onViewProfile, onPostDeleted, onPostEdited }) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newImages, setNewImages] = useState([]);
  
  // ✅ FIXED: Added images to editForm
  const [editForm, setEditForm] = useState({
    title: post.title || '',
    description: post.description || '',
    type: post.type || 'PROJECT_SHOWCASE',
    location: post.location || '',
    budget: post.budget || '',
    images: post.images || []  // ✅ Preserve existing images
  });

  const getCurrentUserId = () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      const userData = JSON.parse(userStr);
      return userData?.id || userData?.userId || null;
    } catch {
      return null;
    }
  };

  const currentUserId = getCurrentUserId();
  const isOwner = post.contractorId === currentUserId;

  const postTypeIcons = {
    'PROJECT_SHOWCASE': '🔨',
    'ACHIEVEMENT': '🎉',
    'EDUCATIONAL': '📚',
    'OFFER': '💰'
  };

  const postTypeLabels = {
    'PROJECT_SHOWCASE': 'Project Showcase',
    'ACHIEVEMENT': 'Achievement',
    'EDUCATIONAL': 'Educational',
    'OFFER': 'Offer'
  };

  const handleLike = () => {
    if (onLike) onLike(post.id);
  };

  const handleComment = (e) => {
    e.preventDefault();
    if (commentText.trim() && onComment) {
      onComment(post.id, commentText);
      setCommentText('');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    setLoading(true);
    try {
      await axios.delete(`http://localhost:8080/posts/${post.id}`, {
        withCredentials: true
      });
      toast.success('Post deleted successfully!');
      if (onPostDeleted) onPostDeleted(post.id);
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error(error.response?.data?.error || 'Failed to delete post');
    } finally {
      setLoading(false);
      setShowMenu(false);
    }
  };

  // ===== HANDLE NEW IMAGE UPLOAD =====
  const handleImageUpload = (e) => {
    const files = e.target.files;
    const newImageUrls = [];
    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.onloadend = () => {
        newImageUrls.push(reader.result);
        if (newImageUrls.length === files.length) {
          setEditForm(prev => ({
            ...prev,
            images: [...prev.images, ...newImageUrls]
          }));
        }
      };
      reader.readAsDataURL(files[i]);
    }
  };

  // ===== REMOVE IMAGE =====
  const removeImage = (index) => {
    setEditForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.put(`http://localhost:8080/posts/${post.id}`, editForm, {
        withCredentials: true
      });
      toast.success('Post updated successfully!');
      if (onPostEdited) onPostEdited(response.data);
      setIsEditing(false);
      setShowMenu(false);
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error(error.response?.data?.error || 'Failed to update post');
    } finally {
      setLoading(false);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  // ===== EDIT MODE =====
  if (isEditing) {
    return (
      <div className="rounded-xl p-4" style={{ background: '#161B22', border: '1px solid #30363D' }}>
        <h3 className="text-white font-semibold mb-3">✏️ Edit Post</h3>
        <form onSubmit={handleEdit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Type</label>
            <select
              name="type"
              value={editForm.type}
              onChange={handleEditChange}
              className="w-full px-3 py-2 bg-[#0D1117] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              <option value="PROJECT_SHOWCASE">🔨 Project Showcase</option>
              <option value="ACHIEVEMENT">🎉 Achievement</option>
              <option value="EDUCATIONAL">📚 Educational</option>
              <option value="OFFER">💰 Offer</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={editForm.title}
              onChange={handleEditChange}
              className="w-full px-3 py-2 bg-[#0D1117] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
            <textarea
              name="description"
              value={editForm.description}
              onChange={handleEditChange}
              rows="3"
              className="w-full px-3 py-2 bg-[#0D1117] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* ===== IMAGES SECTION ===== */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Images</label>
            
            {/* Existing Images */}
            {editForm.images && editForm.images.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {editForm.images.map((img, index) => (
                  <div key={index} className="relative aspect-video w-24">
                    <img 
                      src={img} 
                      alt={`Upload ${index}`} 
                      className="w-24 h-16 object-cover rounded-lg border border-gray-700"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center hover:bg-red-600"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Images */}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="w-full px-4 py-2 bg-[#0D1117] border border-gray-700 rounded-lg text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
            />
            <p className="text-xs text-gray-500 mt-1">Add new images (existing images will be kept)</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={editForm.location}
                onChange={handleEditChange}
                className="w-full px-3 py-2 bg-[#0D1117] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Budget (₹)</label>
              <input
                type="number"
                name="budget"
                value={editForm.budget}
                onChange={handleEditChange}
                className="w-full px-3 py-2 bg-[#0D1117] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : '💾 Save Changes'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // ===== NORMAL VIEW =====
  return (
    <div className="rounded-xl p-4" style={{ background: '#161B22', border: '1px solid #30363D' }}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div 
            className="w-12 h-12 rounded-full bg-gray-700 overflow-hidden cursor-pointer flex-shrink-0"
            onClick={() => onViewProfile && onViewProfile(post.contractorId)}
          >
            {post.contractorProfilePhoto ? (
              <img src={post.contractorProfilePhoto} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xl text-gray-400">👤</div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span 
                className="text-white font-semibold cursor-pointer hover:text-blue-400 transition"
                onClick={() => onViewProfile && onViewProfile(post.contractorId)}
              >
                {post.contractorName || 'Unknown'}
              </span>
              {post.isVerified && (
                <span className="text-green-400 text-xs">✔️</span>
              )}
              {isOwner && (
                <span className="text-xs text-blue-400 bg-blue-400/20 px-2 py-0.5 rounded-full">You</span>
              )}
              <span className="text-xs text-gray-500">•</span>
              <span className="text-xs text-gray-500">{postTypeIcons[post.type] || '📝'}</span>
            </div>
            <div className="text-xs text-gray-500">
              {new Date(post.createdAt).toLocaleDateString()} • {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>

        {isOwner && (
          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="text-gray-500 hover:text-white text-sm px-2 py-1 rounded hover:bg-gray-700 transition"
            >
              ⋮
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-1 w-48 bg-[#1C2333] border border-gray-700 rounded-lg shadow-lg z-10 overflow-hidden">
                <button
                  onClick={() => { setIsEditing(true); setShowMenu(false); }}
                  className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 transition text-sm flex items-center gap-2"
                >
                  ✏️ Edit Post
                </button>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="w-full text-left px-4 py-2 text-red-400 hover:bg-gray-700 transition text-sm flex items-center gap-2"
                >
                  🗑️ Delete Post
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-3">
        {post.type && (
          <span className="text-xs text-gray-500 bg-gray-700/50 px-2 py-1 rounded-full">
            {postTypeLabels[post.type] || post.type}
          </span>
        )}
        
        {post.title && (
          <h3 className="text-lg font-semibold text-white mt-2">{post.title}</h3>
        )}
        
        {post.description && (
          <p className="text-gray-300 mt-1 whitespace-pre-wrap text-sm">{post.description}</p>
        )}

        {post.images && post.images.length > 0 && (
          <div className={`grid gap-2 mt-3 ${
            post.images.length === 1 ? 'grid-cols-1' :
            post.images.length === 2 ? 'grid-cols-2' :
            'grid-cols-3'
          }`}>
            {post.images.map((img, index) => (
              <div key={index} className="rounded-lg overflow-hidden aspect-video">
                <img 
                  src={img} 
                  alt={`Post ${index}`} 
                  className="w-full h-full object-cover hover:scale-105 transition duration-300"
                  onError={(e) => e.target.src = 'https://via.placeholder.com/400x225?text=Image'}
                />
              </div>
            ))}
          </div>
        )}

        {post.videoUrl && (
          <div className="mt-3 rounded-lg overflow-hidden aspect-video">
            <video src={post.videoUrl} controls className="w-full h-full object-cover" />
          </div>
        )}

        <div className="flex flex-wrap gap-3 mt-3 text-sm text-gray-400">
          {post.location && <span>📍 {post.location}</span>}
          {post.category && <span>🔧 {post.category}</span>}
          {post.budget && <span>💰 ₹{post.budget.toLocaleString()}</span>}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-700">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={handleLike} 
              className="flex items-center gap-1 text-gray-400 hover:text-blue-400 transition"
            >
              <span>👍</span>
              <span>{post.likes || 0}</span>
            </button>
            <button 
              onClick={() => setShowComments(!showComments)} 
              className="flex items-center gap-1 text-gray-400 hover:text-blue-400 transition"
            >
              <span>💬</span>
              <span>{post.comments?.length || 0}</span>
            </button>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => onShare && onShare(post.id)}
              className="text-gray-400 hover:text-blue-400 transition"
            >
              🔄 Share
            </button>
            <button 
              onClick={() => onSave && onSave(post.id)}
              className="text-gray-400 hover:text-blue-400 transition"
            >
              💾 Save
            </button>
          </div>
        </div>

        {showComments && (
          <div className="mt-3">
            {post.comments && post.comments.length > 0 && (
              <div className="space-y-2 max-h-40 overflow-y-auto mb-3">
                {post.comments.map((comment, index) => (
                  <div key={index} className="flex items-start gap-2 bg-[#0D1117] p-2 rounded-lg">
                    <div className="w-6 h-6 rounded-full bg-gray-700 overflow-hidden flex-shrink-0">
                      {comment.userProfilePhoto ? (
                        <img src={comment.userProfilePhoto} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">👤</div>
                      )}
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-medium text-white">{comment.userName}</span>
                      <p className="text-sm text-gray-300">{comment.text}</p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={handleComment} className="flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 px-3 py-2 bg-[#0D1117] border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white placeholder-gray-400 text-sm"
              />
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 text-sm"
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
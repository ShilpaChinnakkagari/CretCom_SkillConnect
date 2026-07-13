import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const CreateStory = ({ onClose, onStoryCreated }) => {
  const [media, setMedia] = useState(null);
  const [caption, setCaption] = useState('');
  const [type, setType] = useState('PHOTO');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File too large. Max 10MB');
        return;
      }
      
      setMedia(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      if (file.type.startsWith('video/')) {
        setType('VIDEO');
      } else {
        setType('PHOTO');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!media) {
      toast.error('Please select a photo or video');
      return;
    }

    setLoading(true);
    try {
      const userStr = localStorage.getItem('user');
      const userData = userStr ? JSON.parse(userStr) : null;
      const userId = userData?.id || userData?.userId;

      if (!userId) {
        toast.error('User not logged in');
        setLoading(false);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const storyData = {
            contractorId: userId,
            type: type,
            mediaUrl: reader.result,
            caption: caption,
            isActive: true
          };

          console.log('📸 Creating story:', storyData);
          
          const response = await axios.post('http://localhost:8080/stories/create', storyData, {
            withCredentials: true
          });

          console.log('✅ Story created:', response.data);
          
          if (response.data) {
            toast.success('📸 Story added!');
            if (onStoryCreated) onStoryCreated();
            onClose();
          }
        } catch (error) {
          console.error('Error creating story:', error);
          toast.error(error.response?.data?.error || 'Failed to create story');
        } finally {
          setLoading(false);
        }
      };
      reader.readAsDataURL(media);

    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to create story');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-[#161B22] rounded-2xl max-w-md w-full mx-4 border border-gray-700">
        
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">📸 Add Story</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white text-2xl transition"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Upload Photo or Video
            </label>
            <div 
              className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center cursor-pointer hover:border-blue-500 transition"
              onClick={() => document.getElementById('storyMediaInput').click()}
            >
              {preview ? (
                <div className="relative">
                  {type === 'VIDEO' ? (
                    <video src={preview} className="w-full max-h-64 rounded-lg object-cover" controls />
                  ) : (
                    <img src={preview} alt="Preview" className="w-full max-h-64 rounded-lg object-cover" />
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreview(null);
                      setMedia(null);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div>
                  <span className="text-5xl block mb-2">📷</span>
                  <p className="text-gray-400">Tap to select</p>
                  <p className="text-xs text-gray-500 mt-1">Photo or Video (max 10MB)</p>
                </div>
              )}
              <input
                id="storyMediaInput"
                type="file"
                accept="image/*,video/*"
                onChange={handleMediaChange}
                className="hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Caption</label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="What's happening?"
              className="w-full px-4 py-2 bg-[#0D1117] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              maxLength="100"
            />
            <p className="text-xs text-gray-500 text-right mt-1">{caption.length}/100</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-2 bg-[#0D1117] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              <option value="PHOTO">📷 Photo</option>
              <option value="VIDEO">🎥 Video</option>
            </select>
          </div>

          <div className="bg-blue-600/10 border border-blue-600/20 rounded-lg p-3">
            <p className="text-xs text-blue-400">⏰ Stories disappear after 24 hours</p>
            <p className="text-xs text-gray-400 mt-1">👀 Visible to your followers</p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !media}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
            >
              {loading ? 'Uploading...' : '📤 Post Story'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateStory;
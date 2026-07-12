import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import PostCard from './PostCard';
import StoryViewer from './StoryViewer';

const ContractorProfile = ({ contractorId, onClose, onBook, onChat, onFollow }) => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('about');
  const [isFollowing, setIsFollowing] = useState(false);
  const [showStoryViewer, setShowStoryViewer] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);

  useEffect(() => {
    fetchProfile();
    checkFollowStatus();
  }, [contractorId]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/contractor/profile/full/${contractorId}`, {
        withCredentials: true
      });
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const checkFollowStatus = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/contractor/is-following/${contractorId}`, {
        withCredentials: true
      });
      setIsFollowing(response.data.isFollowing);
    } catch (error) {
      console.error('Error checking follow status:', error);
    }
  };

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await axios.post(`http://localhost:8080/contractor/unfollow/${contractorId}`, {}, {
          withCredentials: true
        });
        setIsFollowing(false);
        toast.success('Unfollowed');
      } else {
        await axios.post(`http://localhost:8080/contractor/follow/${contractorId}`, {}, {
          withCredentials: true
        });
        setIsFollowing(true);
        toast.success('Followed');
      }
      if (onFollow) onFollow(contractorId);
    } catch (error) {
      console.error('Error following:', error);
      toast.error('Failed to update follow status');
    }
  };

  const handleViewStory = (index) => {
    setSelectedStoryIndex(index);
    setShowStoryViewer(true);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Contractor Profile</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">✕</button>
        </div>

        <div className="p-6">
          {/* Profile Header */}
          <div className="flex items-start gap-4">
            <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
              {profile.profilePhoto ? (
                <img src={profile.profilePhoto} alt={profile.fullName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl">👤</div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-2xl font-bold text-gray-900">{profile.fullName}</h3>
                {profile.isVerified && (
                  <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">✅ Verified</span>
                )}
                <span className="text-sm text-gray-500">• {profile.primaryCategory}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500 mt-1 flex-wrap">
                <span>⭐ {profile.averageRating?.toFixed(1) || 0}</span>
                <span>•</span>
                <span>📍 {profile.location?.city || 'N/A'}</span>
                <span>•</span>
                <span>💰 ₹{profile.minimumPrice || 0}/hr</span>
                <span>•</span>
                <span>📅 {profile.yearsOfExperience || 0} years exp</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <button
                  onClick={handleFollowToggle}
                  className={`px-4 py-2 rounded-lg transition text-sm ${
                    isFollowing
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {isFollowing ? 'Following ✓' : 'Follow'}
                </button>
                <button
                  onClick={() => onChat && onChat(contractorId)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                >
                  💬 Message
                </button>
                <button
                  onClick={() => onBook && onBook(contractorId)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
                >
                  📅 Book Now
                </button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{profile.totalPosts || 0}</p>
              <p className="text-xs text-gray-500">Posts</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{profile.followersCount || 0}</p>
              <p className="text-xs text-gray-500">Followers</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{profile.completedBookings || 0}</p>
              <p className="text-xs text-gray-500">Jobs Done</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">₹{profile.totalEarnings || 0}</p>
              <p className="text-xs text-gray-500">Earnings</p>
            </div>
          </div>

          {/* Stories */}
          {profile.stories && profile.stories.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-500 mb-2">📸 Stories</p>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {profile.stories.map((story, index) => (
                  <div 
                    key={story.id}
                    onClick={() => handleViewStory(index)}
                    className="flex-shrink-0 cursor-pointer"
                  >
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-0.5">
                      <div className="w-full h-full rounded-full bg-white p-0.5">
                        <img 
                          src={story.mediaUrl || 'https://via.placeholder.com/64'} 
                          alt="Story" 
                          className="w-full h-full rounded-full object-cover"
                          onError={(e) => e.target.src = 'https://via.placeholder.com/64'}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 text-center truncate w-16 mt-1">
                      {story.caption || 'Story'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-4 border-b border-gray-200 mt-4">
            {['about', 'services', 'portfolio', 'posts', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-2 text-sm font-medium capitalize transition ${
                  activeTab === tab
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'about' ? '📖 About' :
                 tab === 'services' ? '🔧 Services' :
                 tab === 'portfolio' ? '📂 Portfolio' :
                 tab === 'posts' ? '📰 Posts' :
                 '💬 Reviews'}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="mt-4">
            {activeTab === 'about' && (
              <div className="space-y-4">
                <p className="text-gray-700">{profile.aboutMe || 'No description available.'}</p>
                <div>
                  <p className="font-medium text-gray-700">📍 Location</p>
                  <p className="text-gray-600">{profile.location?.address || 'Not specified'}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">🌍 Languages Spoken</p>
                  <p className="text-gray-600">{profile.languagesSpoken?.join(', ') || 'Not specified'}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">📞 Contact</p>
                  <p className="text-gray-600">{profile.phoneNumber || 'Not available'}</p>
                  <p className="text-gray-600">{profile.email || 'Not available'}</p>
                </div>
              </div>
            )}

            {activeTab === 'services' && (
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-medium text-gray-700">Primary Service</p>
                  <p className="text-gray-600">{profile.primaryCategory}</p>
                </div>
                {profile.secondarySkills && profile.secondarySkills.length > 0 && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="font-medium text-gray-700">Secondary Skills</p>
                    <p className="text-gray-600">{profile.secondarySkills.join(', ')}</p>
                  </div>
                )}
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-medium text-gray-700">Pricing</p>
                  <p className="text-gray-600">₹{profile.minimumPrice} - ₹{profile.maximumPrice || 'Negotiable'}</p>
                  <p className="text-gray-600">{profile.pricingType?.replace('_', ' ')}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-medium text-gray-700">Service Areas</p>
                  <p className="text-gray-600">{profile.serviceAreas?.join(', ') || 'Not specified'}</p>
                </div>
              </div>
            )}

            {activeTab === 'portfolio' && (
              <div>
                {profile.portfolio && profile.portfolio.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {profile.portfolio.map((item, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                        {item.imageUrls && item.imageUrls.length > 0 && (
                          <img src={item.imageUrls[0]} alt={item.title} className="w-full h-40 object-cover" />
                        )}
                        <div className="p-2">
                          <p className="font-medium text-sm text-gray-900">{item.title}</p>
                          <p className="text-xs text-gray-500">{item.category}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No portfolio items yet</p>
                )}
              </div>
            )}

            {activeTab === 'posts' && (
              <div>
                {profile.posts && profile.posts.length > 0 ? (
                  <div className="space-y-4">
                    {profile.posts.map((post) => (
                      <PostCard
                        key={post.id}
                        post={{ ...post, contractorName: profile.fullName }}
                        onViewProfile={() => {}}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No posts yet</p>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                {profile.reviews && profile.reviews.length > 0 ? (
                  <div className="space-y-3">
                    {profile.reviews.map((review) => (
                      <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center gap-2">
                          <span className="text-yellow-400">⭐</span>
                          <span className="font-medium">{review.rating}</span>
                          <span className="text-sm text-gray-500">• {review.customerName}</span>
                          <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-gray-700 mt-1">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No reviews yet</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Story Viewer */}
      {showStoryViewer && profile.stories && (
        <StoryViewer
          stories={profile.stories}
          initialIndex={selectedStoryIndex}
          onClose={() => setShowStoryViewer(false)}
        />
      )}
    </div>
  );
};

export default ContractorProfile;
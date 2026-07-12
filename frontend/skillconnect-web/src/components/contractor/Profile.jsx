import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');
  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      navigate('/');
      return;
    }
    const userData = JSON.parse(userStr);
    setUser(userData);

    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const userStr = localStorage.getItem('user');
      const userData = userStr ? JSON.parse(userStr) : null;
      const userId = userData?.id || userData?.userId;

      // Fetch full profile
      const response = await axios.get(`http://localhost:8080/contractor/profile/full/${userId}`, {
        withCredentials: true
      });
      const data = response.data;
      setProfile(data);
      setPosts(data.posts || []);
      setStories(data.stories || []);
      setReviews(data.reviews || []);
      setFollowersCount(data.followersCount || 0);

      // Check if following
      const followStatus = await axios.get(`http://localhost:8080/contractor/is-following/${userId}`, {
        withCredentials: true
      });
      setIsFollowing(followStatus.data.isFollowing || false);

    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    try {
      const userStr = localStorage.getItem('user');
      const userData = userStr ? JSON.parse(userStr) : null;
      const userId = userData?.id || userData?.userId;

      if (isFollowing) {
        await axios.post(`http://localhost:8080/contractor/unfollow/${userId}`, {}, {
          withCredentials: true
        });
        setIsFollowing(false);
        setFollowersCount(prev => prev - 1);
        toast.success('Unfollowed');
      } else {
        await axios.post(`http://localhost:8080/contractor/follow/${userId}`, {}, {
          withCredentials: true
        });
        setIsFollowing(true);
        setFollowersCount(prev => prev + 1);
        toast.success('Followed');
      }
    } catch (error) {
      console.error('Error following:', error);
      toast.error('Failed to update follow status');
    }
  };

  const getPostTypeIcon = (type) => {
    switch (type) {
      case 'PROJECT_SHOWCASE': return '🔨';
      case 'ACHIEVEMENT': return '🎉';
      case 'EDUCATIONAL': return '📚';
      case 'OFFER': return '💰';
      default: return '📝';
    }
  };

  const getPostTypeLabel = (type) => {
    switch (type) {
      case 'PROJECT_SHOWCASE': return 'Project Showcase';
      case 'ACHIEVEMENT': return 'Achievement';
      case 'EDUCATIONAL': return 'Educational';
      case 'OFFER': return 'Offer';
      default: return 'Post';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="rounded-xl p-12 text-center" style={{ background: '#161B22', border: '1px solid #30363D' }}>
        <p className="text-gray-400">Profile not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      
      {/* ===== COVER PHOTO ===== */}
      <div 
        className="rounded-xl overflow-hidden h-48 relative"
        style={{ background: '#161B22', border: '1px solid #30363D' }}
      >
        <div 
          className="w-full h-full bg-gradient-to-r from-blue-600/30 to-purple-600/30"
          style={{ 
            backgroundImage: profile.coverPhoto ? `url(${profile.coverPhoto})` : 'linear-gradient(135deg, #2563EB, #7C3AED)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
        </div>
      </div>

      {/* ===== PROFILE INFO ===== */}
      <div className="relative px-6 pb-6" style={{ marginTop: '-60px' }}>
        <div className="flex flex-wrap items-end gap-4">
          {/* Profile Picture */}
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gray-700 overflow-hidden border-4 border-[#0D1117]">
              {profile.profilePhoto ? (
                <img src={profile.profilePhoto} alt={profile.fullName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400">👤</div>
              )}
            </div>
          </div>

          {/* Name & Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-white">{profile.fullName}</h1>
              {profile.isVerified && (
                <span className="text-green-400 text-sm bg-green-400/20 px-2 py-0.5 rounded-full">✔️ Verified</span>
              )}
            </div>
            <p className="text-gray-400">{profile.primaryCategory || 'Service Provider'}</p>
            <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-400">
              <span>📍 {profile.location?.city || 'Location not set'}</span>
              <span>•</span>
              <span>📅 {profile.yearsOfExperience || 0} years experience</span>
              <span>•</span>
              <span>⭐ {profile.averageRating?.toFixed(1) || '0.0'}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={handleFollow}
              className={`px-6 py-2 rounded-lg font-medium transition ${
                isFollowing
                  ? 'bg-gray-700 text-white hover:bg-gray-600'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isFollowing ? 'Following ✓' : 'Follow'}
            </button>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              💬 Message
            </button>
            <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
              📅 Book
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex gap-6 mt-4 text-sm">
          <div className="text-center">
            <p className="text-white font-semibold">{profile.totalPosts || 0}</p>
            <p className="text-gray-500 text-xs">Posts</p>
          </div>
          <div className="text-center">
            <p className="text-white font-semibold">{followersCount}</p>
            <p className="text-gray-500 text-xs">Followers</p>
          </div>
          <div className="text-center">
            <p className="text-white font-semibold">{profile.totalReviews || 0}</p>
            <p className="text-gray-500 text-xs">Reviews</p>
          </div>
          <div className="text-center">
            <p className="text-white font-semibold">{profile.completedBookings || 0}</p>
            <p className="text-gray-500 text-xs">Jobs Done</p>
          </div>
          <div className="text-center">
            <p className="text-white font-semibold">₹{profile.totalEarnings || 0}</p>
            <p className="text-gray-500 text-xs">Earnings</p>
          </div>
        </div>
      </div>

      {/* ===== TABS ===== */}
      <div className="flex gap-1 border-b border-gray-700 overflow-x-auto">
        {['posts', 'portfolio', 'services', 'reviews', 'about'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium transition whitespace-nowrap ${
              activeTab === tab
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab === 'posts' && '📰 Posts'}
            {tab === 'portfolio' && '📂 Portfolio'}
            {tab === 'services' && '🔧 Services'}
            {tab === 'reviews' && '💬 Reviews'}
            {tab === 'about' && '📖 About'}
          </button>
        ))}
      </div>

      {/* ===== TAB CONTENT ===== */}
      <div className="space-y-4">
        
        {/* Posts Tab */}
        {activeTab === 'posts' && (
          <div>
            {posts.length === 0 ? (
              <div className="rounded-xl p-8 text-center" style={{ background: '#161B22', border: '1px solid #30363D' }}>
                <p className="text-gray-400">No posts yet</p>
              </div>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="rounded-xl p-4 mb-3" style={{ background: '#161B22', border: '1px solid #30363D' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{getPostTypeIcon(post.type)}</span>
                    <span className="text-xs text-gray-500">{getPostTypeLabel(post.type)}</span>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-white font-semibold">{post.title}</h3>
                  <p className="text-gray-300 text-sm mt-1">{post.description}</p>
                  
                  {post.images && post.images.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      {post.images.slice(0, 3).map((img, index) => (
                        <img key={index} src={img} alt="" className="w-full h-32 object-cover rounded-lg" />
                      ))}
                    </div>
                  )}
                  
                  <div className="flex gap-4 mt-3 text-sm text-gray-400">
                    <span>❤️ {post.likes || 0}</span>
                    <span>💬 {post.comments?.length || 0}</span>
                    <span>👁️ {post.views || 0}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Portfolio Tab */}
        {activeTab === 'portfolio' && (
          <div className="rounded-xl p-6" style={{ background: '#161B22', border: '1px solid #30363D' }}>
            {profile.portfolio && profile.portfolio.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {profile.portfolio.map((item, index) => (
                  <div key={index} className="rounded-lg overflow-hidden border border-gray-700">
                    {item.imageUrls && item.imageUrls.length > 0 && (
                      <img src={item.imageUrls[0]} alt={item.title} className="w-full h-48 object-cover" />
                    )}
                    <div className="p-3">
                      <p className="text-white font-medium text-sm">{item.title}</p>
                      <p className="text-gray-400 text-xs">{item.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">No portfolio items</p>
            )}
          </div>
        )}

        {/* Services Tab */}
        {activeTab === 'services' && (
          <div className="rounded-xl p-6" style={{ background: '#161B22', border: '1px solid #30363D' }}>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-[#0D1117] rounded-lg">
                <span className="text-white">{profile.primaryCategory}</span>
                <span className="text-green-400">✓ Primary</span>
              </div>
              {profile.secondarySkills?.map((skill, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-[#0D1117] rounded-lg">
                  <span className="text-gray-300">{skill}</span>
                  <span className="text-gray-500 text-sm">Secondary</span>
                </div>
              ))}
              <div className="mt-4 p-3 bg-[#0D1117] rounded-lg">
                <p className="text-gray-400 text-sm">💰 Pricing</p>
                <p className="text-white">{profile.pricingType?.replace('_', ' ')}</p>
                <p className="text-white">₹{profile.minimumPrice} - ₹{profile.maximumPrice || 'Negotiable'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="rounded-xl p-6" style={{ background: '#161B22', border: '1px solid #30363D' }}>
            {reviews.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No reviews yet</p>
            ) : (
              reviews.map((review, index) => (
                <div key={index} className="p-4 border-b border-gray-700 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden">
                      {review.customerProfilePhoto ? (
                        <img src={review.customerProfilePhoto} alt={review.customerName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-lg text-gray-400">👤</div>
                      )}
                    </div>
                    <div>
                      <p className="text-white font-medium">{review.customerName}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-400">{'⭐'.repeat(Math.floor(review.rating))}</span>
                        <span className="text-gray-500 text-xs">{review.rating}</span>
                      </div>
                    </div>
                    <span className="ml-auto text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-gray-300 text-sm mt-2">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        )}

        {/* About Tab */}
        {activeTab === 'about' && (
          <div className="rounded-xl p-6" style={{ background: '#161B22', border: '1px solid #30363D' }}>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-1">About Me</h4>
                <p className="text-gray-300">{profile.aboutMe || 'No description provided'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-1">📍 Location</h4>
                <p className="text-gray-300">{profile.location?.address || 'Not specified'}</p>
                <p className="text-gray-400 text-sm">{profile.location?.city}, {profile.location?.state}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-1">🌍 Languages</h4>
                <p className="text-gray-300">{profile.languagesSpoken?.join(', ') || 'Not specified'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-1">📞 Contact</h4>
                <p className="text-gray-300">{profile.phoneNumber || 'Not available'}</p>
                <p className="text-gray-300">{profile.email || 'Not available'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-1">🔗 Social Links</h4>
                <div className="flex gap-3">
                  {profile.websiteUrl && <a href={profile.websiteUrl} target="_blank" rel="noopener" className="text-blue-400 hover:text-blue-300">🌐 Website</a>}
                  {profile.instagramHandle && <a href={`https://instagram.com/${profile.instagramHandle}`} target="_blank" rel="noopener" className="text-pink-400 hover:text-pink-300">📷 Instagram</a>}
                  {profile.youtubeChannel && <a href={profile.youtubeChannel} target="_blank" rel="noopener" className="text-red-400 hover:text-red-300">▶️ YouTube</a>}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
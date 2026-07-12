import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

// ===== COMPONENTS =====
import Sidebar from '../components/contractor/Sidebar';
import Feed from '../components/contractor/Feed';
import RightSidebar from '../components/contractor/RightSidebar';
import MobileNav from '../components/contractor/MobileNav';
import FollowersModal from '../components/contractor/FollowersModal';
import CreatePost from '../components/contractor/CreatePost';
import StoryViewer from '../components/StoryViewer';
import Bookings from '../components/contractor/Bookings';
import Analytics from '../components/contractor/Analytics';
import Messages from '../components/contractor/Messages';
import Profile from '../components/contractor/Profile';
import PostCard from '../components/contractor/PostCard';
import LanguageSwitcher from '../components/LanguageSwitcher';

axios.defaults.withCredentials = true;

const ContractorDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  
  // ===== DATA STATES =====
  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [recommended, setRecommended] = useState([]);
  
  // ===== UI STATES =====
  const [activeTab, setActiveTab] = useState('home');
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showStoryViewer, setShowStoryViewer] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // ===== REF TO PREVENT MULTIPLE FETCHES =====
  const hasFetched = useRef(false);

  // ===== GET CURRENT USER ID HELPER =====
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

  // ===== FETCH DATA =====
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      navigate('/');
      return;
    }
    const userData = JSON.parse(userStr);
    setUser(userData);

    if (userData.userType !== 'CONTRACTOR') {
      navigate('/customer-dashboard');
      return;
    }

    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchAllData();
    }
    
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchAllData = async () => {
    try {
      const userId = getCurrentUserId();
      if (!userId) {
        toast.error('User not found');
        return;
      }

      console.log('🟢 Fetching data for userId:', userId);

      const profileRes = await axios.get(`http://localhost:8080/contractor/profile`, {
        params: { userId: userId },
        withCredentials: true
      });
      setProfile(profileRes.data);

      const postsRes = await axios.get('http://localhost:8080/posts/feed', {
        withCredentials: true
      });
      console.log('📰 Feed posts received:', postsRes.data?.length || 0);
      setPosts(postsRes.data || []);

      const storiesRes = await axios.get('http://localhost:8080/stories/feed', {
        withCredentials: true
      });
      setStories(storiesRes.data || []);

      try {
        const bookingsRes = await axios.get('http://localhost:8080/bookings/contractor', {
          withCredentials: true
        });
        setBookings(bookingsRes.data || []);
      } catch (bookingError) {
        if (bookingError.response?.status === 404) {
          console.log('No bookings found');
          setBookings([]);
        } else {
          throw bookingError;
        }
      }

      try {
        const followersRes = await axios.get(`http://localhost:8080/contractor/followers/${userId}`, {
          withCredentials: true
        });
        setFollowers(followersRes.data || []);
      } catch (e) {
        setFollowers([]);
      }

      try {
        const followingRes = await axios.get(`http://localhost:8080/contractor/following/${userId}`, {
          withCredentials: true
        });
        setFollowing(followingRes.data || []);
      } catch (e) {
        setFollowing([]);
      }

      try {
        const recommendedRes = await axios.get('http://localhost:8080/contractor/recommended', {
          withCredentials: true
        });
        setRecommended(recommendedRes.data || []);
      } catch (e) {
        setRecommended([]);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response?.status === 404 && error.config?.url?.includes('/contractor/profile')) {
        navigate('/contractor-registration');
      } else {
        toast.error('Failed to load dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  // ===== HANDLERS =====
  const handleRefresh = () => {
    fetchAllData();
    toast.success('Refreshed!');
  };

  const handleViewStory = (index) => {
    setSelectedStoryIndex(index);
    setShowStoryViewer(true);
  };

  const handleFollowToggle = async (targetUserId, isFollowing) => {
    try {
      if (isFollowing) {
        await axios.post(`http://localhost:8080/contractor/unfollow/${targetUserId}`, {}, {
          withCredentials: true
        });
        toast.success('Unfollowed');
      } else {
        await axios.post(`http://localhost:8080/contractor/follow/${targetUserId}`, {}, {
          withCredentials: true
        });
        toast.success('Followed');
      }
      fetchAllData();
    } catch (error) {
      console.error('Error following/unfollowing:', error);
      toast.error('Failed to update follow status');
    }
  };

  const handleLike = async (postId) => {
    try {
      const response = await axios.post(`http://localhost:8080/posts/${postId}/like`, {}, {
        withCredentials: true
      });
      if (response.data.success) {
        setPosts(posts.map(p => 
          p.id === postId ? { ...p, likes: response.data.likes } : p
        ));
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (postId, text) => {
    try {
      const response = await axios.post(`http://localhost:8080/posts/${postId}/comment`, { text }, {
        withCredentials: true
      });
      if (response.data.success) {
        setPosts(posts.map(p => 
          p.id === postId ? { ...p, comments: response.data.comments } : p
        ));
      }
    } catch (error) {
      console.error('Error commenting on post:', error);
    }
  };

  const handleSave = async (postId) => {
    try {
      toast.success('Post saved! (Coming soon)');
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  const handleShare = async (postId) => {
    try {
      const url = `${window.location.origin}/post/${postId}`;
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    } catch (error) {
      console.error('Error sharing post:', error);
      toast.error('Failed to copy link');
    }
  };

  // ===== HANDLE POST DELETED =====
  const handlePostDeleted = (postId) => {
    setPosts(posts.filter(p => p.id !== postId));
    toast.success('Post removed');
  };

  // ===== HANDLE POST EDITED =====
  const handlePostEdited = (updatedPost) => {
    setPosts(posts.map(p => 
      p.id === updatedPost.id ? updatedPost : p
    ));
    toast.success('Post updated!');
  };

  // ===== RENDER CONTENT =====
  const renderContent = () => {
    const currentUserId = getCurrentUserId();

    switch (activeTab) {
      case 'home': {
        return (
          <Feed 
            posts={posts}
            stories={stories}
            profile={profile}
            user={user}
            onViewStory={handleViewStory}
            onCreatePost={() => setShowCreatePost(true)}
            onRefresh={handleRefresh}
            onFollowToggle={handleFollowToggle}
            onLike={handleLike}
            onComment={handleComment}
            onSave={handleSave}
            onShare={handleShare}
            onPostDeleted={handlePostDeleted}
            onPostEdited={handlePostEdited}
          />
        );
      }
      case 'bookings':
        return <Bookings />;
      case 'analytics':
        return <Analytics />;
      case 'messages':
        return <Messages />;
      case 'profile':
        return <Profile />;
      case 'posts': {
        const myPosts = posts.filter(p => p.contractorId === currentUserId);
        
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">📰 My Posts</h2>
              <button 
                onClick={() => setShowCreatePost(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
              >
                + Create Post
              </button>
            </div>
            {myPosts.length === 0 ? (
              <div className="rounded-xl p-8 text-center" style={{ background: '#161B22', border: '1px solid #30363D' }}>
                <p className="text-gray-400">You haven't created any posts yet.</p>
                <button 
                  onClick={() => setShowCreatePost(true)}
                  className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                >
                  Create Your First Post
                </button>
              </div>
            ) : (
              // ✅ FIXED: Using PostCard component for Edit + Delete
              myPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={handleLike}
                  onComment={handleComment}
                  onShare={handleShare}
                  onSave={handleSave}
                  onViewProfile={() => {}}
                  onPostDeleted={handlePostDeleted}
                  onPostEdited={handlePostEdited}
                />
              ))
            )}
          </div>
        );
      }
      case 'stories': {
        const currentUserId2 = getCurrentUserId();
        const myStories = stories.filter(s => s.contractorId === currentUserId2);
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">📸 My Stories</h2>
              <button 
                onClick={() => setShowCreatePost(true)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm"
              >
                + Add Story
              </button>
            </div>
            {myStories.length === 0 ? (
              <div className="rounded-xl p-8 text-center" style={{ background: '#161B22', border: '1px solid #30363D' }}>
                <p className="text-gray-400">No stories yet</p>
                <button 
                  onClick={() => setShowCreatePost(true)}
                  className="mt-3 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm"
                >
                  Add Your First Story
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {myStories.map((story, index) => {
                  const storyIndex = stories.indexOf(story);
                  return (
                    <div 
                      key={story.id} 
                      className="rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition"
                      style={{ background: '#161B22', border: '1px solid #30363D' }}
                      onClick={() => handleViewStory(storyIndex >= 0 ? storyIndex : 0)}
                    >
                      <div className="aspect-square bg-gradient-to-br from-purple-500 to-pink-500 p-0.5">
                        <div className="w-full h-full bg-[#161B22] overflow-hidden">
                          {story.type === 'VIDEO' ? (
                            <div className="w-full h-full bg-gray-900 flex items-center justify-center text-4xl text-white">▶️</div>
                          ) : (
                            <img 
                              src={story.mediaUrl || 'https://via.placeholder.com/200'} 
                              alt={story.caption || 'Story'} 
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                      </div>
                      <div className="p-2">
                        <p className="text-white text-sm truncate">{story.caption || 'Story'}</p>
                        <p className="text-gray-500 text-xs">{new Date(story.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      }
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0D1117' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading dashboard...</p>
        </div>
        <LanguageSwitcher />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 md:pb-0" style={{ background: '#0D1117' }}>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex gap-6">
          
          <div className="hidden lg:block w-64 flex-shrink-0">
            <Sidebar 
              user={user}
              profile={profile}
              followers={followers}
              following={following}
              onShowFollowers={() => setShowFollowersModal(true)}
              onShowFollowing={() => setShowFollowingModal(true)}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onFollowToggle={handleFollowToggle}
            />
          </div>

          <div className="flex-1 min-w-0">
            {renderContent()}
          </div>

          <div className="hidden xl:block w-72 flex-shrink-0">
            <RightSidebar 
              profile={profile}
              bookings={bookings}
              recommended={recommended}
              onRefresh={handleRefresh}
              onFollowToggle={handleFollowToggle}
            />
          </div>

        </div>
      </div>

      <MobileNav 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        onCreatePost={() => setShowCreatePost(true)}
      />

      {showFollowersModal && (
        <FollowersModal 
          type="followers"
          users={followers}
          onClose={() => setShowFollowersModal(false)}
          onFollow={handleFollowToggle}
        />
      )}

      {showFollowingModal && (
        <FollowersModal 
          type="following"
          users={following}
          onClose={() => setShowFollowingModal(false)}
          onFollow={handleFollowToggle}
        />
      )}

      {showCreatePost && (
        <CreatePost 
          onClose={() => setShowCreatePost(false)}
          onPostCreated={() => {
            setShowCreatePost(false);
            fetchAllData();
          }}
        />
      )}

      {showStoryViewer && stories.length > 0 && (
        <StoryViewer 
          stories={stories}
          initialIndex={selectedStoryIndex}
          onClose={() => setShowStoryViewer(false)}
        />
      )}

      <LanguageSwitcher />
    </div>
  );
};

export default ContractorDashboard;
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

// ===== CUSTOMER COMPONENTS =====
import CustomerSidebar from '../components/customer/CustomerSidebar';
import CustomerRightSidebar from '../components/customer/CustomerRightSidebar';
import CustomerMobileNav from '../components/customer/CustomerMobileNav';
import Feed from '../components/contractor/Feed';
import StoryViewer from '../components/StoryViewer';
import ContractorProfile from '../components/ContractorProfile';
import BookingModal from '../components/BookingModal';
import BookingDashboard from '../components/BookingDashboard';
import CustomerProfile from '../components/CustomerProfile';
import ChatModal from '../components/ChatModal';
import LanguageSwitcher from '../components/LanguageSwitcher';
import SearchFilterSidebar from '../components/contractor/SearchFilterSidebar';

axios.defaults.withCredentials = true;

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // ===== DATA STATES =====
  const [posts, setPosts] = useState([]);
  const [feedStories, setFeedStories] = useState([]);
  const [contractors, setContractors] = useState([]);
  const [filteredContractors, setFilteredContractors] = useState([]);
  const [following, setFollowing] = useState([]);
  const [recommended, setRecommended] = useState([]);
  
  // ===== UI STATES =====
  const [activeTab, setActiveTab] = useState('home');
  const [selectedContractor, setSelectedContractor] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatPartner, setChatPartner] = useState(null);
  const [showStoryViewer, setShowStoryViewer] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);
  const [allStoriesForViewer, setAllStoriesForViewer] = useState([]);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  
  const hasFetched = useRef(false);

  // ===== GET CURRENT USER ID =====
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

  // ===== GET CURRENT USER =====
  const getCurrentUser = () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  };

  // ===== INITIAL LOAD =====
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      navigate('/');
      return;
    }
    const userData = JSON.parse(userStr);
    setUser(userData);

    if (userData.userType === 'CONTRACTOR') {
      navigate('/contractor-dashboard');
      return;
    }

    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchAllData();
    }
  }, []);

  // ===== FETCH ALL DATA =====
  const fetchAllData = async () => {
    try {
      const userId = getCurrentUserId();
      if (!userId) {
        toast.error('User not found');
        return;
      }

      console.log('🟢 Fetching customer data for userId:', userId);

      // 1. Get Feed Posts
      const postsRes = await axios.get('http://localhost:8080/posts/feed', {
        withCredentials: true
      });
      console.log('📰 Feed posts received:', postsRes.data?.length || 0);
      setPosts(postsRes.data || []);

      // 2. Get Feed Stories
      const storiesRes = await axios.get('http://localhost:8080/stories/feed', {
        withCredentials: true
      });
      console.log('📸 Feed stories received:', storiesRes.data?.length || 0);
      setFeedStories(storiesRes.data || []);

      // 3. Get All Contractors
      try {
        const contractorsRes = await axios.get('http://localhost:8080/contractor', {
          withCredentials: true
        });
        setContractors(contractorsRes.data || []);
        setFilteredContractors(contractorsRes.data || []);
      } catch (e) {
        setContractors([]);
        setFilteredContractors([]);
      }

      // ✅ 4. Get Following List - Handle missing contractor gracefully
      try {
        const followingRes = await axios.get(`http://localhost:8080/contractor/following/${userId}`, {
          withCredentials: true
        });
        setFollowing(Array.isArray(followingRes.data) ? followingRes.data : []);
        console.log('👥 Following list:', following.length);
      } catch (e) {
        // ✅ If customer doesn't have contractor profile, just set empty array
        console.log('ℹ️ No following data (customer may not have contractor profile)');
        setFollowing([]);
      }

      // 5. Get Recommended Contractors
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
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  // ===== REFRESH =====
  const handleRefresh = () => {
    fetchAllData();
    toast.success('Refreshed!');
  };

  // ===== VIEW STORY =====
  const handleViewStory = (storiesToShow) => {
    if (!storiesToShow || storiesToShow.length === 0) {
      toast.error('No stories to show');
      return;
    }
    
    const sortedStories = [...storiesToShow].sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
    
    setAllStoriesForViewer(sortedStories);
    setSelectedStoryIndex(0);
    setShowStoryViewer(true);
  };

  // ✅ ===== FOLLOW / UNFOLLOW - FIXED =====
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
      
      // ✅ Refresh following list after follow/unfollow
      const userId = getCurrentUserId();
      try {
        const followingRes = await axios.get(`http://localhost:8080/contractor/following/${userId}`, {
          withCredentials: true
        });
        setFollowing(Array.isArray(followingRes.data) ? followingRes.data : []);
        console.log('👥 Updated following list:', followingRes.data?.length || 0);
      } catch (e) {
        console.log('ℹ️ Could not refresh following list - customer may not have contractor profile');
        // ✅ Keep existing following list, don't reset to 0
      }
      
      // ✅ Refresh everything else
      fetchAllData();
      
    } catch (error) {
      console.error('Error following/unfollowing:', error);
      toast.error(error.response?.data?.error || 'Failed to update follow status');
    }
  };

  // ===== LIKE POST =====
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

  // ===== COMMENT ON POST =====
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

  // ===== SHARE POST =====
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

  // ===== SAVE POST =====
  const handleSave = async (postId) => {
    try {
      toast.success('Post saved! (Coming soon)');
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  // ===== VIEW PROFILE =====
  const handleViewProfile = (contractorId) => {
    setSelectedContractor(contractorId);
    setShowProfile(true);
  };

  // ===== BOOK SERVICE =====
  const handleBookService = (contractorId) => {
    setSelectedContractor(contractorId);
    setShowBooking(true);
  };

  // ===== CHAT =====
  const handleChat = (contractorId) => {
    setChatPartner(contractorId);
    setShowChat(true);
  };

  // ===== FILTER CONTRACTORS =====
  const handleFilterContractors = (filtered) => {
    setFilteredContractors(filtered);
  };

  // ===== RENDER CONTENT =====
  const renderContent = () => {
    const currentUser = getCurrentUser();

    switch (activeTab) {
      case 'home': {
        const sortedStories = [...feedStories].sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        
        return (
          <Feed 
            posts={posts}
            stories={sortedStories}
            profile={null}
            user={currentUser}
            onViewStory={handleViewStory}
            onCreatePost={() => {}} // ❌ No create post for customer
            onCreateStory={() => {}} // ❌ No create story for customer
            onRefresh={handleRefresh}
            onFollowToggle={handleFollowToggle}
            onLike={handleLike}
            onComment={handleComment}
            onSave={handleSave}
            onShare={handleShare}
            onPostDeleted={() => {}} // ❌ No delete for customer
            onPostEdited={() => {}} // ❌ No edit for customer
          />
        );
      }
      
      case 'search': {
        return (
          <div className="space-y-4">
            <SearchFilterSidebar 
              contractors={contractors}
              onFilter={handleFilterContractors}
              onFollowToggle={handleFollowToggle}
              onNavigateToSearch={() => setActiveTab('search')}
            />
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">🔍 Find Contractors</h2>
                <span className="text-sm text-gray-400">{filteredContractors.length} contractors found</span>
              </div>
              {filteredContractors.length === 0 ? (
                <div className="rounded-xl p-8 text-center" style={{ background: '#161B22', border: '1px solid #30363D' }}>
                  <p className="text-gray-400">No contractors found matching your criteria</p>
                  <button 
                    onClick={() => setFilteredContractors(contractors)}
                    className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                  >
                    Show All Contractors
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredContractors.map((contractor) => {
                    const isFollowingUser = following.some(f => f.userId === contractor.userId);
                    return (
                      <div key={contractor.id} className="rounded-xl p-4" style={{ background: '#161B22', border: '1px solid #30363D' }}>
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-full bg-gray-700 overflow-hidden flex-shrink-0">
                            {contractor.profilePhoto ? (
                              <img src={contractor.profilePhoto} alt={contractor.fullName} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xl text-gray-400">👤</div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-white font-semibold truncate">{contractor.fullName}</p>
                              {contractor.isVerified && (
                                <span className="text-green-400 text-xs">✔️</span>
                              )}
                            </div>
                            <p className="text-blue-400 text-sm">{contractor.primaryCategory}</p>
                            <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                              <span>⭐ {contractor.averageRating?.toFixed(1) || 0}</span>
                              <span>📍 {contractor.serviceAreas?.[0] || 'N/A'}</span>
                              <span>💰 ₹{contractor.minimumPrice || 0}</span>
                            </div>
                            <div className="flex gap-2 mt-2">
                              <button
                                onClick={() => handleViewProfile(contractor.userId)}
                                className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-xs"
                              >
                                View Profile
                              </button>
                              <button
                                onClick={() => handleFollowToggle(contractor.userId, isFollowingUser)}
                                className={`px-3 py-1 rounded-lg transition text-xs ${
                                  isFollowingUser
                                    ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30'
                                    : 'bg-green-600 text-white hover:bg-green-700'
                                }`}
                              >
                                {isFollowingUser ? '✅ Following' : '+ Follow'}
                              </button>
                              <button
                                onClick={() => handleBookService(contractor.userId)}
                                className="px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-xs"
                              >
                                Book
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        );
      }
      
      case 'bookings':
        return <BookingDashboard />;
      
      case 'messages':
        return (
          <div className="rounded-xl p-8 text-center" style={{ background: '#161B22', border: '1px solid #30363D' }}>
            <p className="text-gray-400">💬 Messages coming soon!</p>
          </div>
        );
      
      case 'profile':
        return <CustomerProfile user={user} />;
      
      case 'settings':
        return (
          <div className="rounded-xl p-8 text-center" style={{ background: '#161B22', border: '1px solid #30363D' }}>
            <p className="text-gray-400">⚙ Settings coming soon!</p>
          </div>
        );
      
      default:
        return null;
    }
  };

  // ===== LOADING STATE =====
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

  // ===== RENDER =====
  return (
    <div className="min-h-screen pb-20 md:pb-0" style={{ background: '#0D1117' }}>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex gap-6">
          
          {/* ===== SIDEBAR ===== */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <CustomerSidebar 
              user={user}
              following={following}
              onShowFollowing={() => setShowFollowingModal(true)}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onFollowToggle={handleFollowToggle}
            />
          </div>

          {/* ===== MAIN CONTENT ===== */}
          <div className="flex-1 min-w-0">
            {renderContent()}
          </div>

          {/* ===== RIGHT SIDEBAR ===== */}
          <div className="hidden xl:block w-72 flex-shrink-0 space-y-4">
            <CustomerRightSidebar 
              recommended={recommended}
              onRefresh={handleRefresh}
              onFollowToggle={handleFollowToggle}
              followingList={following.map(f => f.userId)}
            />
          </div>

        </div>
      </div>

      {/* ===== MOBILE NAV ===== */}
      <CustomerMobileNav 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
      />

      {/* ===== FOLLOWING MODAL ===== */}
      {showFollowingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-[#161B22] rounded-2xl max-w-md w-full mx-4 p-6 border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white text-lg font-bold">Following</h3>
              <button 
                onClick={() => setShowFollowingModal(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>
            {following.length === 0 ? (
              <p className="text-gray-400 text-center py-8">You're not following anyone yet</p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {following.map((f) => (
                  <div key={f.userId} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden">
                        {f.profilePhoto ? (
                          <img src={f.profilePhoto} alt={f.fullName} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-lg text-gray-400">👤</div>
                        )}
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{f.fullName}</p>
                        <p className="text-gray-400 text-xs">{f.primaryCategory}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        handleFollowToggle(f.userId, true);
                        setShowFollowingModal(false);
                      }}
                      className="text-xs px-3 py-1 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500/30 transition"
                    >
                      Unfollow
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== PROFILE VIEWER ===== */}
      {showProfile && selectedContractor && (
        <ContractorProfile
          contractorId={selectedContractor}
          onClose={() => setShowProfile(false)}
          onBook={handleBookService}
          onChat={handleChat}
          onFollow={handleFollowToggle}
        />
      )}

      {/* ===== BOOKING MODAL ===== */}
      {showBooking && selectedContractor && (
        <BookingModal
          contractorId={selectedContractor}
          onClose={() => setShowBooking(false)}
          onSuccess={() => {
            setShowBooking(false);
            toast.success('Booking request sent!');
          }}
        />
      )}

      {/* ===== CHAT MODAL ===== */}
      {showChat && chatPartner && (
        <ChatModal
          contractorId={chatPartner}
          onClose={() => setShowChat(false)}
        />
      )}

      {/* ===== STORY VIEWER ===== */}
      {showStoryViewer && (
        <StoryViewer 
          stories={allStoriesForViewer}
          initialIndex={selectedStoryIndex}
          onClose={() => setShowStoryViewer(false)}
          onStoryEnd={() => {
            setShowStoryViewer(false);
          }}
        />
      )}

      <LanguageSwitcher />
    </div>
  );
};

export default CustomerDashboard;
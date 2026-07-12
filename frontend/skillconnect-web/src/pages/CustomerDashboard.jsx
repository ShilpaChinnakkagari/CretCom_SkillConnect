import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import LanguageSwitcher from '../components/LanguageSwitcher';
import PostCard from '../components/PostCard';
import StoryViewer from '../components/StoryViewer';
import ContractorProfile from '../components/ContractorProfile';
import BookingModal from '../components/BookingModal';
import BookingDashboard from '../components/BookingDashboard';
import CustomerProfile from '../components/CustomerProfile';
import ChatModal from '../components/ChatModal';

axios.defaults.withCredentials = true;

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('feed');
  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);
  const [contractors, setContractors] = useState([]);
  const [filteredContractors, setFilteredContractors] = useState([]);
  const [selectedContractor, setSelectedContractor] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatPartner, setChatPartner] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showStoryViewer, setShowStoryViewer] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  const categories = [
    'All', 'Construction', 'Beauty & Personal Care', 'Stitching & Fashion',
    'Events', 'Property', 'Education', 'Health & Wellness', 'Technology',
    'Home Services', 'Business Services', 'Pet Services', 'Art & Hobby Trainer',
    'Food Services', 'Appliance Service', 'Others'
  ];

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

    fetchFeed();
    fetchStories();
    fetchContractors();
  }, []);

  const fetchFeed = async () => {
    try {
      const response = await axios.get('http://localhost:8080/posts/feed', {
        withCredentials: true
      });
      setPosts(response.data || []);
    } catch (error) {
      console.error('Error fetching feed:', error);
    }
  };

  const fetchStories = async () => {
    try {
      const response = await axios.get('http://localhost:8080/stories/feed', {
        withCredentials: true
      });
      setStories(response.data || []);
    } catch (error) {
      console.error('Error fetching stories:', error);
    }
  };

  const fetchContractors = async () => {
    try {
      const response = await axios.get('http://localhost:8080/contractor', {
        withCredentials: true
      });
      setContractors(response.data || []);
      setFilteredContractors(response.data || []);
    } catch (error) {
      console.error('Error fetching contractors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    filterContractors(term, selectedCategory);
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    filterContractors(searchTerm, category);
  };

  const filterContractors = (term, category) => {
    let filtered = contractors;
    
    if (term) {
      filtered = filtered.filter(c => 
        c.fullName?.toLowerCase().includes(term) ||
        c.primaryCategory?.toLowerCase().includes(term) ||
        c.serviceAreas?.some(area => area.toLowerCase().includes(term))
      );
    }
    
    if (category && category !== 'All') {
      filtered = filtered.filter(c => c.primaryCategory === category);
    }
    
    setFilteredContractors(filtered);
  };

  const handleLikePost = async (postId) => {
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

  const handleCommentPost = async (postId, text) => {
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

  const handleViewStory = (index) => {
    setSelectedStoryIndex(index);
    setShowStoryViewer(true);
  };

  const handleViewProfile = (contractorId) => {
    setSelectedContractor(contractorId);
    setShowProfile(true);
  };

  const handleBookService = (contractorId) => {
    setSelectedContractor(contractorId);
    setShowBooking(true);
  };

  const handleChat = (contractorId) => {
    setChatPartner(contractorId);
    setShowChat(true);
  };

  const handleFollow = async (contractorId) => {
    try {
      await axios.post(`http://localhost:8080/contractor/follow/${contractorId}`, {}, {
        withCredentials: true
      });
      toast.success('Followed successfully!');
      fetchFeed();
    } catch (error) {
      console.error('Error following:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
        <LanguageSwitcher />
      </div>
    );
  }

  const renderFeed = () => (
    <div className="space-y-4">
      {/* Stories */}
      {stories.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-3">📸 Stories</h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {stories.map((story, index) => (
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

      {/* Feed Posts */}
      {posts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-gray-500">No posts in your feed. Follow some contractors to see their updates!</p>
          <button 
            onClick={() => setActiveTab('explore')}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Explore Contractors
          </button>
        </div>
      ) : (
        posts.map(post => (
          <PostCard
            key={post.id}
            post={post}
            onLike={handleLikePost}
            onComment={handleCommentPost}
            onViewProfile={handleViewProfile}
          />
        ))
      )}
    </div>
  );

  const renderExplore = () => (
    <div>
      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search for services, professionals, or locations..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryFilter(cat)}
            className={`px-4 py-2 rounded-full text-sm transition ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Contractors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContractors.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            No contractors found matching your criteria
          </div>
        ) : (
          filteredContractors.map((contractor) => (
            <div key={contractor.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
              <div className="flex items-start gap-4">
                <div 
                  className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl overflow-hidden cursor-pointer"
                  onClick={() => handleViewProfile(contractor.userId)}
                >
                  {contractor.profilePhoto ? (
                    <img src={contractor.profilePhoto} alt={contractor.fullName} className="w-full h-full object-cover" />
                  ) : (
                    '👤'
                  )}
                </div>
                <div className="flex-1">
                  <h3 
                    className="font-semibold text-gray-900 cursor-pointer hover:text-indigo-600"
                    onClick={() => handleViewProfile(contractor.userId)}
                  >
                    {contractor.fullName}
                    {contractor.isVerified && (
                      <span className="ml-1 text-blue-500 text-sm">✅</span>
                    )}
                  </h3>
                  <p className="text-sm text-indigo-600">{contractor.primaryCategory}</p>
                  <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                    <span>⭐ {contractor.averageRating?.toFixed(1) || 0}</span>
                    <span>📍 {contractor.serviceAreas?.[0] || 'N/A'}</span>
                    <span>💰 ₹{contractor.minimumPrice || 0}/hr</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{contractor.aboutMe?.slice(0, 60)}...</p>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleViewProfile(contractor.userId)}
                      className="flex-1 px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => handleBookService(contractor.userId)}
                      className="flex-1 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">👋 Welcome, {user?.name || 'User'}</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('notifications')}
              className="relative text-gray-600 hover:text-gray-800"
            >
              🔔
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('user');
                navigate('/');
              }}
              className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-6 overflow-x-auto py-2">
            {['feed', 'explore', 'bookings', 'saved', 'profile'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-2 text-sm font-medium capitalize transition whitespace-nowrap ${
                  activeTab === tab
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'feed' ? '🏠 Home' :
                 tab === 'explore' ? '🔍 Explore' :
                 tab === 'bookings' ? '📅 Bookings' :
                 tab === 'saved' ? '❤️ Saved' :
                 '👤 Profile'}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'feed' && renderFeed()}
        {activeTab === 'explore' && renderExplore()}
        {activeTab === 'bookings' && <BookingDashboard />}
        {activeTab === 'saved' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <p className="text-gray-500">Your saved experts will appear here</p>
          </div>
        )}
        {activeTab === 'profile' && <CustomerProfile user={user} />}
      </div>

      {/* Modals */}
      {showProfile && selectedContractor && (
        <ContractorProfile
          contractorId={selectedContractor}
          onClose={() => setShowProfile(false)}
          onBook={handleBookService}
          onChat={handleChat}
          onFollow={handleFollow}
        />
      )}

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

      {showChat && chatPartner && (
        <ChatModal
          contractorId={chatPartner}
          onClose={() => setShowChat(false)}
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

export default CustomerDashboard;
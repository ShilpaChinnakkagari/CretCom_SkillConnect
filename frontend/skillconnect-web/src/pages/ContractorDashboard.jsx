import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import LanguageSwitcher from '../components/LanguageSwitcher';
import StoryViewer from '../components/StoryViewer';

axios.defaults.withCredentials = true;

const ContractorDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);
  
  // Modal states
  const [showPostModal, setShowPostModal] = useState(false);
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  
  // Story viewer state
  const [showStoryViewer, setShowStoryViewer] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);
  
  // Post form states
  const [postForm, setPostForm] = useState({
    type: 'PROJECT_SHOWCASE',
    title: '',
    description: '',
    images: [],
    videoUrl: '',
    fileUrl: '',
    fileName: '',
    location: '',
    category: '',
    budget: ''
  });
  const [postLoading, setPostLoading] = useState(false);
  
  // Story form states
  const [storyForm, setStoryForm] = useState({
    type: 'PHOTO',
    mediaUrl: '',
    caption: ''
  });
  const [storyLoading, setStoryLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedDocFile, setSelectedDocFile] = useState(null);

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

    fetchProfile();
    fetchBookings();
    fetchPosts();
    fetchStories();
  }, []);

  const fetchProfile = async () => {
    try {
      const userStr = localStorage.getItem('user');
      const userData = userStr ? JSON.parse(userStr) : null;
      const userId = userData?.id || userData?.userId;

      const response = await axios.get(`http://localhost:8080/contractor/profile`, {
        params: { userId: userId },
        withCredentials: true
      });
      setProfile(response.data);
    } catch (error) {
      if (error.response?.status === 404) {
        navigate('/contractor-registration');
      } else {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile');
      }
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await axios.get('http://localhost:8080/bookings/contractor', {
        withCredentials: true
      });
      setBookings(response.data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const fetchPosts = async () => {
    try {
      const userStr = localStorage.getItem('user');
      const userData = userStr ? JSON.parse(userStr) : null;
      const userId = userData?.id || userData?.userId;
      
      const response = await axios.get(`http://localhost:8080/posts/contractor/${userId}`, {
        withCredentials: true
      });
      setPosts(response.data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const fetchStories = async () => {
    try {
      const userStr = localStorage.getItem('user');
      const userData = userStr ? JSON.parse(userStr) : null;
      const userId = userData?.id || userData?.userId;
      
      const response = await axios.get(`http://localhost:8080/stories/contractor/${userId}`, {
        withCredentials: true
      });
      setStories(response.data || []);
    } catch (error) {
      console.error('Error fetching stories:', error);
    } finally {
      setLoading(false);
    }
  };

  // ===== STORY VIEWER HANDLERS =====
  const handleViewStory = (index) => {
    setSelectedStoryIndex(index);
    setShowStoryViewer(true);
  };

  const handleBookingStatus = async (bookingId, status) => {
    try {
      await axios.put(`http://localhost:8080/bookings/${bookingId}/status`, {
        status: status
      }, {
        withCredentials: true
      });
      toast.success(`Booking ${status.toLowerCase()}!`);
      fetchBookings();
    } catch (error) {
      console.error('Error updating booking:', error);
      toast.error('Failed to update booking');
    }
  };

  // ===== POST HANDLERS =====
  const handlePostFormChange = (e) => {
    const { name, value } = e.target;
    setPostForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePostImageUpload = (e) => {
    const files = e.target.files;
    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPostForm(prev => ({
          ...prev,
          images: [...prev.images, reader.result]
        }));
      };
      reader.readAsDataURL(files[i]);
    }
  };

  const handlePostFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedDocFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPostForm(prev => ({
          ...prev,
          fileUrl: reader.result,
          fileName: file.name
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removePostImage = (index) => {
    setPostForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!postForm.title || !postForm.description) {
      toast.error('Please add title and description');
      return;
    }

    setPostLoading(true);
    try {
      const response = await axios.post('http://localhost:8080/posts/create', postForm, {
        withCredentials: true
      });
      
      if (response.data) {
        toast.success('Post created successfully!');
        setPosts([response.data, ...posts]);
        setShowPostModal(false);
        resetPostForm();
      }
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error(error.response?.data?.error || 'Failed to create post');
    } finally {
      setPostLoading(false);
    }
  };

  const handleEditPost = async (e) => {
    e.preventDefault();
    if (!postForm.title || !postForm.description) {
      toast.error('Please add title and description');
      return;
    }

    setPostLoading(true);
    try {
      const response = await axios.put(`http://localhost:8080/posts/${editingPost.id}`, postForm, {
        withCredentials: true
      });
      
      if (response.data) {
        toast.success('Post updated successfully!');
        setPosts(posts.map(p => p.id === editingPost.id ? response.data : p));
        setShowEditModal(false);
        resetPostForm();
        setEditingPost(null);
      }
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error(error.response?.data?.error || 'Failed to update post');
    } finally {
      setPostLoading(false);
    }
  };

  const resetPostForm = () => {
    setPostForm({
      type: 'PROJECT_SHOWCASE',
      title: '',
      description: '',
      images: [],
      videoUrl: '',
      fileUrl: '',
      fileName: '',
      location: '',
      category: '',
      budget: ''
    });
    setSelectedDocFile(null);
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    try {
      await axios.delete(`http://localhost:8080/posts/${postId}`, {
        withCredentials: true
      });
      toast.success('Post deleted!');
      setPosts(posts.filter(p => p.id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    }
  };

  const openEditModal = (post) => {
    setEditingPost(post);
    setPostForm({
      type: post.type || 'PROJECT_SHOWCASE',
      title: post.title || '',
      description: post.description || '',
      images: post.images || [],
      videoUrl: post.videoUrl || '',
      fileUrl: post.fileUrl || '',
      fileName: post.fileName || '',
      location: post.location || '',
      category: post.category || '',
      budget: post.budget || ''
    });
    setShowEditModal(true);
  };

  // ===== STORY HANDLERS =====
  const handleStoryFormChange = (e) => {
    const { name, value } = e.target;
    setStoryForm(prev => ({ ...prev, [name]: value }));
  };

  const handleStoryFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setStoryForm(prev => ({
          ...prev,
          mediaUrl: reader.result,
          type: file.type.startsWith('video') ? 'VIDEO' : 'PHOTO'
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateStory = async (e) => {
    e.preventDefault();
    if (!storyForm.mediaUrl) {
      toast.error('Please select an image or video');
      return;
    }

    setStoryLoading(true);
    try {
      const response = await axios.post('http://localhost:8080/stories/create', storyForm, {
        withCredentials: true
      });
      
      if (response.data) {
        toast.success('Story created! It will expire in 24 hours.');
        setStories([response.data, ...stories]);
        setShowStoryModal(false);
        setStoryForm({ type: 'PHOTO', mediaUrl: '', caption: '' });
        setSelectedFile(null);
      }
    } catch (error) {
      console.error('Error creating story:', error);
      toast.error(error.response?.data?.error || 'Failed to create story');
    } finally {
      setStoryLoading(false);
    }
  };

  const handleDeleteStory = async (storyId) => {
    if (!window.confirm('Are you sure you want to delete this story?')) return;
    
    try {
      await axios.delete(`http://localhost:8080/stories/${storyId}`, {
        withCredentials: true
      });
      toast.success('Story deleted!');
      setStories(stories.filter(s => s.id !== storyId));
    } catch (error) {
      console.error('Error deleting story:', error);
      toast.error('Failed to delete story');
    }
  };

  const handleSwitchToCustomer = async () => {
    try {
      const userStr = localStorage.getItem('user');
      const userData = userStr ? JSON.parse(userStr) : null;
      
      await axios.put('http://localhost:8080/auth/users/role', {
        userType: 'CUSTOMER'
      }, {
        withCredentials: true
      });
      
      if (userData) {
        userData.userType = 'CUSTOMER';
        userData.role = 'CUSTOMER';
        localStorage.setItem('user', JSON.stringify(userData));
      }
      
      toast.success('Switched to Customer mode!');
      navigate('/customer-dashboard');
    } catch (error) {
      console.error('Error switching role:', error);
      toast.error('Failed to switch mode');
    }
  };

  const getPostTypeIcon = (type) => {
    switch (type) {
      case 'PROJECT_SHOWCASE': return '🔨';
      case 'ACHIEVEMENT': return '🎉';
      case 'EDUCATIONAL': return '📚';
      case 'OFFER': return '🔥';
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

  const pendingBookings = bookings.filter(b => b.status === 'PENDING');

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">Contractor Dashboard</h1>
            <span className="text-sm text-gray-500">Welcome, {user?.name || 'User'}</span>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {profile?.registrationComplete !== true && (
              <button
                onClick={() => navigate('/contractor-registration')}
                className="px-4 py-2 text-sm bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
              >
                Complete Profile
              </button>
            )}
            <button
              onClick={() => setShowPostModal(true)}
              className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              📝 Create Post
            </button>
            <button
              onClick={() => setShowStoryModal(true)}
              className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              📸 Add Story
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
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{pendingBookings.length}</p>
            <p className="text-xs text-gray-500">Pending</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{bookings.filter(b => b.status === 'ACCEPTED').length}</p>
            <p className="text-xs text-gray-500">Accepted</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{bookings.filter(b => b.status === 'COMPLETED').length}</p>
            <p className="text-xs text-gray-500">Completed</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
            <p className="text-2xl font-bold text-indigo-600">{posts.length}</p>
            <p className="text-xs text-gray-500">Posts</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">{stories.filter(s => !s.expired).length}</p>
            <p className="text-xs text-gray-500">Active Stories</p>
          </div>
        </div>

        {/* Stories Section - CLICKABLE */}
        {stories.length > 0 && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-gray-900">📸 My Stories</h2>
              <span className="text-xs text-gray-400">(Expire in 24 hours)</span>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {stories.map((story, index) => (
                <div key={story.id} className="relative flex-shrink-0 w-24 cursor-pointer" onClick={() => handleViewStory(index)}>
                  <div className="w-24 h-24 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 p-0.5 hover:scale-105 transition-transform">
                    <div className="w-full h-full rounded-xl bg-white p-0.5 overflow-hidden">
                      {story.type === 'VIDEO' ? (
                        <div className="w-full h-full rounded-xl bg-gray-900 flex items-center justify-center text-white text-2xl">
                          ▶️
                        </div>
                      ) : (
                        <img 
                          src={story.mediaUrl || 'https://via.placeholder.com/96'} 
                          alt={story.caption || 'Story'} 
                          className="w-full h-full rounded-xl object-cover"
                          onError={(e) => e.target.src = 'https://via.placeholder.com/96'}
                        />
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 text-center truncate mt-1">{story.caption || 'Story'}</p>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteStory(story.id); }}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Posts Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold text-gray-900">📰 My Posts</h2>
            <button
              onClick={() => setShowPostModal(true)}
              className="text-sm text-indigo-600 hover:text-indigo-700"
            >
              + Create Post
            </button>
          </div>
          
          {posts.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <p className="text-gray-500">You haven't created any posts yet.</p>
              <button
                onClick={() => setShowPostModal(true)}
                className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm"
              >
                Create Your First Post
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{getPostTypeIcon(post.type)}</span>
                        <span className="text-xs font-medium text-gray-500">{getPostTypeLabel(post.type)}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">{post.title}</h3>
                      <p className="text-gray-700 mt-1 whitespace-pre-wrap">{post.description}</p>
                      
                      {/* Images */}
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
                                className="w-full h-full object-cover"
                                onError={(e) => e.target.src = 'https://via.placeholder.com/400x225?text=Image'}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Video */}
                      {post.videoUrl && (
                        <div className="mt-3 rounded-lg overflow-hidden aspect-video">
                          <video src={post.videoUrl} controls className="w-full h-full object-cover" />
                        </div>
                      )}
                      
                      {/* Document/File */}
                      {post.fileUrl && (
                        <div className="mt-3 p-3 bg-gray-100 rounded-lg flex items-center gap-3">
                          <span className="text-2xl">📄</span>
                          <div>
                            <p className="text-sm font-medium text-gray-700">{post.fileName || 'Document'}</p>
                            <a 
                              href={post.fileUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-indigo-600 hover:text-indigo-700"
                            >
                              View Document
                            </a>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                        <span>❤️ {post.likes || 0}</span>
                        <span>💬 {post.comments?.length || 0}</span>
                        <span>👁️ {post.views || 0}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(post)}
                        className="text-blue-500 hover:text-blue-700 text-sm"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bookings Section */}
        <h2 className="text-xl font-bold text-gray-900 mb-4">📥 Booking Requests</h2>
        {bookings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <p className="text-gray-500 text-lg">📭 No booking requests yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex flex-wrap justify-between items-start gap-4">
                  <div>
                    <p className="font-medium text-gray-900">Booking #{booking.id}</p>
                    <p className="text-sm text-gray-500">Customer: {booking.customerName || 'N/A'}</p>
                    <p className="text-sm text-gray-500">Service: {booking.service || 'General'}</p>
                    <p className="text-sm text-gray-500">Date: {new Date(booking.createdAt).toLocaleDateString()}</p>
                    <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                      booking.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                      booking.status === 'ACCEPTED' ? 'bg-blue-100 text-blue-800' :
                      booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                  {booking.status === 'PENDING' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleBookingStatus(booking.id, 'ACCEPTED')}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleBookingStatus(booking.id, 'REJECTED')}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                  {booking.status === 'ACCEPTED' && (
                    <button
                      onClick={() => handleBookingStatus(booking.id, 'COMPLETED')}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm"
                    >
                      Mark Complete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <button
            onClick={() => setShowPostModal(true)}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center hover:shadow-md transition group"
          >
            <span className="text-3xl block mb-2">📝</span>
            <p className="text-gray-700 font-medium group-hover:text-indigo-600 transition">Create Post</p>
          </button>
          <button
            onClick={() => setShowStoryModal(true)}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center hover:shadow-md transition group"
          >
            <span className="text-3xl block mb-2">📸</span>
            <p className="text-gray-700 font-medium group-hover:text-purple-600 transition">Add Story</p>
          </button>
          <button
            onClick={() => navigate('/contractor-registration')}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center hover:shadow-md transition group"
          >
            <span className="text-3xl block mb-2">⚙️</span>
            <p className="text-gray-700 font-medium group-hover:text-indigo-600 transition">Profile Settings</p>
          </button>
          <button
            onClick={handleSwitchToCustomer}
            className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl shadow-sm border border-indigo-200 p-4 text-center hover:shadow-md transition group"
          >
            <span className="text-3xl block mb-2">🔄</span>
            <p className="text-gray-700 font-medium group-hover:text-indigo-600 transition">Switch to Customer</p>
          </button>
        </div>
      </div>

      {/* ===== CREATE POST MODAL ===== */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white z-10 p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">📝 Create Post</h2>
              <button 
                onClick={() => setShowPostModal(false)} 
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Post Type</label>
                <select
                  name="type"
                  value={postForm.type}
                  onChange={handlePostFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="PROJECT_SHOWCASE">🔨 Project Showcase</option>
                  <option value="ACHIEVEMENT">🎉 Achievement</option>
                  <option value="EDUCATIONAL">📚 Educational</option>
                  <option value="OFFER">🔥 Offer</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="title"
                  value={postForm.title}
                  onChange={handlePostFormChange}
                  placeholder="Enter post title..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description <span className="text-red-500">*</span></label>
                <textarea
                  name="description"
                  value={postForm.description}
                  onChange={handlePostFormChange}
                  rows="4"
                  placeholder="Describe your post..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Images</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePostImageUpload}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                {postForm.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {postForm.images.map((img, index) => (
                      <div key={index} className="relative aspect-video w-24">
                        <img src={img} alt={`Upload ${index}`} className="w-24 h-16 object-cover rounded-lg" />
                        <button
                          type="button"
                          onClick={() => removePostImage(index)}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Video URL</label>
                <input
                  type="url"
                  name="videoUrl"
                  value={postForm.videoUrl}
                  onChange={handlePostFormChange}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Attach Document (PDF, PPT, DOC)</label>
                <input
                  type="file"
                  accept=".pdf,.ppt,.pptx,.doc,.docx,.xls,.xlsx,.txt"
                  onChange={handlePostFileUpload}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                {postForm.fileName && (
                  <p className="text-sm text-gray-600 mt-1">📎 {postForm.fileName}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={postForm.location}
                    onChange={handlePostFormChange}
                    placeholder="e.g., Chennai"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Budget (₹)</label>
                  <input
                    type="number"
                    name="budget"
                    value={postForm.budget}
                    onChange={handlePostFormChange}
                    placeholder="e.g., 5000"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={postLoading}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  {postLoading ? 'Creating...' : '📤 Create Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== EDIT POST MODAL ===== */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white z-10 p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">✏️ Edit Post</h2>
              <button 
                onClick={() => { setShowEditModal(false); resetPostForm(); setEditingPost(null); }} 
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditPost} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Post Type</label>
                <select
                  name="type"
                  value={postForm.type}
                  onChange={handlePostFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="PROJECT_SHOWCASE">🔨 Project Showcase</option>
                  <option value="ACHIEVEMENT">🎉 Achievement</option>
                  <option value="EDUCATIONAL">📚 Educational</option>
                  <option value="OFFER">🔥 Offer</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="title"
                  value={postForm.title}
                  onChange={handlePostFormChange}
                  placeholder="Enter post title..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description <span className="text-red-500">*</span></label>
                <textarea
                  name="description"
                  value={postForm.description}
                  onChange={handlePostFormChange}
                  rows="4"
                  placeholder="Describe your post..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Images</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePostImageUpload}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                {postForm.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {postForm.images.map((img, index) => (
                      <div key={index} className="relative aspect-video w-24">
                        <img src={img} alt={`Upload ${index}`} className="w-24 h-16 object-cover rounded-lg" />
                        <button
                          type="button"
                          onClick={() => removePostImage(index)}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Video URL</label>
                <input
                  type="url"
                  name="videoUrl"
                  value={postForm.videoUrl}
                  onChange={handlePostFormChange}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Attach Document (PDF, PPT, DOC)</label>
                <input
                  type="file"
                  accept=".pdf,.ppt,.pptx,.doc,.docx,.xls,.xlsx,.txt"
                  onChange={handlePostFileUpload}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                {postForm.fileName && (
                  <p className="text-sm text-gray-600 mt-1">📎 {postForm.fileName}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={postForm.location}
                    onChange={handlePostFormChange}
                    placeholder="e.g., Chennai"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Budget (₹)</label>
                  <input
                    type="number"
                    name="budget"
                    value={postForm.budget}
                    onChange={handlePostFormChange}
                    placeholder="e.g., 5000"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => { setShowEditModal(false); resetPostForm(); setEditingPost(null); }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={postLoading}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  {postLoading ? 'Updating...' : '💾 Update Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== CREATE STORY MODAL ===== */}
      {showStoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full mx-4">
            <div className="sticky top-0 bg-white z-10 p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">📸 Add Story</h2>
              <button 
                onClick={() => setShowStoryModal(false)} 
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateStory} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Image/Video <span className="text-red-500">*</span></label>
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleStoryFileUpload}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
                {storyForm.mediaUrl && (
                  <div className="mt-2">
                    {storyForm.type === 'VIDEO' ? (
                      <video src={storyForm.mediaUrl} className="w-full h-40 object-cover rounded-lg" controls />
                    ) : (
                      <img src={storyForm.mediaUrl} alt="Story preview" className="w-full h-40 object-cover rounded-lg" />
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Caption</label>
                <input
                  type="text"
                  name="caption"
                  value={storyForm.caption}
                  onChange={handleStoryFormChange}
                  placeholder="Add a caption..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowStoryModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={storyLoading}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
                >
                  {storyLoading ? 'Creating...' : '📸 Add Story'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== STORY VIEWER ===== */}
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
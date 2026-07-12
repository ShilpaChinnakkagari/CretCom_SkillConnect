import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    views: 0,
    searches: 0,
    bookings: 0,
    revenue: 0,
    followers: 0,
    rating: 0,
    posts: 0,
    stories: 0,
    profileCompleteness: 0,
    responseRate: 0,
    completionRate: 0
  });
  const [weeklyData, setWeeklyData] = useState([
    { day: 'Mon', views: 0, bookings: 0 },
    { day: 'Tue', views: 0, bookings: 0 },
    { day: 'Wed', views: 0, bookings: 0 },
    { day: 'Thu', views: 0, bookings: 0 },
    { day: 'Fri', views: 0, bookings: 0 },
    { day: 'Sat', views: 0, bookings: 0 },
    { day: 'Sun', views: 0, bookings: 0 },
  ]);
  const [categoryData, setCategoryData] = useState([
    { name: 'Electrician', value: 45 },
    { name: 'Plumbing', value: 30 },
    { name: 'Interior', value: 25 },
  ]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const userStr = localStorage.getItem('user');
      const userData = userStr ? JSON.parse(userStr) : null;
      const userId = userData?.id || userData?.userId;

      // Fetch profile stats
      const profileRes = await axios.get(`http://localhost:8080/contractor/profile`, {
        params: { userId: userId },
        withCredentials: true
      });
      const profile = profileRes.data;

      // Fetch posts
      const postsRes = await axios.get(`http://localhost:8080/posts/contractor/${userId}`, {
        withCredentials: true
      });
      const posts = postsRes.data || [];

      // Fetch bookings
      const bookingsRes = await axios.get('http://localhost:8080/bookings/contractor', {
        withCredentials: true
      });
      const bookings = bookingsRes.data || [];

      // Calculate stats
      const totalViews = posts.reduce((sum, p) => sum + (p.views || 0), 0);
      const totalLikes = posts.reduce((sum, p) => sum + (p.likes || 0), 0);
      const totalComments = posts.reduce((sum, p) => sum + (p.comments?.length || 0), 0);
      
      const completedBookings = bookings.filter(b => b.status === 'COMPLETED').length;
      const totalBookings = bookings.length;
      const completionRate = totalBookings > 0 ? Math.round((completedBookings / totalBookings) * 100) : 0;

      // Calculate weekly views (simulated)
      const weeklyViews = weeklyData.map((day, index) => ({
        ...day,
        views: Math.floor(Math.random() * 50) + 10,
        bookings: Math.floor(Math.random() * 5) + 1
      }));
      setWeeklyData(weeklyViews);

      setStats({
        views: profile.totalViews || totalViews || 0,
        searches: Math.floor(Math.random() * 1000) + 500,
        bookings: totalBookings || 0,
        revenue: profile.totalEarnings || 0,
        followers: profile.followersCount || 0,
        rating: profile.averageRating || 0,
        posts: posts.length || 0,
        stories: profile.totalStories || 0,
        profileCompleteness: profile.registrationComplete ? 100 : 80,
        responseRate: profile.responseTimeHours ? 98 : 85,
        completionRate: completionRate,
        likes: totalLikes,
        comments: totalComments
      });

    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const maxViews = Math.max(...weeklyData.map(d => d.views), 1);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      
      {/* ===== STATS GRID ===== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-xl p-4" style={{ background: '#161B22', border: '1px solid #30363D' }}>
          <p className="text-2xl font-bold text-blue-400">{stats.views}</p>
          <p className="text-xs text-gray-400">👁️ Profile Views</p>
        </div>
        <div className="rounded-xl p-4" style={{ background: '#161B22', border: '1px solid #30363D' }}>
          <p className="text-2xl font-bold text-green-400">{stats.bookings}</p>
          <p className="text-xs text-gray-400">📅 Bookings</p>
        </div>
        <div className="rounded-xl p-4" style={{ background: '#161B22', border: '1px solid #30363D' }}>
          <p className="text-2xl font-bold text-yellow-400">₹{stats.revenue.toLocaleString()}</p>
          <p className="text-xs text-gray-400">💰 Revenue</p>
        </div>
        <div className="rounded-xl p-4" style={{ background: '#161B22', border: '1px solid #30363D' }}>
          <p className="text-2xl font-bold text-purple-400">{stats.followers}</p>
          <p className="text-xs text-gray-400">👥 Followers</p>
        </div>
      </div>

      {/* ===== SECONDARY STATS ===== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-xl p-3 text-center" style={{ background: '#161B22', border: '1px solid #30363D' }}>
          <p className="text-lg font-bold text-white">{stats.posts}</p>
          <p className="text-xs text-gray-400">📰 Posts</p>
        </div>
        <div className="rounded-xl p-3 text-center" style={{ background: '#161B22', border: '1px solid #30363D' }}>
          <p className="text-lg font-bold text-white">{stats.stories}</p>
          <p className="text-xs text-gray-400">📸 Stories</p>
        </div>
        <div className="rounded-xl p-3 text-center" style={{ background: '#161B22', border: '1px solid #30363D' }}>
          <p className="text-lg font-bold text-white">{stats.likes || 0}</p>
          <p className="text-xs text-gray-400">❤️ Likes</p>
        </div>
        <div className="rounded-xl p-3 text-center" style={{ background: '#161B22', border: '1px solid #30363D' }}>
          <p className="text-lg font-bold text-white">{stats.comments || 0}</p>
          <p className="text-xs text-gray-400">💬 Comments</p>
        </div>
      </div>

      {/* ===== PERFORMANCE METRICS ===== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-xl p-3 text-center" style={{ background: '#161B22', border: '1px solid #30363D' }}>
          <p className="text-lg font-bold text-green-400">{stats.responseRate}%</p>
          <p className="text-xs text-gray-400">⚡ Response Rate</p>
        </div>
        <div className="rounded-xl p-3 text-center" style={{ background: '#161B22', border: '1px solid #30363D' }}>
          <p className="text-lg font-bold text-blue-400">{stats.completionRate}%</p>
          <p className="text-xs text-gray-400">🎯 Completion Rate</p>
        </div>
        <div className="rounded-xl p-3 text-center" style={{ background: '#161B22', border: '1px solid #30363D' }}>
          <p className="text-lg font-bold text-yellow-400">{stats.rating.toFixed(1)}</p>
          <p className="text-xs text-gray-400">⭐ Rating</p>
        </div>
        <div className="rounded-xl p-3 text-center" style={{ background: '#161B22', border: '1px solid #30363D' }}>
          <p className="text-lg font-bold text-purple-400">{stats.profileCompleteness}%</p>
          <p className="text-xs text-gray-400">📋 Profile Complete</p>
        </div>
      </div>

      {/* ===== WEEKLY CHART ===== */}
      <div className="rounded-xl p-4" style={{ background: '#161B22', border: '1px solid #30363D' }}>
        <h4 className="text-sm font-medium text-gray-400 mb-4">📊 Weekly Overview</h4>
        <div className="flex items-end justify-between h-40 gap-2">
          {weeklyData.map((day, index) => {
            const height = Math.max(10, (day.views / maxViews) * 100);
            const bookingsHeight = Math.max(5, (day.bookings / 10) * 40);
            
            return (
              <div key={index} className="flex-1 flex flex-col items-center gap-1">
                <div className="relative w-full flex justify-center gap-1">
                  {/* Views Bar */}
                  <div 
                    className="w-1/2 bg-blue-500 rounded-t transition-all duration-500"
                    style={{ height: `${height}%`, minHeight: '4px', maxHeight: '120px' }}
                  ></div>
                  {/* Bookings Bar */}
                  <div 
                    className="w-1/2 bg-green-500 rounded-t transition-all duration-500"
                    style={{ height: `${bookingsHeight}%`, minHeight: '4px', maxHeight: '80px' }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500">{day.day}</span>
              </div>
            );
          })}
        </div>
        <div className="flex justify-center gap-4 mt-3 text-xs">
          <span className="flex items-center gap-1 text-gray-400">
            <span className="w-3 h-3 bg-blue-500 rounded-sm"></span> Views
          </span>
          <span className="flex items-center gap-1 text-gray-400">
            <span className="w-3 h-3 bg-green-500 rounded-sm"></span> Bookings
          </span>
        </div>
      </div>

      {/* ===== CATEGORY DISTRIBUTION ===== */}
      <div className="rounded-xl p-4" style={{ background: '#161B22', border: '1px solid #30363D' }}>
        <h4 className="text-sm font-medium text-gray-400 mb-4">🔧 Service Categories</h4>
        <div className="space-y-3">
          {categoryData.map((cat, index) => (
            <div key={index}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-300">{cat.name}</span>
                <span className="text-gray-400">{cat.value}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${cat.value}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
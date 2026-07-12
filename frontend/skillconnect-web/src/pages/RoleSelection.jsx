import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import LanguageSwitcher from '../components/LanguageSwitcher';

axios.defaults.withCredentials = true;

const RoleSelection = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const stars = Array.from({ length: 200 }, (_, i) => ({
    id: i,
    size: Math.random() * 3 + 0.5,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: 3 + Math.random() * 5,
    delay: Math.random() * 6,
    opacity: 0.3 + Math.random() * 0.7,
    isShining: Math.random() > 0.6,
    shineDuration: 3 + Math.random() * 4,
    shineDelay: Math.random() * 5,
  }));

  // ===== ✅ FIXED: Don't redirect if userType is null =====
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const parsed = JSON.parse(userStr);
      setUser(parsed);

      // ✅ Only redirect if userType is already set (existing user)
      if (parsed.userType && parsed.userType !== '' && parsed.userType !== null && parsed.userType !== 'null') {
        if (parsed.userType === 'CONTRACTOR') {
          navigate('/contractor-dashboard', { replace: true });
        } else if (parsed.userType === 'ADMIN') {
          navigate('/admin-dashboard', { replace: true });
        } else {
          navigate('/customer-dashboard', { replace: true });
        }
      }
      // ✅ If userType is null/empty, STAY on RoleSelection page
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleRoleSelect = async (role) => {
    setSelectedRole(role);
    setLoading(true);

    try {
      const response = await axios.put(
        'http://localhost:8080/auth/users/role',
        { userType: role },
        { withCredentials: true }
      );

      console.log('Role update response:', response.data);

      const userStr = localStorage.getItem('user');
      if (userStr) {
        const userData = JSON.parse(userStr);
        userData.userType = role;
        userData.role = role;
        localStorage.setItem('user', JSON.stringify(userData));
      }

      toast.success(`Welcome, ${role === 'CONTRACTOR' ? 'Contractor' : 'Customer'}!`);

      if (role === 'CONTRACTOR') {
        navigate('/contractor-registration', { replace: true });
      } else if (role === 'CUSTOMER') {
        navigate('/customer-dashboard', { replace: true });
      } else if (role === 'ADMIN') {
        navigate('/admin-dashboard', { replace: true });
      }

    } catch (error) {
      console.error('Role update error:', error);
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error('Session expired. Please login again.');
        localStorage.removeItem('user');
        navigate('/login');
      } else {
        toast.error(error.response?.data?.message || 'Failed to update role');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a12] px-4 relative overflow-hidden">

      {/* ===== BACKGROUND STARS ===== */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {stars.map((star) => (
          <div
            key={star.id}
            className={`absolute rounded-full ${
              star.isShining ? 'star-shining' : 'star-float'
            }`}
            style={{
              width: `${star.size}px`,
              height: `${star.size}px`,
              top: `${star.y}%`,
              left: `${star.x}%`,
              background: star.isShining 
                ? 'radial-gradient(circle, rgba(255,255,255,1), rgba(255,255,255,0.5))'
                : 'white',
              opacity: star.opacity,
              boxShadow: star.isShining 
                ? `0 0 ${star.size * 6}px rgba(255,255,255,0.8), 0 0 ${star.size * 12}px rgba(255,255,255,0.4)`
                : `0 0 ${star.size * 2}px rgba(255,255,255,${star.opacity * 0.15})`,
              '--duration': `${star.duration}s`,
              '--delay': `${star.delay}s`,
              '--shine-duration': `${star.shineDuration}s`,
              '--shine-delay': `${star.shineDelay}s`,
            }}
          />
        ))}
      </div>

      {/* ===== GLOW ORB BACKGROUND ===== */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="max-w-5xl w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-2xl shadow-2xl shadow-indigo-500/30">
              C
            </div>
            <div>
              <span className="text-2xl font-bold text-white">CretCom</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent ml-2">SkillConnect</span>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome to <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">SkillConnect</span>
          </h1>
          <p className="text-gray-400 text-lg">
            {user?.name || 'User'}, how would you like to use SkillConnect?
          </p>
          <p className="text-sm text-gray-500 mt-1">Choose your role to get started</p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Customer Card */}
          <div
            onClick={() => !loading && handleRoleSelect('CUSTOMER')}
            className={`group relative overflow-hidden rounded-2xl p-8 text-center cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] ${
              selectedRole === 'CUSTOMER' ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-[#0a0a12]' : ''
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            style={{
              background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.12), rgba(255, 165, 0, 0.08), rgba(255, 20, 147, 0.06))',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 8px 40px rgba(0,0,0,0.3), inset 0 0 60px rgba(255,255,255,0.02)',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/0 via-orange-500/10 to-yellow-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-500/20 via-orange-500/20 to-yellow-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
            
            <div className="relative z-10">
              <div className="text-6xl mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 block">
                👤
              </div>
              <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-pink-400 group-hover:via-orange-400 group-hover:to-yellow-400 group-hover:bg-clip-text transition-all duration-500">
                Customer
              </h2>
              <p className="text-gray-400 text-sm mb-4">
                Find and book trusted service providers in your area
              </p>
              <ul className="text-sm text-gray-400 text-left space-y-2 max-w-xs mx-auto">
                <li className="flex items-center gap-2 group-hover:text-gray-300 transition-colors">
                  <span className="text-pink-400">🔍</span> Search for professionals
                </li>
                <li className="flex items-center gap-2 group-hover:text-gray-300 transition-colors">
                  <span className="text-orange-400">📅</span> Book services easily
                </li>
                <li className="flex items-center gap-2 group-hover:text-gray-300 transition-colors">
                  <span className="text-yellow-400">⭐</span> Rate and review providers
                </li>
                <li className="flex items-center gap-2 group-hover:text-gray-300 transition-colors">
                  <span className="text-red-400">❤️</span> Save your favorites
                </li>
              </ul>
              <button
                className={`mt-6 px-8 py-3 rounded-xl text-white font-medium transition-all duration-300 ${
                  selectedRole === 'CUSTOMER'
                    ? 'bg-gradient-to-r from-pink-500 via-orange-500 to-yellow-500 shadow-xl shadow-orange-500/25'
                    : 'bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10'
                }`}
                disabled={loading}
              >
                Continue as Customer
              </button>
            </div>
          </div>

          {/* Contractor Card */}
          <div
            onClick={() => !loading && handleRoleSelect('CONTRACTOR')}
            className={`group relative overflow-hidden rounded-2xl p-8 text-center cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] ${
              selectedRole === 'CONTRACTOR' ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-[#0a0a12]' : ''
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            style={{
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(139, 92, 246, 0.08), rgba(6, 182, 212, 0.06))',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 8px 40px rgba(0,0,0,0.3), inset 0 0 60px rgba(255,255,255,0.02)',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-violet-500/10 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-violet-500/20 to-cyan-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
            
            <div className="relative z-10">
              <div className="text-6xl mb-4 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 block">
                🔧
              </div>
              <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:via-violet-400 group-hover:to-cyan-400 group-hover:bg-clip-text transition-all duration-500">
                Contractor
              </h2>
              <p className="text-gray-400 text-sm mb-4">
                Offer your services and grow your business
              </p>
              <ul className="text-sm text-gray-400 text-left space-y-2 max-w-xs mx-auto">
                <li className="flex items-center gap-2 group-hover:text-gray-300 transition-colors">
                  <span className="text-blue-400">📋</span> Create your professional profile
                </li>
                <li className="flex items-center gap-2 group-hover:text-gray-300 transition-colors">
                  <span className="text-violet-400">📸</span> Showcase your portfolio
                </li>
                <li className="flex items-center gap-2 group-hover:text-gray-300 transition-colors">
                  <span className="text-purple-400">📩</span> Receive booking requests
                </li>
                <li className="flex items-center gap-2 group-hover:text-gray-300 transition-colors">
                  <span className="text-cyan-400">💰</span> Manage your earnings
                </li>
              </ul>
              <button
                className={`mt-6 px-8 py-3 rounded-xl text-white font-medium transition-all duration-300 ${
                  selectedRole === 'CONTRACTOR'
                    ? 'bg-gradient-to-r from-blue-500 via-violet-500 to-cyan-500 shadow-xl shadow-violet-500/25'
                    : 'bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10'
                }`}
                disabled={loading}
              >
                Continue as Contractor
              </button>
            </div>
          </div>
        </div>

        {loading && (
          <div className="mt-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-400"></div>
            <p className="text-gray-400 mt-2">Setting up your account...</p>
          </div>
        )}

        <div className="text-center mt-8">
          <p className="text-xs text-gray-500">
            Already have an account? <span className="text-indigo-400 hover:text-indigo-300 cursor-pointer">Sign in</span>
          </p>
        </div>
      </div>

      <LanguageSwitcher />

      <style>{`
        @keyframes starFloat {
          0% { transform: translate(0, 0) scale(1); opacity: 0.3; }
          25% { transform: translate(10px, -20px) scale(1.2); opacity: 0.8; }
          50% { transform: translate(-5px, 10px) scale(0.8); opacity: 0.5; }
          75% { transform: translate(15px, 5px) scale(1.1); opacity: 0.9; }
          100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
        }
        .star-float {
          animation: starFloat var(--duration) ease-in-out infinite;
          animation-delay: var(--delay);
          will-change: transform, opacity;
        }

        @keyframes starShine {
          0% { transform: scale(1) rotate(0deg); opacity: 0.3; }
          25% { transform: scale(1.8) rotate(45deg); opacity: 1; }
          50% { transform: scale(0.7) rotate(90deg); opacity: 0.5; }
          75% { transform: scale(2) rotate(135deg); opacity: 0.9; }
          100% { transform: scale(1) rotate(180deg); opacity: 0.3; }
        }
        .star-shining {
          animation: starShine var(--shine-duration) ease-in-out infinite;
          animation-delay: var(--shine-delay);
          will-change: transform, opacity;
        }
      `}</style>
    </div>
  );
};

export default RoleSelection;
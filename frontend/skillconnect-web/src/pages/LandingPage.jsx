import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const [isDark, setIsDark] = useState(true);
  const [categoryStartIndex, setCategoryStartIndex] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef(null);
  const [isMarqueePaused, setIsMarqueePaused] = useState(false);

  const allCategories = [
    { id: 1, name: 'Construction', icon: '🔨', color: 'from-orange-400/20 via-red-400/20 to-pink-400/20' },
    { id: 2, name: 'Beauty & Personal Care', icon: '💄', color: 'from-pink-400/20 via-rose-400/20 to-fuchsia-400/20' },
    { id: 3, name: 'Stitching & Fashion', icon: '👗', color: 'from-purple-400/20 via-violet-400/20 to-indigo-400/20' },
    { id: 4, name: 'Events', icon: '🎉', color: 'from-yellow-400/20 via-amber-400/20 to-orange-400/20' },
    { id: 5, name: 'Property', icon: '🏠', color: 'from-blue-400/20 via-cyan-400/20 to-teal-400/20' },
    { id: 6, name: 'Education', icon: '📚', color: 'from-green-400/20 via-emerald-400/20 to-teal-400/20' },
    { id: 7, name: 'Health & Wellness', icon: '💪', color: 'from-red-400/20 via-orange-400/20 to-amber-400/20' },
    { id: 8, name: 'Technology', icon: '💻', color: 'from-indigo-400/20 via-blue-400/20 to-cyan-400/20' },
    { id: 9, name: 'Home Services', icon: '🔧', color: 'from-teal-400/20 via-cyan-400/20 to-blue-400/20' },
    { id: 10, name: 'Business Services', icon: '📊', color: 'from-slate-400/20 via-gray-400/20 to-zinc-400/20' },
    { id: 11, name: 'Pet Services', icon: '🐾', color: 'from-amber-400/20 via-yellow-400/20 to-orange-400/20' },
    { id: 12, name: 'Art & Hobby Trainer', icon: '🎨', color: 'from-violet-400/20 via-purple-400/20 to-fuchsia-400/20' },
    { id: 13, name: 'Food Services', icon: '🍽️', color: 'from-orange-400/20 via-amber-400/20 to-yellow-400/20' },
    { id: 14, name: 'Appliance Service', icon: '🔌', color: 'from-blue-400/20 via-indigo-400/20 to-purple-400/20' },
    { id: 15, name: 'Others', icon: '📌', color: 'from-gray-400/20 via-slate-400/20 to-zinc-400/20' },
  ];

  const marqueeCategories = [...allCategories, ...allCategories, ...allCategories];

  const features = [
    { title: 'Verified Professionals', desc: 'All experts are verified through rigorous screening', color: 'from-indigo-400/20 via-purple-400/20 to-pink-400/20' },
    { title: 'Secure Payments', desc: '100% secure transactions with buyer protection', color: 'from-green-400/20 via-emerald-400/20 to-teal-400/20' },
    { title: 'Real Reviews', desc: 'Genuine reviews from real customers', color: 'from-blue-400/20 via-cyan-400/20 to-sky-400/20' },
    { title: 'Easy Booking', desc: 'Book services in just a few clicks', color: 'from-orange-400/20 via-amber-400/20 to-yellow-400/20' },
    { title: '24/7 Support', desc: 'Round the clock customer support', color: 'from-red-400/20 via-rose-400/20 to-pink-400/20' },
    { title: 'Best Prices', desc: 'Competitive pricing with no hidden charges', color: 'from-purple-400/20 via-violet-400/20 to-indigo-400/20' },
  ];

  const cities = [
    { name: 'Chennai', icon: '🌊', color: 'from-blue-400/20 via-cyan-400/20 to-sky-400/20' },
    { name: 'Bengaluru', icon: '🌆', color: 'from-purple-400/20 via-pink-400/20 to-rose-400/20' },
    { name: 'Mumbai', icon: '🌉', color: 'from-orange-400/20 via-red-400/20 to-rose-400/20' },
    { name: 'Delhi', icon: '🏛️', color: 'from-green-400/20 via-emerald-400/20 to-teal-400/20' },
    { name: 'Hyderabad', icon: '🌺', color: 'from-rose-400/20 via-pink-400/20 to-fuchsia-400/20' },
    { name: 'Pune', icon: '⛰️', color: 'from-indigo-400/20 via-blue-400/20 to-cyan-400/20' },
    { name: 'Kolkata', icon: '🚃', color: 'from-amber-400/20 via-yellow-400/20 to-orange-400/20' },
    { name: 'Ahmedabad', icon: '🏙️', color: 'from-teal-400/20 via-cyan-400/20 to-blue-400/20' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const scrollTop = containerRef.current.scrollTop;
      const sectionHeight = window.innerHeight;
      const current = Math.round(scrollTop / sectionHeight);
      setCurrentSection(current);
      
      const sectionScroll = (scrollTop % sectionHeight) / sectionHeight;
      setScrollProgress(sectionScroll);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const toggleTheme = () => setIsDark(!isDark);

  const bg = isDark ? 'bg-[#0a0a12]' : 'bg-[#f0f2f5]';
  const text = isDark ? 'text-white' : 'text-[#0a0a12]';
  const muted = isDark ? 'text-gray-400' : 'text-gray-600';
  const glass = isDark ? 'bg-white/5 backdrop-blur-xl border-white/10' : 'bg-black/5 backdrop-blur-xl border-black/10';

  const visibleCategories = allCategories.slice(categoryStartIndex, categoryStartIndex + 8);
  const canScrollLeft = categoryStartIndex > 0;
  const canScrollRight = categoryStartIndex + 8 < allCategories.length;

  const scrollCategories = (direction) => {
    if (direction === 'left' && canScrollLeft) {
      setCategoryStartIndex(prev => Math.max(0, prev - 4));
    } else if (direction === 'right' && canScrollRight) {
      setCategoryStartIndex(prev => Math.min(allCategories.length - 8, prev + 4));
    }
  };

  const Divider = ({ isActive }) => {
    const progress = isActive ? scrollProgress : 0;
    const bulge = progress * 50;
    
    return (
      <div className="absolute -bottom-1 left-0 right-0 z-20 pointer-events-none" style={{ height: '100px' }}>
        <svg 
          viewBox="0 0 1440 150" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className="w-full h-full"
        >
          <path 
            d={`M0 150 
                C${360 - bulge * 0.3} 150, 
                ${480 - bulge * 0.2} ${50 - bulge * 0.3}, 
                720 ${30 - bulge * 0.2}
                C${960 + bulge * 0.2} ${50 - bulge * 0.3}, 
                ${1080 + bulge * 0.3} 150, 
                1440 150 
                L1440 150 L0 150 Z`}
            fill={isDark ? '#0a0a12' : '#f0f2f5'} 
            className="transition-colors duration-700"
          />
          
          <path 
            d={`M0 150 
                C${360 - bulge * 0.3} 150, 
                ${480 - bulge * 0.2} ${50 - bulge * 0.3}, 
                720 ${30 - bulge * 0.2}
                C${960 + bulge * 0.2} ${50 - bulge * 0.3}, 
                ${1080 + bulge * 0.3} 150, 
                1440 150 
                L1440 150 L0 150 Z`}
            fill="url(#dividerGlow)"
            opacity="0.1"
          />
          
          <defs>
            <linearGradient id="dividerGlow" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#6366f1"/>
              <stop offset="33%" stopColor="#a855f7"/>
              <stop offset="66%" stopColor="#ec4899"/>
              <stop offset="100%" stopColor="#f59e0b"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  };

  const stars = Array.from({ length: 100 }, (_, i) => ({
    id: i,
    size: Math.random() * 2 + 1,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: 2 + Math.random() * 4,
    delay: Math.random() * 3,
    opacity: 0.2 + Math.random() * 0.5,
  }));

  // Earth hiding: 10% per section
  const hidePercentage = Math.min(currentSection * 10, 50);
  const earthOpacity = 1 - (hidePercentage / 100);
  const earthOffset = hidePercentage * 3;

  // Smooth marquee colors - blended and elegant
  const marqueeColors = [
    'from-blue-400/30 via-cyan-400/30 to-sky-400/30',
    'from-purple-400/30 via-pink-400/30 to-rose-400/30',
    'from-orange-400/30 via-amber-400/30 to-yellow-400/30',
    'from-green-400/30 via-emerald-400/30 to-teal-400/30',
    'from-red-400/30 via-rose-400/30 to-pink-400/30',
    'from-indigo-400/30 via-blue-400/30 to-cyan-400/30',
    'from-amber-400/30 via-yellow-400/30 to-orange-400/30',
    'from-teal-400/30 via-cyan-400/30 to-blue-400/30',
  ];

  return (
    <div className={`${bg} min-h-screen transition-colors duration-700 relative overflow-hidden`}>

      {/* ===== BACKGROUND STARS ===== */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full animate-float"
            style={{
              width: `${star.size}px`,
              height: `${star.size}px`,
              top: `${star.y}%`,
              left: `${star.x}%`,
              animationDuration: `${star.duration * 2}s`,
              animationDelay: `${star.delay}s`,
              background: isDark ? 'white' : 'rgba(0,0,0,0.4)',
              opacity: star.opacity * (isDark ? 1 : 0.5),
            }}
          />
        ))}
      </div>

      {/* ===== EARTH ===== */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div 
          className="absolute"
          style={{
            top: '50%',
            right: `${-80 + earthOffset}px`,
            transform: 'translateY(-50%)',
            width: '550px',
            height: '550px',
            borderRadius: '50%',
            overflow: 'hidden',
            boxShadow: `
              0 0 120px rgba(74, 144, 217, 0.5),
              0 0 250px rgba(74, 144, 217, 0.2),
              0 0 400px rgba(74, 144, 217, 0.1),
              inset 0 -50px 100px rgba(0,0,0,0.4)
            `,
            opacity: earthOpacity,
            transition: 'opacity 0.8s ease, right 0.8s ease',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              animation: 'spinEarth 20s linear infinite',
            }}
          >
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/The_Earth_seen_from_Apollo_17.jpg/1280px-The_Earth_seen_from_Apollo_17.jpg"
              alt="Earth"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: 'scale(1.15)',
              }}
              onError={(e) => {
                e.target.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Blue_Marble_2002.png/1280px-Blue_Marble_2002.png";
              }}
            />
          </div>
          
          <div style={{
            position: 'absolute',
            top: '-15%',
            left: '-15%',
            width: '130%',
            height: '130%',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 30% 30%, rgba(100, 200, 255, 0.08), transparent 60%)',
            pointerEvents: 'none',
          }} />
          
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: `rgba(0,0,0,${hidePercentage / 100})`,
            transition: 'background 0.8s ease',
          }} />
        </div>
      </div>

      {/* ===== THEME TOGGLE - TOP RIGHT ===== */}
      <div className="fixed top-6 right-6 z-50">
        <button
          onClick={toggleTheme}
          className={`w-14 h-14 rounded-2xl shadow-2xl transition-all duration-700 hover:scale-110 hover:rotate-180 flex items-center justify-center text-3xl ${
            isDark
              ? 'bg-gradient-to-br from-yellow-400 to-orange-400 text-gray-900'
              : 'bg-gradient-to-br from-gray-800 to-gray-900 text-yellow-400'
          }`}
        >
          {isDark ? '☀️' : '🌙'}
        </button>
      </div>

      {/* ===== SCROLL CONTAINER ===== */}
      <div ref={containerRef} className="h-screen overflow-y-scroll snap-y snap-mandatory relative z-10 scrollbar-hide">

        {/* ===== SECTION 1: HERO ===== */}
        <section className="h-screen snap-start snap-always relative flex items-center" style={{ paddingBottom: '100px' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
            {/* Nav */}
            <div className="flex justify-between items-center mb-8">
              <Link to="/" className="flex items-center gap-4 group">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-3xl shadow-2xl shadow-indigo-500/20 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                  C
                </div>
                <div>
                  <span className={`text-3xl font-bold ${text}`}>CretCom</span>
                  <span className="text-3xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent ml-2">Skill Connect</span>
                </div>
              </Link>
              <div className="flex items-center gap-6">
                <Link to="/login" className={`${muted} hover:text-indigo-400 transition-all duration-300 font-medium text-lg`}>
                  Sign In
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-3 rounded-2xl bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 text-white font-semibold shadow-2xl shadow-orange-500/25 transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-3xl"
                >
                  Get Started
                </Link>
              </div>
            </div>

            {/* Hero Content */}
            <div className="text-left max-w-3xl" style={{ marginTop: '-20px' }}>
              <div className="inline-flex items-center gap-2 mb-4 px-5 py-2 rounded-full bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-white/10 backdrop-blur-sm">
                <span className="text-sm font-medium text-transparent bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text">✨ Connecting Excellence</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.2] mb-3">
                <span className={text}>Connecting Customer</span>
                <sup className="text-2xl text-orange-400 font-bold align-super">V</sup>
                <span className={`${text} text-sm align-super`}>th</span>
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-violet-400 via-pink-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent animate-gradient">
                  Trusted Local Experts
                </span>
              </h1>

              <p className={`text-xl max-w-2xl mb-5 ${muted} leading-relaxed`}>
                A marketplace where customers can easily discover local professionals and service providers can grow their business by showcasing their skills, portfolios, ratings, and availability.
              </p>

              {/* Search Bar - Smooth blended colors */}
              <div className={`flex flex-col md:flex-row items-center gap-3 p-2 rounded-2xl max-w-2xl transition-all duration-300 hover:scale-[1.01]`}
                style={{
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12), rgba(139, 92, 246, 0.12), rgba(234, 179, 8, 0.12), rgba(251, 146, 60, 0.12))',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 0 40px rgba(99, 102, 241, 0.05)',
                }}
              >
                <div className="flex-1 w-full flex items-center gap-2 px-4 py-2">
                  <span className="text-gray-400">🔍</span>
                  <input
                    type="text"
                    placeholder="Find Service"
                    className={`w-full bg-transparent outline-none ${text} placeholder-gray-500`}
                  />
                </div>
                <div className="hidden md:block text-gray-400 font-bold">AND</div>
                <div className="flex-1 w-full flex items-center gap-2 px-4 py-2">
                  <span className="text-gray-400">📍</span>
                  <input
                    type="text"
                    placeholder="Location"
                    className={`w-full bg-transparent outline-none ${text} placeholder-gray-500`}
                  />
                </div>
                <button className="w-full md:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold hover:scale-105 transition-all duration-300 shadow-xl shadow-purple-500/25">
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* ===== INFINITE MARQUEE - Smooth blended colors ===== */}
          <div className="absolute bottom-0 left-0 right-0 z-30 overflow-hidden border-t border-white/5 py-3" 
               style={{ background: isDark ? 'rgba(10,10,18,0.9)' : 'rgba(240,242,245,0.9)' }}>
            <div 
              className="flex items-center gap-12 whitespace-nowrap animate-marquee"
              style={{ animationPlayState: isMarqueePaused ? 'paused' : 'running' }}
              onMouseEnter={() => setIsMarqueePaused(true)}
              onMouseLeave={() => setIsMarqueePaused(false)}
            >
              {marqueeCategories.map((cat, index) => {
                const colorIndex = index % marqueeColors.length;
                return (
                  <div key={`${cat.id}-${index}`} 
                    className={`flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r ${marqueeColors[colorIndex]} backdrop-blur-sm`}
                    style={{
                      border: '1px solid rgba(255,255,255,0.05)',
                      boxShadow: '0 0 30px rgba(255,255,255,0.02)',
                    }}
                  >
                    <span className="text-3xl">{cat.icon}</span>
                    <span className={`text-sm font-medium ${text}`}>{cat.name}</span>
                    <span className="text-white/20 text-2xl">•</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===== SECTION 2: CATEGORIES ===== */}
        <section className="h-screen snap-start snap-always relative flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="text-center mb-12">
              <h2 className={`text-5xl md:text-6xl font-bold ${text}`}>
                Explore Our <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Feed</span>
              </h2>
              <p className={`${muted} mt-3 text-lg`}>Choose your category and find the perfect expert</p>
            </div>

            <div className="relative">
              <button
                onClick={() => scrollCategories('left')}
                disabled={!canScrollLeft}
                className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  canScrollLeft
                    ? `${glass} hover:bg-white/20 text-white`
                    : 'opacity-30 cursor-not-allowed'
                }`}
              >
                ◀
              </button>

              <div className="overflow-hidden mx-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 transition-all duration-500 ease-in-out">
                  {visibleCategories.map((cat) => (
                    <Link
                      key={cat.id}
                      to="/login"
                      className={`group relative overflow-hidden rounded-2xl p-6 text-center transition-all duration-500 hover:-translate-y-2 hover:scale-105 bg-gradient-to-br ${cat.color} backdrop-blur-sm category-card`}
                      style={{
                        border: '1px solid rgba(255,255,255,0.06)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/5 group-hover:from-white/5 group-hover:via-white/10 group-hover:to-white/20 transition-all duration-500 rounded-2xl" />
                      <div className="relative z-10">
                        <div className="text-5xl mb-3 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 block">
                          {cat.icon}
                        </div>
                        <h3 className={`font-semibold ${text} text-sm md:text-base`}>{cat.name}</h3>
                        <div className="mt-3 w-8 h-0.5 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mx-auto group-hover:w-16 transition-all duration-300" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <button
                onClick={() => scrollCategories('right')}
                disabled={!canScrollRight}
                className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  canScrollRight
                    ? `${glass} hover:bg-white/20 text-white`
                    : 'opacity-30 cursor-not-allowed'
                }`}
              >
                ▶
              </button>
            </div>
          </div>

          <Divider isActive={currentSection === 1} />
        </section>

        {/* ===== SECTION 3: FEATURES ===== */}
        <section className="h-screen snap-start snap-always relative flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="text-center mb-12">
              <h2 className={`text-5xl md:text-6xl font-bold ${text}`}>
                Explore <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Features</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div className="space-y-4">
                {features.slice(0, 3).map((feature, i) => (
                  <div key={i} className="relative">
                    <div className={`bg-gradient-to-br ${feature.color} rounded-2xl p-6 transition-all duration-300 hover:-translate-x-2 backdrop-blur-sm feature-card`}
                      style={{
                        border: '1px solid rgba(255,255,255,0.06)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                      }}
                    >
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-indigo-500/50 to-purple-500/50 rounded-tr-2xl rounded-bl-2xl backdrop-blur-sm" />
                      <h4 className={`font-semibold ${text} mb-1`}>{feature.title}</h4>
                      <p className={`${muted} text-sm`}>{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition-all duration-500" />
                  <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-4 shadow-2xl">
                    <div className="relative">
                      <div className="w-[300px] h-[200px] bg-gradient-to-br from-indigo-900/50 to-purple-900/50 rounded-xl flex items-center justify-center">
                        <img 
                          src="/laptop.jpeg" 
                          alt="Laptop" 
                          className="w-full h-full object-cover rounded-xl"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = '<span class="text-6xl">💻</span>';
                          }}
                        />
                      </div>
                      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-20 h-1 bg-white/20 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {features.slice(3, 6).map((feature, i) => (
                  <div key={i} className="relative">
                    <div className={`bg-gradient-to-br ${feature.color} rounded-2xl p-6 transition-all duration-300 hover:translate-x-2 backdrop-blur-sm feature-card`}
                      style={{
                        border: '1px solid rgba(255,255,255,0.06)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                      }}
                    >
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-pink-500/50 to-orange-500/50 rounded-tr-2xl rounded-bl-2xl backdrop-blur-sm" />
                      <h4 className={`font-semibold ${text} mb-1`}>{feature.title}</h4>
                      <p className={`${muted} text-sm`}>{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Divider isActive={currentSection === 2} />
        </section>

        {/* ===== SECTION 4: CITIES ===== */}
        <section className="h-screen snap-start snap-always relative flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="text-center mb-12">
              <h2 className={`text-5xl md:text-6xl font-bold ${text}`}>
                Cities You Can Find <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Our Services</span>
              </h2>
              <p className={`${muted} mt-3 text-lg`}>Discover local expertise in your city</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {cities.map((city, i) => (
                <div
                  key={i}
                  className={`group relative overflow-hidden rounded-2xl p-8 text-center transition-all duration-500 hover:-translate-y-4 hover:scale-105 bg-gradient-to-br ${city.color} backdrop-blur-sm city-card`}
                  style={{
                    border: '1px solid rgba(255,255,255,0.06)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  }}
                >
                  <div className="relative z-10">
                    <div className="text-5xl mb-3 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 block">
                      {city.icon}
                    </div>
                    <h3 className={`text-xl font-bold ${text}`}>{city.name}</h3>
                    <div className="mt-3 w-12 h-0.5 bg-gradient-to-r from-indigo-400 to-pink-400 mx-auto group-hover:w-20 transition-all duration-300" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Divider isActive={currentSection === 3} />
        </section>

        {/* ===== SECTION 5: FOOTER ===== */}
        <section className="h-screen snap-start snap-always relative flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="text-center mb-12">
              <h2 className={`text-4xl md:text-5xl font-bold ${text}`}>
                Explore the Features of <br />
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  CretCom - SkillConnect
                </span>
              </h2>
              <p className={`${muted} mt-3 text-xl`}>The place where you can meet the local expertise</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">C</div>
                  <div>
                    <span className={`text-xl font-bold ${text}`}>CretCom</span>
                    <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent ml-2">SkillConnect</span>
                  </div>
                </div>
                <p className={`${muted} text-sm`}>Connecting customers with trusted local experts.</p>
              </div>

              <div>
                <h4 className={`font-semibold ${text} mb-4 text-lg`}>Quick Links</h4>
                <ul className="space-y-3 text-sm">
                  <li><Link to="/login" className={`${muted} hover:text-indigo-400 transition-colors`}>Find Services</Link></li>
                  <li><Link to="/login" className={`${muted} hover:text-indigo-400 transition-colors`}>How it Works</Link></li>
                  <li><Link to="/login" className={`${muted} hover:text-indigo-400 transition-colors`}>Become a Provider</Link></li>
                </ul>
              </div>

              <div>
                <h4 className={`font-semibold ${text} mb-4 text-lg`}>Support</h4>
                <ul className="space-y-3 text-sm">
                  <li><Link to="/login" className={`${muted} hover:text-indigo-400 transition-colors`}>Help Center</Link></li>
                  <li><Link to="/login" className={`${muted} hover:text-indigo-400 transition-colors`}>Contact Us</Link></li>
                  <li><Link to="/login" className={`${muted} hover:text-indigo-400 transition-colors`}>FAQs</Link></li>
                </ul>
              </div>

              <div>
                <h4 className={`font-semibold ${text} mb-4 text-lg`}>Connect With Us</h4>
                <div className="flex gap-4">
                  <a href="#" className={`${glass} w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-all duration-300 hover:scale-110 hover:border-indigo-500/30`}>📱</a>
                  <a href="#" className={`${glass} w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-all duration-300 hover:scale-110 hover:border-indigo-500/30`}>🐦</a>
                  <a href="#" className={`${glass} w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-all duration-300 hover:scale-110 hover:border-indigo-500/30`}>📷</a>
                  <a href="#" className={`${glass} w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-all duration-300 hover:scale-110 hover:border-indigo-500/30`}>💼</a>
                </div>
              </div>
            </div>

            <div className={`border-t ${isDark ? 'border-white/5' : 'border-gray-200'} pt-6 text-center text-sm ${muted}`}>
              <p>© 2024 CretCom - SkillConnect. All rights reserved.</p>
            </div>
          </div>
        </section>

      </div>

      <style>{`
        .snap-y {
          scroll-snap-type: y mandatory;
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
        }
        .snap-start { scroll-snap-align: start; }
        .snap-always { scroll-snap-stop: always; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

        @keyframes float {
          0% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(10px, -15px) scale(1.1);
          }
          50% {
            transform: translate(-5px, 10px) scale(0.9);
          }
          75% {
            transform: translate(15px, 5px) scale(1.05);
          }
          100% {
            transform: translate(0, 0) scale(1);
          }
        }
        .animate-float {
          animation: float ease-in-out infinite;
        }

        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease-in-out infinite;
        }

        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
          width: max-content;
        }

        @keyframes spinEarth {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        section {
          transition: all 0.1s ease;
        }

        /* Category Card Glow Effect */
        .category-card {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }
        .category-card::before {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: 1rem;
          background: linear-gradient(135deg, #6366f1, #a855f7, #ec4899, #f59e0b);
          opacity: 0;
          transition: opacity 0.4s ease;
          z-index: -1;
        }
        .category-card:hover::before {
          opacity: 1;
        }
        .category-card:hover {
          transform: translateY(-8px) scale(1.05);
          box-shadow: 
            0 0 30px rgba(99, 102, 241, 0.3),
            0 0 60px rgba(168, 85, 247, 0.2),
            0 0 90px rgba(236, 72, 153, 0.15),
            inset 0 0 30px rgba(255, 255, 255, 0.05);
        }

        /* Feature Card Glow Effect */
        .feature-card {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }
        .feature-card::before {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: 1rem;
          background: linear-gradient(135deg, #8b5cf6, #3b82f6, #06b6d4, #10b981);
          opacity: 0;
          transition: opacity 0.4s ease;
          z-index: -1;
        }
        .feature-card:hover::before {
          opacity: 1;
        }
        .feature-card:hover {
          box-shadow: 
            0 0 30px rgba(139, 92, 246, 0.3),
            0 0 60px rgba(59, 130, 246, 0.2),
            0 0 90px rgba(6, 182, 212, 0.15),
            inset 0 0 30px rgba(255, 255, 255, 0.05);
        }

        /* City Card Glow Effect */
        .city-card {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }
        .city-card::before {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: 1rem;
          background: linear-gradient(135deg, #f59e0b, #ef4444, #ec4899, #8b5cf6);
          opacity: 0;
          transition: opacity 0.4s ease;
          z-index: -1;
        }
        .city-card:hover::before {
          opacity: 1;
        }
        .city-card:hover {
          transform: translateY(-8px) scale(1.05);
          box-shadow: 
            0 0 30px rgba(245, 158, 11, 0.3),
            0 0 60px rgba(239, 68, 68, 0.2),
            0 0 90px rgba(236, 72, 153, 0.15),
            inset 0 0 30px rgba(255, 255, 255, 0.05);
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
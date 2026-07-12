import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const socialPlatforms = ['INSTAGRAM', 'YOUTUBE', 'FACEBOOK', 'LINKEDIN', 'TWITTER', 'WHATSAPP', 'TELEGRAM', 'SNAPCHAT', 'PINTEREST', 'OTHER'];

const Stage4Portfolio = ({ formData, updateFormData, onNext, onBack, loading, setLoading }) => {
  const [newPortfolio, setNewPortfolio] = useState({
    title: '',
    description: '',
    category: 'COMPLETED',
    imageUrls: [],
    videoUrl: '',
    projectLink: '',
    location: '',
    timeTaken: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSocialLink, setNewSocialLink] = useState({ platform: '', url: '' });
  const [showCustomPlatform, setShowCustomPlatform] = useState(false);

  // ===== STARS (SUBTLE) =====
  const stars = Array.from({ length: 150 }, (_, i) => ({
    id: i,
    size: Math.random() * 2 + 0.5,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: 10 + Math.random() * 15,
    delay: Math.random() * 6,
    opacity: 0.2 + Math.random() * 0.4,
    isShining: Math.random() > 0.7,
    shineDuration: 2 + Math.random() * 3,
    shineDelay: Math.random() * 5,
  }));

  const handlePortfolioChange = (e) => {
    const { name, value } = e.target;
    setNewPortfolio(prev => ({ ...prev, [name]: value }));
  };

  const handleAddPortfolio = () => {
    if (!newPortfolio.title || !newPortfolio.imageUrls.length) {
      toast.error('Please add at least a title and image');
      return;
    }
    const updated = [...(formData.portfolio || []), newPortfolio];
    updateFormData({ portfolio: updated });
    setNewPortfolio({
      title: '',
      description: '',
      category: 'COMPLETED',
      imageUrls: [],
      videoUrl: '',
      projectLink: '',
      location: '',
      timeTaken: ''
    });
    setShowAddForm(false);
    toast.success('Portfolio item added!');
  };

  const handleRemovePortfolio = (index) => {
    const updated = formData.portfolio.filter((_, i) => i !== index);
    updateFormData({ portfolio: updated });
  };

  const handleImageUpload = (e) => {
    const files = e.target.files;
    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPortfolio(prev => ({
          ...prev,
          imageUrls: [...prev.imageUrls, reader.result]
        }));
      };
      reader.readAsDataURL(files[i]);
    }
  };

  const handleSocialPlatformChange = (e) => {
    const value = e.target.value;
    setNewSocialLink(prev => ({ ...prev, platform: value }));
    if (value === 'OTHER') {
      setShowCustomPlatform(true);
    } else {
      setShowCustomPlatform(false);
    }
  };

  const handleCustomPlatformChange = (e) => {
    setNewSocialLink(prev => ({ ...prev, platform: e.target.value }));
  };

  const handleSocialUrlChange = (e) => {
    setNewSocialLink(prev => ({ ...prev, url: e.target.value }));
  };

  const handleAddSocialLink = () => {
    if (!newSocialLink.platform || !newSocialLink.url) {
      toast.error('Please select a platform and enter URL');
      return;
    }

    const updated = [...(formData.socialLinks || []), { 
      platform: newSocialLink.platform, 
      url: newSocialLink.url 
    }];
    updateFormData({ socialLinks: updated });
    setNewSocialLink({ platform: '', url: '' });
    setShowCustomPlatform(false);
    toast.success('Social link added!');
  };

  const handleRemoveSocialLink = (index) => {
    const updated = formData.socialLinks.filter((_, i) => i !== index);
    updateFormData({ socialLinks: updated });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const userStr = localStorage.getItem('user');
      const userData = userStr ? JSON.parse(userStr) : null;
      const userId = userData?.id || userData?.userId;

      const stageData = {
        userId: userId,
        stage: 4,
        portfolio: formData.portfolio || [],
        socialLinks: formData.socialLinks || [],
        shopName: formData.shopName,
        shopAddress: formData.shopAddress,
        shopPhotos: formData.shopPhotos || []
      };

      console.log('Saving Stage 4:', stageData);
      const response = await axios.post('http://localhost:8080/contractor/register/stage', stageData, {
        withCredentials: true
      });

      if (response.data.success) {
        toast.success('Portfolio saved!');
        onNext();
      }
    } catch (error) {
      console.error('Error saving stage 4:', error);
      toast.error(error.response?.data?.error || 'Failed to save portfolio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen py-8 px-4 overflow-hidden bg-[#0a0a12]">

      {/* ===== SUBTLE BACKGROUND STARS ===== */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {stars.map((star) => (
          <div
            key={star.id}
            className={`absolute rounded-full ${star.isShining ? 'star-shining' : 'star-float'}`}
            style={{
              width: `${star.size}px`,
              height: `${star.size}px`,
              top: `${star.y}%`,
              left: `${star.x}%`,
              background: 'white',
              opacity: star.opacity,
              boxShadow: star.isShining 
                ? `0 0 ${star.size * 4}px rgba(255,255,255,0.3)`
                : 'none',
              '--duration': `${star.duration}s`,
              '--delay': `${star.delay}s`,
              '--shine-duration': `${star.shineDuration}s`,
              '--shine-delay': `${star.shineDelay}s`,
            }}
          />
        ))}
      </div>

      {/* ===== SUBTLE GLOW ORBS ===== */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 -left-48 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 -right-48 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* ===== INNER CARD ===== */}
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="bg-white rounded-2xl p-10 shadow-2xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Portfolio & Trust</h2>
          <p className="text-gray-500 text-sm mb-6">Show your work and build trust</p>

          <div className="space-y-6">
            {/* Portfolio Section */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium text-gray-700">Portfolio Items</h3>
                <button
                  type="button"
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="text-indigo-600 hover:text-indigo-700 text-sm"
                >
                  {showAddForm ? 'Cancel' : '+ Add Portfolio'}
                </button>
              </div>

              {formData.portfolio?.length > 0 && (
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {formData.portfolio.map((item, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-3 relative">
                      {item.imageUrls?.length > 0 && (
                        <img src={item.imageUrls[0]} alt={item.title} className="w-full h-32 object-cover rounded-lg mb-2" />
                      )}
                      <p className="font-medium text-sm text-gray-800">{item.title}</p>
                      <button
                        onClick={() => handleRemovePortfolio(index)}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {showAddForm && (
                <div className="border border-gray-200 rounded-lg p-4 space-y-3">
                  <input
                    type="text"
                    name="title"
                    value={newPortfolio.title}
                    onChange={handlePortfolioChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-800 placeholder-gray-400"
                    placeholder="Project Title"
                  />
                  <textarea
                    name="description"
                    value={newPortfolio.description}
                    onChange={handlePortfolioChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-800 placeholder-gray-400"
                    placeholder="Description"
                    rows="2"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800"
                  />
                  <input
                    type="url"
                    name="videoUrl"
                    value={newPortfolio.videoUrl}
                    onChange={handlePortfolioChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-800 placeholder-gray-400"
                    placeholder="Video URL (YouTube)"
                  />
                  <input
                    type="url"
                    name="projectLink"
                    value={newPortfolio.projectLink}
                    onChange={handlePortfolioChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-800 placeholder-gray-400"
                    placeholder="Project Link"
                  />
                  <button
                    onClick={handleAddPortfolio}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                  >
                    Add Portfolio Item
                  </button>
                </div>
              )}
            </div>

            {/* Social Links */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium text-gray-700">Social Links</h3>
              </div>

              <div className="flex flex-wrap gap-3 mb-3">
                <div className="flex-1 min-w-[150px]">
                  <select
                    value={newSocialLink.platform}
                    onChange={handleSocialPlatformChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-800"
                  >
                    <option value="">Select Platform</option>
                    {socialPlatforms.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                {showCustomPlatform && (
                  <div className="flex-1 min-w-[150px]">
                    <input
                      type="text"
                      placeholder="Enter custom platform"
                      value={newSocialLink.platform === 'OTHER' ? '' : newSocialLink.platform}
                      onChange={handleCustomPlatformChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-800 placeholder-gray-400"
                    />
                  </div>
                )}

                <div className="flex-1 min-w-[200px]">
                  <input
                    type="url"
                    placeholder="URL (e.g., https://instagram.com/...)"
                    value={newSocialLink.url}
                    onChange={handleSocialUrlChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-800 placeholder-gray-400"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleAddSocialLink}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition whitespace-nowrap"
                >
                  + Add Link
                </button>
              </div>

              {formData.socialLinks?.length > 0 && (
                <div className="space-y-2">
                  {formData.socialLinks.map((link, index) => (
                    <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded border border-gray-200">
                      <span className="text-sm text-gray-700">
                        <strong>{link.platform}:</strong> {link.url}
                      </span>
                      <button
                        onClick={() => handleRemoveSocialLink(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Shop Details */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-medium text-gray-700 mb-3">Shop/Business Details <span className="text-gray-400 text-xs">(Optional)</span></h3>
              <div className="space-y-3">
                <input
                  type="text"
                  name="shopName"
                  value={formData.shopName || ''}
                  onChange={(e) => updateFormData({ shopName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-800 placeholder-gray-400"
                  placeholder="Shop/Business Name"
                />
                <textarea
                  name="shopAddress"
                  value={formData.shopAddress || ''}
                  onChange={(e) => updateFormData({ shopAddress: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-800 placeholder-gray-400"
                  placeholder="Shop Address"
                  rows="2"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shop Photos</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      const files = e.target.files;
                      const imageUrls = [];
                      for (let i = 0; i < files.length; i++) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          imageUrls.push(reader.result);
                          if (imageUrls.length === files.length) {
                            updateFormData({ shopPhotos: [...(formData.shopPhotos || []), ...imageUrls] });
                          }
                        };
                        reader.readAsDataURL(files[i]);
                      }
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800"
                  />
                </div>
                {formData.shopPhotos?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.shopPhotos.map((photo, index) => (
                      <img key={index} src={photo} alt={`Shop ${index}`} className="w-16 h-16 object-cover rounded border border-gray-200" />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-6 border-t border-gray-200">
              <button
                onClick={onBack}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                ← Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save & Continue →'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(10px, -15px) scale(1.1); }
          50% { transform: translate(-5px, 10px) scale(0.9); }
          75% { transform: translate(15px, 5px) scale(1.05); }
          100% { transform: translate(0, 0) scale(1); }
        }
        .star-float {
          animation: float var(--duration) ease-in-out infinite;
          animation-delay: var(--delay);
          will-change: transform, opacity;
        }

        @keyframes starShine {
          0% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.5); opacity: 0.8; }
          100% { transform: scale(1); opacity: 0.2; }
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

export default Stage4Portfolio;
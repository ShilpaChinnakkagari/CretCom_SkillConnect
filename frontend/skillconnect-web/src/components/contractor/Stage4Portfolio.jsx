import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

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
    const readers = [];
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

  // ============ SOCIAL LINKS ============
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

  // ============ SHOP DETAILS ============
  const handleShopPhotoUpload = (e) => {
    const files = e.target.files;
    const readers = [];
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

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        portfolio: formData.portfolio || [],
        socialLinks: formData.socialLinks || [],
        shopName: formData.shopName || '',
        shopAddress: formData.shopAddress || '',
        shopPhotos: formData.shopPhotos || []
      };

      await axios.post('http://localhost:8080/api/contractor/register/stage4', payload, {
        withCredentials: true
      });

      toast.success('Portfolio saved!');
      onNext();
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">Portfolio & Trust</h2>
      <p className="text-gray-500 text-sm mb-6">Show your work and build trust</p>

      <div className="space-y-6">
        {/* Portfolio Section */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium text-gray-700">Portfolio Items</h3>
            <button
              type="button"
              onClick={() => setShowAddForm(!showAddForm)}
              className="text-primary-600 hover:text-primary-700 text-sm"
            >
              {showAddForm ? 'Cancel' : '+ Add Portfolio'}
            </button>
          </div>

          {/* Portfolio List */}
          {formData.portfolio?.length > 0 && (
            <div className="grid grid-cols-2 gap-4 mb-4">
              {formData.portfolio.map((item, index) => (
                <div key={index} className="border rounded-lg p-3 relative">
                  {item.imageUrls?.length > 0 && (
                    <img src={item.imageUrls[0]} alt={item.title} className="w-full h-32 object-cover rounded-lg mb-2" />
                  )}
                  <p className="font-medium text-sm">{item.title}</p>
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

          {/* Add Portfolio Form */}
          {showAddForm && (
            <div className="border rounded-lg p-4 space-y-3">
              <input
                type="text"
                name="title"
                value={newPortfolio.title}
                onChange={handlePortfolioChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Project Title"
              />
              <textarea
                name="description"
                value={newPortfolio.description}
                onChange={handlePortfolioChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Description"
                rows="2"
              />
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="url"
                name="videoUrl"
                value={newPortfolio.videoUrl}
                onChange={handlePortfolioChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Video URL (YouTube)"
              />
              <input
                type="url"
                name="projectLink"
                value={newPortfolio.projectLink}
                onChange={handlePortfolioChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Project Link"
              />
              <button
                onClick={handleAddPortfolio}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Add Portfolio Item
              </button>
            </div>
          )}
        </div>

        {/* Social Links - With Dropdown + Manual Entry */}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium text-gray-700">Social Links</h3>
          </div>

          {/* Add Social Link Form */}
          <div className="flex flex-wrap gap-3 mb-3">
            <div className="flex-1 min-w-[150px]">
              <select
                value={newSocialLink.platform}
                onChange={handleSocialPlatformChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            )}

            <div className="flex-1 min-w-[200px]">
              <input
                type="url"
                placeholder="URL (e.g., https://instagram.com/...)"
                value={newSocialLink.url}
                onChange={handleSocialUrlChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <button
              type="button"
              onClick={handleAddSocialLink}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition whitespace-nowrap"
            >
              + Add Link
            </button>
          </div>

          {/* Display Social Links */}
          {formData.socialLinks?.length > 0 && (
            <div className="space-y-2">
              {formData.socialLinks.map((link, index) => (
                <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                  <span className="text-sm">
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
        <div className="border-t pt-4">
          <h3 className="font-medium text-gray-700 mb-3">Shop/Business Details <span className="text-gray-400 text-xs">(Optional)</span></h3>
          <div className="space-y-3">
            <input
              type="text"
              name="shopName"
              value={formData.shopName || ''}
              onChange={(e) => updateFormData({ shopName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Shop/Business Name"
            />
            <textarea
              name="shopAddress"
              value={formData.shopAddress || ''}
              onChange={(e) => updateFormData({ shopAddress: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            {formData.shopPhotos?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.shopPhotos.map((photo, index) => (
                  <img key={index} src={photo} alt={`Shop ${index}`} className="w-16 h-16 object-cover rounded" />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-6 border-t">
          <button
            onClick={onBack}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            ← Back
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save & Continue →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Stage4Portfolio;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const ContractorProfileViewer = ({ contractorId, onClose, onFollowToggle, followingList }) => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('about');
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (contractorId) {
      fetchProfile();
      checkFollowStatus();
    }
  }, [contractorId]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8080/contractor/profile/full/${contractorId}`,
        { withCredentials: true }
      );
      console.log('Full Profile Data:', response.data); // Debug log
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const checkFollowStatus = () => {
    if (followingList) {
      setIsFollowing(followingList.includes(contractorId));
    }
  };

  const handleFollow = async () => {
    if (onFollowToggle) {
      await onFollowToggle(contractorId, isFollowing);
      setIsFollowing(!isFollowing);
    }
  };

  const getInitials = (name) => {
    if (!name) return '👤';
    const parts = name.split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <div className="bg-[#161B22] rounded-2xl p-8 border border-gray-700 max-w-md w-full mx-4 text-center">
          <p className="text-gray-400">Profile not found</p>
          <button onClick={onClose} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-[#161B22] rounded-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-gray-700">
        
        {/* ===== HEADER ===== */}
        <div className="sticky top-0 bg-[#161B22] z-10 p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">👤 Contractor Profile</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white text-2xl transition"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          
          {/* ===== PROFILE HEADER ===== */}
          <div className="flex flex-wrap items-start gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-gray-700 overflow-hidden flex-shrink-0">
              {profile.profilePhoto ? (
                <img src={profile.profilePhoto} alt={profile.fullName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl text-gray-400">
                  {getInitials(profile.fullName)}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="text-2xl font-bold text-white">{profile.fullName}</h3>
                {profile.isVerified && (
                  <span className="text-green-400 text-sm bg-green-400/20 px-2 py-0.5 rounded-full">✅ Verified</span>
                )}
              </div>
              <p className="text-blue-400 text-lg">{profile.primaryCategory}</p>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-400">
                <span>⭐ {profile.averageRating?.toFixed(1) || '0.0'}</span>
                <span>•</span>
                <span>📍 {profile.location?.city || profile.location?.state || 'Location not set'}</span>
                <span>•</span>
                <span>📅 {profile.yearsOfExperience || 0} years experience</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={handleFollow}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  isFollowing
                    ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isFollowing ? '✅ Following' : '+ Follow'}
              </button>
              <button
                onClick={() => toast.success('💬 Chat coming soon')}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm"
              >
                💬 Message
              </button>
            </div>
          </div>

          {/* ===== STATS ROW ===== */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-6 p-4 bg-[#0D1117] rounded-xl border border-gray-700">
            <div className="text-center">
              <p className="text-xl font-bold text-white">{profile.followersCount || 0}</p>
              <p className="text-xs text-gray-400">Followers</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-white">{profile.totalPosts || 0}</p>
              <p className="text-xs text-gray-400">Posts</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-white">{profile.totalReviews || 0}</p>
              <p className="text-xs text-gray-400">Reviews</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-white">{profile.completedBookings || 0}</p>
              <p className="text-xs text-gray-400">Jobs Done</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-green-400">₹{profile.totalEarnings || 0}</p>
              <p className="text-xs text-gray-400">Earnings</p>
            </div>
          </div>

          {/* ===== TABS ===== */}
          <div className="flex gap-1 border-b border-gray-700 mt-6 overflow-x-auto">
            {['about', 'services', 'portfolio', 'posts', 'reviews', 'contact'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium transition whitespace-nowrap ${
                  activeTab === tab
                    ? 'text-blue-400 border-b-2 border-blue-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab === 'about' && '📖 About'}
                {tab === 'services' && '🔧 Services'}
                {tab === 'portfolio' && '📂 Portfolio'}
                {tab === 'posts' && '📰 Posts'}
                {tab === 'reviews' && '💬 Reviews'}
                {tab === 'contact' && '📞 Contact'}
              </button>
            ))}
          </div>

          {/* ===== TAB CONTENT ===== */}
          <div className="mt-4">
            
            {/* ABOUT TAB */}
            {activeTab === 'about' && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-1">About Me</h4>
                  <p className="text-gray-300">{profile.aboutMe || 'No description provided'}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-1">📍 Location</h4>
                    <p className="text-gray-300">{profile.location?.address || 'Not specified'}</p>
                    <p className="text-gray-400 text-sm">{profile.location?.city}, {profile.location?.state}</p>
                    <p className="text-gray-400 text-sm">PIN: {profile.location?.pincode || 'N/A'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-1">🌍 Languages</h4>
                    <p className="text-gray-300">{profile.languagesSpoken?.join(', ') || 'Not specified'}</p>
                    <h4 className="text-sm font-medium text-gray-400 mt-3 mb-1">🏢 Business Type</h4>
                    <p className="text-gray-300">{profile.teamSize || 'Not specified'}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-1">🛠️ Work Types</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.workTypes?.map((work, index) => (
                      <span key={index} className="px-3 py-1 bg-[#0D1117] border border-gray-700 rounded-full text-sm text-gray-300">
                        {work}
                      </span>
                    )) || <span className="text-gray-500">No work types specified</span>}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-1">🏆 Specializations</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.specializations?.map((spec, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm">
                        {spec}
                      </span>
                    )) || <span className="text-gray-500">No specializations specified</span>}
                  </div>
                </div>
              </div>
            )}

            {/* SERVICES TAB */}
            {activeTab === 'services' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-[#0D1117] rounded-xl border border-gray-700">
                    <h4 className="text-sm font-medium text-gray-400 mb-1">Primary Category</h4>
                    <p className="text-white text-lg">{profile.primaryCategory}</p>
                  </div>
                  <div className="p-4 bg-[#0D1117] rounded-xl border border-gray-700">
                    <h4 className="text-sm font-medium text-gray-400 mb-1">Skill Level</h4>
                    <p className="text-white text-lg">{profile.skillLevel}</p>
                  </div>
                </div>
                <div className="p-4 bg-[#0D1117] rounded-xl border border-gray-700">
                  <h4 className="text-sm font-medium text-gray-400 mb-1">Secondary Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.secondarySkills?.map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-300">
                        {skill}
                      </span>
                    )) || <span className="text-gray-500">No secondary skills</span>}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-[#0D1117] rounded-xl border border-gray-700">
                    <h4 className="text-sm font-medium text-gray-400 mb-1">Pricing Type</h4>
                    <p className="text-white">{profile.pricingType}</p>
                  </div>
                  <div className="p-4 bg-[#0D1117] rounded-xl border border-gray-700">
                    <h4 className="text-sm font-medium text-gray-400 mb-1">Service Type</h4>
                    <p className="text-white">{profile.serviceType}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-[#0D1117] rounded-xl border border-gray-700">
                    <h4 className="text-sm font-medium text-gray-400 mb-1">💰 Price Range</h4>
                    <p className="text-green-400 text-lg">₹{profile.minimumPrice} - ₹{profile.maximumPrice}</p>
                    <p className="text-xs text-gray-500">{profile.priceNegotiable ? '✅ Negotiable' : '❌ Fixed'}</p>
                  </div>
                  <div className="p-4 bg-[#0D1117] rounded-xl border border-gray-700">
                    <h4 className="text-sm font-medium text-gray-400 mb-1">📍 Service Areas</h4>
                    <div className="flex flex-wrap gap-1">
                      {profile.serviceAreas?.map((area, index) => (
                        <span key={index} className="text-xs text-gray-300 bg-gray-700/50 px-2 py-0.5 rounded">
                          {area}
                        </span>
                      )) || <span className="text-gray-500">Not specified</span>}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Radius: {profile.serviceRadius} km</p>
                  </div>
                </div>
                <div className="p-4 bg-[#0D1117] rounded-xl border border-gray-700">
                  <h4 className="text-sm font-medium text-gray-400 mb-1">Availability</h4>
                  <div className="grid grid-cols-7 gap-1">
                    {profile.weeklySchedule?.map((day, index) => (
                      <div key={index} className={`text-center p-2 rounded-lg ${day.available ? 'bg-green-600/20' : 'bg-red-600/20'}`}>
                        <p className="text-xs text-gray-400">{day.day?.substring(0, 3)}</p>
                        {day.available ? (
                          <p className="text-xs text-green-400">✅</p>
                        ) : (
                          <p className="text-xs text-red-400">❌</p>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-4 mt-2 text-xs text-gray-400">
                    <span>🚨 Emergency: {profile.emergencyAvailability ? '✅ Available' : '❌ Not Available'}</span>
                    <span>🏖️ Holiday: {profile.holidayWorking ? '✅ Works' : '❌ Off'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* PORTFOLIO TAB */}
            {activeTab === 'portfolio' && (
              <div>
                {profile.portfolio && profile.portfolio.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {profile.portfolio.map((item, index) => (
                      <div key={index} className="bg-[#0D1117] rounded-xl overflow-hidden border border-gray-700">
                        {item.imageUrls && item.imageUrls.length > 0 && (
                          <img src={item.imageUrls[0]} alt={item.title} className="w-full h-48 object-cover" />
                        )}
                        <div className="p-3">
                          <p className="text-white font-medium text-sm">{item.title}</p>
                          <p className="text-gray-400 text-xs">{item.category}</p>
                          <p className="text-gray-500 text-xs mt-1 line-clamp-2">{item.description}</p>
                          {item.location && <p className="text-gray-500 text-xs">📍 {item.location}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">No portfolio items</div>
                )}
                {profile.shopName && (
                  <div className="mt-4 p-4 bg-[#0D1117] rounded-xl border border-gray-700">
                    <h4 className="text-sm font-medium text-gray-400 mb-1">🏪 Shop</h4>
                    <p className="text-white">{profile.shopName}</p>
                    <p className="text-gray-400 text-sm">{profile.shopAddress}</p>
                    {profile.shopPhotos && profile.shopPhotos.length > 0 && (
                      <div className="flex gap-2 mt-2">
                        {profile.shopPhotos.slice(0, 3).map((photo, idx) => (
                          <img key={idx} src={photo} alt="Shop" className="w-20 h-20 object-cover rounded-lg" />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ===== POSTS TAB - FIXED ===== */}
            {activeTab === 'posts' && (
              <div>
                {profile.posts && profile.posts.length > 0 ? (
                  <div className="space-y-4">
                    {profile.posts.map((post) => (
                      <div key={post.id} className="p-4 bg-[#0D1117] rounded-xl border border-gray-700">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">
                            {post.type === 'PROJECT_SHOWCASE' ? '🔨' :
                             post.type === 'ACHIEVEMENT' ? '🎉' :
                             post.type === 'EDUCATIONAL' ? '📚' : '💰'}
                          </span>
                          <span className="text-xs text-gray-500">{post.type?.replace('_', ' ')}</span>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                        <h4 className="text-white font-semibold mt-1">{post.title}</h4>
                        <p className="text-gray-300 text-sm">{post.description}</p>
                        {post.images && post.images.length > 0 && (
                          <div className="grid grid-cols-3 gap-2 mt-2">
                            {post.images.slice(0, 3).map((img, idx) => (
                              <img key={idx} src={img} className="w-full h-24 object-cover rounded-lg" />
                            ))}
                          </div>
                        )}
                        <div className="flex gap-4 mt-2 text-sm text-gray-400">
                          <span>❤️ {post.likes || 0}</span>
                          <span>💬 {post.comments?.length || 0}</span>
                          <span>👁️ {post.views || 0}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">No posts</div>
                )}
              </div>
            )}

            {/* REVIEWS TAB */}
            {activeTab === 'reviews' && (
              <div>
                {profile.reviews && profile.reviews.length > 0 ? (
                  <div className="space-y-4">
                    {profile.reviews.map((review) => (
                      <div key={review.id} className="p-4 bg-[#0D1117] rounded-xl border border-gray-700">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden">
                            {review.customerProfilePhoto ? (
                              <img src={review.customerProfilePhoto} alt={review.customerName} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">👤</div>
                            )}
                          </div>
                          <div>
                            <p className="text-white font-medium">{review.customerName}</p>
                            <div className="flex items-center gap-2">
                              <span className="text-yellow-400">{'⭐'.repeat(Math.floor(review.rating))}</span>
                              <span className="text-gray-400 text-sm">{review.rating}</span>
                            </div>
                          </div>
                          <span className="ml-auto text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-gray-300 mt-2">{review.comment}</p>
                        {review.images && review.images.length > 0 && (
                          <div className="flex gap-2 mt-2">
                            {review.images.slice(0, 3).map((img, idx) => (
                              <img key={idx} src={img} className="w-16 h-16 object-cover rounded-lg" />
                            ))}
                          </div>
                        )}
                        {review.contractorResponse && (
                          <div className="mt-2 p-3 bg-blue-600/10 rounded-lg border border-blue-600/20">
                            <p className="text-xs text-blue-400">Contractor Response:</p>
                            <p className="text-gray-300 text-sm">{review.contractorResponse}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">No reviews yet</div>
                )}
              </div>
            )}

            {/* CONTACT TAB */}
            {activeTab === 'contact' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-[#0D1117] rounded-xl border border-gray-700">
                    <h4 className="text-sm font-medium text-gray-400 mb-1">📞 Phone</h4>
                    <p className="text-white">{profile.phoneNumber || 'Not available'}</p>
                  </div>
                  <div className="p-4 bg-[#0D1117] rounded-xl border border-gray-700">
                    <h4 className="text-sm font-medium text-gray-400 mb-1">📱 WhatsApp</h4>
                    <p className="text-white">{profile.whatsappNumber || 'Not available'}</p>
                  </div>
                </div>
                <div className="p-4 bg-[#0D1117] rounded-xl border border-gray-700">
                  <h4 className="text-sm font-medium text-gray-400 mb-1">📧 Email</h4>
                  <p className="text-white">{profile.email || 'Not available'}</p>
                </div>
                <div className="p-4 bg-[#0D1117] rounded-xl border border-gray-700">
                  <h4 className="text-sm font-medium text-gray-400 mb-1">🔗 Social Links</h4>
                  <div className="flex flex-wrap gap-3 mt-2">
                    {profile.websiteUrl && (
                      <a href={profile.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                        🌐 Website
                      </a>
                    )}
                    {profile.instagramHandle && (
                      <a href={`https://instagram.com/${profile.instagramHandle}`} target="_blank" rel="noopener noreferrer" className="text-pink-400 hover:text-pink-300">
                        📷 Instagram
                      </a>
                    )}
                    {profile.youtubeChannel && (
                      <a href={profile.youtubeChannel} target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300">
                        ▶️ YouTube
                      </a>
                    )}
                    {profile.facebookPage && (
                      <a href={profile.facebookPage} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                        📘 Facebook
                      </a>
                    )}
                    {profile.linkedinProfile && (
                      <a href={profile.linkedinProfile} target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-200">
                        🔗 LinkedIn
                      </a>
                    )}
                    {!profile.websiteUrl && !profile.instagramHandle && !profile.youtubeChannel && !profile.facebookPage && !profile.linkedinProfile && (
                      <span className="text-gray-500">No social links</span>
                    )}
                  </div>
                </div>
                {profile.socialLinks && profile.socialLinks.length > 0 && (
                  <div className="p-4 bg-[#0D1117] rounded-xl border border-gray-700">
                    <h4 className="text-sm font-medium text-gray-400 mb-1">🔗 More Links</h4>
                    {profile.socialLinks.map((link, index) => (
                      <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" className="block text-blue-400 hover:text-blue-300 text-sm">
                        {link.platform}: {link.url}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractorProfileViewer;
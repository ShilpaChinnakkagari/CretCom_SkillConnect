package com.skillconnect.services;

import com.skillconnect.models.Contractor;
import com.skillconnect.models.User;
import com.skillconnect.models.Post;
import com.skillconnect.models.Story;
import com.skillconnect.models.Review;
import com.skillconnect.repositories.ContractorRepository;
import com.skillconnect.repositories.UserRepository;
import com.skillconnect.repositories.PostRepository;
import com.skillconnect.repositories.StoryRepository;
import com.skillconnect.repositories.ReviewRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class ContractorService {

    private final ContractorRepository contractorRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final StoryRepository storyRepository;
    private final ReviewRepository reviewRepository;

    // ============ EXISTING METHODS ============
    
    public boolean contractorExists(String userId) {
        return contractorRepository.existsByUserId(userId);
    }

    public Contractor getContractorByUserId(String userId) {
        return contractorRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Contractor not found"));
    }

    public void updateUserRole(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setUserType("CONTRACTOR");
        user.setRole("CONTRACTOR");
        userRepository.save(user);
        log.info("✅ User role updated to CONTRACTOR for userId: {}", userId);
    }

    // ============ SAVE COMPLETE REGISTRATION ============
    public Contractor saveCompleteRegistration(String userId, Map<String, Object> data) {
        log.info("📝 Starting complete registration for userId: {}", userId);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        contractorRepository.findByUserId(userId).ifPresent(existing -> {
            log.info("🗑️ Deleting existing contractor for user: {}", userId);
            contractorRepository.delete(existing);
        });

        Contractor contractor = new Contractor();
        contractor.setUserId(userId);
        contractor.setEmail((String) data.get("email"));
        contractor.setCreatedAt(LocalDateTime.now());
        contractor.setStats(new Contractor.ContractorStats());
        contractor.setRegistrationComplete(true);
        contractor.setCurrentRegistrationStage(5);
        contractor.setUpdatedAt(LocalDateTime.now());

        // STAGE 1: Basic Profile
        contractor.setFullName((String) data.get("fullName"));
        contractor.setPhoneNumber((String) data.get("phoneNumber"));
        contractor.setWhatsappNumber((String) data.get("whatsappNumber"));
        contractor.setLanguagesSpoken((List<String>) data.get("languagesSpoken"));
        contractor.setAboutMe((String) data.get("aboutMe"));
        contractor.setPreferredContact((String) data.get("preferredContact"));
        contractor.setProfilePhoto((String) data.get("profilePhoto"));

        // STAGE 2: Skills & Trust
        contractor.setPrimaryCategory((String) data.get("primaryCategory"));
        contractor.setSecondarySkills((List<String>) data.get("secondarySkills"));
        
        Object yearsObj = data.get("yearsOfExperience");
        if (yearsObj != null) {
            if (yearsObj instanceof Integer) {
                contractor.setYearsOfExperience((Integer) yearsObj);
            } else if (yearsObj instanceof String) {
                try {
                    contractor.setYearsOfExperience(Integer.parseInt((String) yearsObj));
                } catch (NumberFormatException e) {
                    contractor.setYearsOfExperience(0);
                }
            }
        }
        
        contractor.setSkillLevel((String) data.get("skillLevel"));
        contractor.setWorkTypes((List<String>) data.get("workTypes"));
        contractor.setSpecializations((List<String>) data.get("specializations"));
        contractor.setTeamSize((String) data.get("teamSize"));
        contractor.setIdType((String) data.get("idType"));
        contractor.setIdNumber((String) data.get("idNumber"));
        contractor.setIdProofUrl((String) data.get("idProofUrl"));

        // STAGE 3: Pricing & Location
        contractor.setPricingType((String) data.get("pricingType"));
        
        Object minPrice = data.get("minimumPrice");
        if (minPrice != null) {
            if (minPrice instanceof Double) {
                contractor.setMinimumPrice((Double) minPrice);
            } else if (minPrice instanceof String) {
                try {
                    contractor.setMinimumPrice(Double.parseDouble((String) minPrice));
                } catch (NumberFormatException e) {
                    contractor.setMinimumPrice(0.0);
                }
            }
        }
        
        contractor.setPriceNegotiable((Boolean) data.get("priceNegotiable"));

        Map<String, Object> locationData = (Map<String, Object>) data.get("location");
        if (locationData != null) {
            Contractor.Location location = new Contractor.Location();
            if (locationData.containsKey("address")) location.setAddress((String) locationData.get("address"));
            if (locationData.containsKey("city")) location.setCity((String) locationData.get("city"));
            if (locationData.containsKey("state")) location.setState((String) locationData.get("state"));
            if (locationData.containsKey("country")) location.setCountry((String) locationData.get("country"));
            if (locationData.containsKey("pincode")) location.setPincode((String) locationData.get("pincode"));
            contractor.setLocation(location);
        }

        contractor.setServiceAreas((List<String>) data.get("serviceAreas"));
        
        Object radius = data.get("serviceRadius");
        if (radius != null) {
            if (radius instanceof Integer) {
                contractor.setServiceRadius((Integer) radius);
            } else if (radius instanceof String) {
                try {
                    contractor.setServiceRadius(Integer.parseInt((String) radius));
                } catch (NumberFormatException e) {
                    contractor.setServiceRadius(10);
                }
            }
        }
        
        contractor.setHomeServiceAvailable((Boolean) data.get("homeServiceAvailable"));
        contractor.setServiceType((String) data.get("serviceType"));

        // STAGE 4: Portfolio
        List<Map<String, Object>> portfolioData = (List<Map<String, Object>>) data.get("portfolio");
        if (portfolioData != null && !portfolioData.isEmpty()) {
            List<Contractor.PortfolioItem> portfolio = new ArrayList<>();
            for (Map<String, Object> itemData : portfolioData) {
                Contractor.PortfolioItem item = new Contractor.PortfolioItem();
                if (itemData.containsKey("title")) item.setTitle((String) itemData.get("title"));
                if (itemData.containsKey("description")) item.setDescription((String) itemData.get("description"));
                if (itemData.containsKey("category")) item.setCategory((String) itemData.get("category"));
                if (itemData.containsKey("imageUrls")) item.setImageUrls((List<String>) itemData.get("imageUrls"));
                if (itemData.containsKey("videoUrl")) item.setVideoUrl((String) itemData.get("videoUrl"));
                if (itemData.containsKey("projectLink")) item.setProjectLink((String) itemData.get("projectLink"));
                if (itemData.containsKey("location")) item.setLocation((String) itemData.get("location"));
                if (itemData.containsKey("timeTaken")) item.setTimeTaken((String) itemData.get("timeTaken"));
                portfolio.add(item);
            }
            contractor.setPortfolio(portfolio);
        }

        List<Map<String, Object>> socialLinksData = (List<Map<String, Object>>) data.get("socialLinks");
        if (socialLinksData != null && !socialLinksData.isEmpty()) {
            List<Contractor.SocialLink> socialLinks = new ArrayList<>();
            for (Map<String, Object> linkData : socialLinksData) {
                Contractor.SocialLink link = new Contractor.SocialLink();
                if (linkData.containsKey("platform")) link.setPlatform((String) linkData.get("platform"));
                if (linkData.containsKey("url")) link.setUrl((String) linkData.get("url"));
                socialLinks.add(link);
            }
            contractor.setSocialLinks(socialLinks);
        }

        contractor.setShopName((String) data.get("shopName"));
        contractor.setShopAddress((String) data.get("shopAddress"));
        contractor.setShopPhotos((List<String>) data.get("shopPhotos"));

        // STAGE 5: Availability
        List<Map<String, Object>> scheduleData = (List<Map<String, Object>>) data.get("weeklySchedule");
        if (scheduleData != null && !scheduleData.isEmpty()) {
            List<Contractor.WeeklySchedule> schedule = new ArrayList<>();
            for (Map<String, Object> dayData : scheduleData) {
                Contractor.WeeklySchedule day = new Contractor.WeeklySchedule();
                if (dayData.containsKey("day")) day.setDay((String) dayData.get("day"));
                if (dayData.containsKey("available")) day.setAvailable((Boolean) dayData.get("available"));
                if (dayData.containsKey("startTime")) day.setStartTime((String) dayData.get("startTime"));
                if (dayData.containsKey("endTime")) day.setEndTime((String) dayData.get("endTime"));
                schedule.add(day);
            }
            contractor.setWeeklySchedule(schedule);
        }

        contractor.setTimeSlots((List<String>) data.get("timeSlots"));
        contractor.setEmergencyAvailability((Boolean) data.get("emergencyAvailability"));
        contractor.setHolidayWorking((Boolean) data.get("holidayWorking"));
        contractor.setTermsAccepted((Boolean) data.get("termsAccepted"));
        contractor.setUpdatedAt(LocalDateTime.now());

        log.info("💾 Saving contractor to database for user: {}", userId);
        Contractor savedContractor = contractorRepository.save(contractor);

        log.info("✅ Contractor registration COMPLETED for user: {}", userId);
        return savedContractor;
    }

    // ============ SAVE STAGE DATA ============
    public Contractor saveStageData(String userId, Integer stage, Map<String, Object> data) {
        log.info("📝 Saving stage {} for userId: {}", stage, userId);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        Contractor contractor = contractorRepository.findByUserId(userId)
                .orElse(new Contractor());
        
        if (contractor.getUserId() == null) {
            contractor.setUserId(userId);
            contractor.setEmail((String) data.get("email"));
            contractor.setCreatedAt(LocalDateTime.now());
            contractor.setStats(new Contractor.ContractorStats());
        }
        
        contractor.setCurrentRegistrationStage(stage);
        contractor.setUpdatedAt(LocalDateTime.now());

        // STAGE 1: Basic Profile
        if (stage >= 1) {
            if (data.containsKey("fullName")) contractor.setFullName((String) data.get("fullName"));
            if (data.containsKey("phoneNumber")) contractor.setPhoneNumber((String) data.get("phoneNumber"));
            if (data.containsKey("whatsappNumber")) contractor.setWhatsappNumber((String) data.get("whatsappNumber"));
            if (data.containsKey("languagesSpoken")) contractor.setLanguagesSpoken((List<String>) data.get("languagesSpoken"));
            if (data.containsKey("aboutMe")) contractor.setAboutMe((String) data.get("aboutMe"));
            if (data.containsKey("preferredContact")) contractor.setPreferredContact((String) data.get("preferredContact"));
            if (data.containsKey("profilePhoto")) contractor.setProfilePhoto((String) data.get("profilePhoto"));
        }

        // STAGE 2: Skills & Trust
        if (stage >= 2) {
            if (data.containsKey("primaryCategory")) contractor.setPrimaryCategory((String) data.get("primaryCategory"));
            if (data.containsKey("secondarySkills")) contractor.setSecondarySkills((List<String>) data.get("secondarySkills"));
            
            Object yearsObj = data.get("yearsOfExperience");
            if (yearsObj != null) {
                if (yearsObj instanceof Integer) {
                    contractor.setYearsOfExperience((Integer) yearsObj);
                } else if (yearsObj instanceof String) {
                    try {
                        contractor.setYearsOfExperience(Integer.parseInt((String) yearsObj));
                    } catch (NumberFormatException e) {
                        contractor.setYearsOfExperience(0);
                    }
                }
            }
            
            if (data.containsKey("skillLevel")) contractor.setSkillLevel((String) data.get("skillLevel"));
            if (data.containsKey("workTypes")) contractor.setWorkTypes((List<String>) data.get("workTypes"));
            if (data.containsKey("specializations")) contractor.setSpecializations((List<String>) data.get("specializations"));
            if (data.containsKey("teamSize")) contractor.setTeamSize((String) data.get("teamSize"));
        }

        // STAGE 3: Pricing & Location
        if (stage >= 3) {
            if (data.containsKey("pricingType")) contractor.setPricingType((String) data.get("pricingType"));
            
            Object minPrice = data.get("minimumPrice");
            if (minPrice != null) {
                if (minPrice instanceof Double) {
                    contractor.setMinimumPrice((Double) minPrice);
                } else if (minPrice instanceof String) {
                    try {
                        contractor.setMinimumPrice(Double.parseDouble((String) minPrice));
                    } catch (NumberFormatException e) {
                        contractor.setMinimumPrice(0.0);
                    }
                }
            }

            Map<String, Object> locationData = (Map<String, Object>) data.get("location");
            if (locationData != null) {
                Contractor.Location location = contractor.getLocation() != null ? contractor.getLocation() : new Contractor.Location();
                if (locationData.containsKey("address")) location.setAddress((String) locationData.get("address"));
                if (locationData.containsKey("city")) location.setCity((String) locationData.get("city"));
                if (locationData.containsKey("state")) location.setState((String) locationData.get("state"));
                if (locationData.containsKey("country")) location.setCountry((String) locationData.get("country"));
                if (locationData.containsKey("pincode")) location.setPincode((String) locationData.get("pincode"));
                contractor.setLocation(location);
            }

            if (data.containsKey("serviceAreas")) contractor.setServiceAreas((List<String>) data.get("serviceAreas"));
            if (data.containsKey("serviceType")) contractor.setServiceType((String) data.get("serviceType"));
        }

        // STAGE 4: Portfolio
        if (stage >= 4) {
            List<Map<String, Object>> portfolioData = (List<Map<String, Object>>) data.get("portfolio");
            if (portfolioData != null && !portfolioData.isEmpty()) {
                List<Contractor.PortfolioItem> portfolio = new ArrayList<>();
                for (Map<String, Object> itemData : portfolioData) {
                    Contractor.PortfolioItem item = new Contractor.PortfolioItem();
                    if (itemData.containsKey("title")) item.setTitle((String) itemData.get("title"));
                    if (itemData.containsKey("description")) item.setDescription((String) itemData.get("description"));
                    if (itemData.containsKey("category")) item.setCategory((String) itemData.get("category"));
                    if (itemData.containsKey("imageUrls")) item.setImageUrls((List<String>) itemData.get("imageUrls"));
                    portfolio.add(item);
                }
                contractor.setPortfolio(portfolio);
            }

            List<Map<String, Object>> socialLinksData = (List<Map<String, Object>>) data.get("socialLinks");
            if (socialLinksData != null && !socialLinksData.isEmpty()) {
                List<Contractor.SocialLink> socialLinks = new ArrayList<>();
                for (Map<String, Object> linkData : socialLinksData) {
                    Contractor.SocialLink link = new Contractor.SocialLink();
                    if (linkData.containsKey("platform")) link.setPlatform((String) linkData.get("platform"));
                    if (linkData.containsKey("url")) link.setUrl((String) linkData.get("url"));
                    socialLinks.add(link);
                }
                contractor.setSocialLinks(socialLinks);
            }

            if (data.containsKey("shopName")) contractor.setShopName((String) data.get("shopName"));
            if (data.containsKey("shopAddress")) contractor.setShopAddress((String) data.get("shopAddress"));
            if (data.containsKey("shopPhotos")) contractor.setShopPhotos((List<String>) data.get("shopPhotos"));
        }

        // STAGE 5: Availability
        if (stage >= 5) {
            List<Map<String, Object>> scheduleData = (List<Map<String, Object>>) data.get("weeklySchedule");
            if (scheduleData != null && !scheduleData.isEmpty()) {
                List<Contractor.WeeklySchedule> schedule = new ArrayList<>();
                for (Map<String, Object> dayData : scheduleData) {
                    Contractor.WeeklySchedule day = new Contractor.WeeklySchedule();
                    if (dayData.containsKey("day")) day.setDay((String) dayData.get("day"));
                    if (dayData.containsKey("available")) day.setAvailable((Boolean) dayData.get("available"));
                    if (dayData.containsKey("startTime")) day.setStartTime((String) dayData.get("startTime"));
                    if (dayData.containsKey("endTime")) day.setEndTime((String) dayData.get("endTime"));
                    schedule.add(day);
                }
                contractor.setWeeklySchedule(schedule);
            }

            if (data.containsKey("termsAccepted")) contractor.setTermsAccepted((Boolean) data.get("termsAccepted"));
            
            if (stage == 5) {
                contractor.setRegistrationComplete(true);
                contractor.setCurrentRegistrationStage(5);
                log.info("🎉 Registration COMPLETE for userId: {}", userId);
            }
        }

        contractor.setUpdatedAt(LocalDateTime.now());

        log.info("💾 Saving contractor stage {} for user: {}", stage, userId);
        return contractorRepository.save(contractor);
    }

    // ============ FOLLOW / UNFOLLOW ============

    public Contractor followContractor(String userId, String contractorUserId) {
        log.info("🔔 User: {} is following contractor: {}", userId, contractorUserId);

        userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Contractor followerContractor = contractorRepository.findByUserId(userId).orElse(null);
        if (followerContractor != null) {
            List<String> following = followerContractor.getFollowing();
            if (following == null) {
                following = new ArrayList<>();
            }
            if (!following.contains(contractorUserId)) {
                following.add(contractorUserId);
                followerContractor.setFollowing(following);
                followerContractor.setFollowingCount(following.size());
                contractorRepository.save(followerContractor);
            }
        }

        Contractor targetContractor = contractorRepository.findByUserId(contractorUserId)
                .orElseThrow(() -> new RuntimeException("Contractor not found"));

        List<String> followers = targetContractor.getFollowers();
        if (followers == null) {
            followers = new ArrayList<>();
        }
        if (!followers.contains(userId)) {
            followers.add(userId);
            targetContractor.setFollowers(followers);
            targetContractor.setFollowersCount(followers.size());
            contractorRepository.save(targetContractor);
        }

        log.info("✅ User: {} is now following contractor: {}", userId, contractorUserId);
        return targetContractor;
    }

    public Contractor unfollowContractor(String userId, String contractorUserId) {
        log.info("🔕 User: {} is unfollowing contractor: {}", userId, contractorUserId);

        Contractor followerContractor = contractorRepository.findByUserId(userId).orElse(null);
        if (followerContractor != null && followerContractor.getFollowing() != null) {
            followerContractor.getFollowing().remove(contractorUserId);
            followerContractor.setFollowingCount(followerContractor.getFollowing().size());
            contractorRepository.save(followerContractor);
        }

        Contractor targetContractor = contractorRepository.findByUserId(contractorUserId)
                .orElseThrow(() -> new RuntimeException("Contractor not found"));

        if (targetContractor.getFollowers() != null) {
            targetContractor.getFollowers().remove(userId);
            targetContractor.setFollowersCount(targetContractor.getFollowers().size());
            contractorRepository.save(targetContractor);
        }

        log.info("✅ User: {} unfollowed contractor: {}", userId, contractorUserId);
        return targetContractor;
    }

    public boolean isFollowing(String userId, String contractorUserId) {
        Contractor contractor = contractorRepository.findByUserId(userId).orElse(null);
        if (contractor == null || contractor.getFollowing() == null) {
            return false;
        }
        return contractor.getFollowing().contains(contractorUserId);
    }

    public List<Contractor> getRecommendedContractors(String userId) {
        return contractorRepository.findTop10ByOrderByAverageRatingDesc();
    }

    // ============ GET CONTRACTOR FULL PROFILE ============
    public Map<String, Object> getContractorFullProfile(String contractorUserId) {
        log.info("📄 Fetching full profile for contractor: {}", contractorUserId);

        Contractor contractor = contractorRepository.findByUserId(contractorUserId)
                .orElseThrow(() -> new RuntimeException("Contractor not found"));

        User user = userRepository.findById(contractorUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Post> posts = postRepository.findByContractorIdAndActiveTrue(contractorUserId);
        List<Story> stories = storyRepository.findByContractorIdAndIsActiveTrueAndExpiresAtAfter(
                contractorUserId, LocalDateTime.now()
        );
        List<Review> reviews = reviewRepository.findByContractorId(contractorUserId);

        Map<String, Object> profile = new HashMap<>();

        // Basic info
        profile.put("userId", contractor.getUserId());
        profile.put("fullName", contractor.getFullName());
        profile.put("email", contractor.getEmail());
        profile.put("profilePhoto", contractor.getProfilePhoto());
        profile.put("phoneNumber", contractor.getPhoneNumber());
        profile.put("whatsappNumber", contractor.getWhatsappNumber());
        profile.put("languagesSpoken", contractor.getLanguagesSpoken());
        profile.put("aboutMe", contractor.getAboutMe());
        profile.put("preferredContact", contractor.getPreferredContact());

        // Professional info
        profile.put("primaryCategory", contractor.getPrimaryCategory());
        profile.put("secondarySkills", contractor.getSecondarySkills());
        profile.put("yearsOfExperience", contractor.getYearsOfExperience());
        profile.put("skillLevel", contractor.getSkillLevel());
        profile.put("workTypes", contractor.getWorkTypes());
        profile.put("teamSize", contractor.getTeamSize());

        // Pricing & Location
        profile.put("pricingType", contractor.getPricingType());
        profile.put("minimumPrice", contractor.getMinimumPrice());
        profile.put("maximumPrice", contractor.getMaximumPrice());
        profile.put("priceNegotiable", contractor.getPriceNegotiable());
        profile.put("location", contractor.getLocation());
        profile.put("serviceAreas", contractor.getServiceAreas());
        profile.put("serviceRadius", contractor.getServiceRadius());
        profile.put("homeServiceAvailable", contractor.getHomeServiceAvailable());
        profile.put("serviceType", contractor.getServiceType());

        // Social & Trust
        profile.put("isVerified", contractor.getIsVerified());
        profile.put("idVerified", contractor.getIdVerified());
        profile.put("backgroundChecked", contractor.getBackgroundChecked());
        profile.put("socialLinks", contractor.getSocialLinks());
        profile.put("websiteUrl", contractor.getWebsiteUrl());
        profile.put("instagramHandle", contractor.getInstagramHandle());
        profile.put("youtubeChannel", contractor.getYoutubeChannel());
        profile.put("facebookPage", contractor.getFacebookPage());
        profile.put("linkedinProfile", contractor.getLinkedinProfile());

        // Portfolio
        profile.put("portfolio", contractor.getPortfolio());
        profile.put("shopPhotos", contractor.getShopPhotos());

        // Stats
        profile.put("averageRating", contractor.getAverageRating());
        profile.put("totalReviews", contractor.getTotalReviews());
        profile.put("followersCount", contractor.getFollowersCount());
        profile.put("followingCount", contractor.getFollowingCount());
        profile.put("totalPosts", contractor.getTotalPosts());
        profile.put("totalLikesReceived", contractor.getTotalLikesReceived());
        profile.put("totalCommentsReceived", contractor.getTotalCommentsReceived());
        profile.put("totalStories", contractor.getTotalStories());

        // Booking Stats
        profile.put("totalBookings", contractor.getTotalBookings());
        profile.put("completedBookings", contractor.getCompletedBookings());
        profile.put("pendingBookings", contractor.getPendingBookings());
        profile.put("cancelledBookings", contractor.getCancelledBookings());
        profile.put("totalEarnings", contractor.getTotalEarnings());
        profile.put("completionRate", contractor.getCompletionRate());

        // Posts & Stories & Reviews
        profile.put("posts", posts);
        profile.put("stories", stories);
        profile.put("reviews", reviews);

        return profile;
    }

    // ============ NEARBY CONTRACTORS ============
    public List<Contractor> findNearbyContractors(double lat, double lng, double radiusKm) {
        // TODO: Implement geospatial query later
        log.info("📍 Finding nearby contractors - feature coming soon");
        return contractorRepository.findAll();
    }
}
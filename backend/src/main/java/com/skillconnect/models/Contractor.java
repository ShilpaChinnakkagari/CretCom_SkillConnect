package com.skillconnect.models;

import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "contractors")
@Data
public class Contractor {

    @Id
    private String id;

    @Indexed(unique = true)
    private String userId;

    // ============ STAGE TRACKING ============
    private Integer currentRegistrationStage;

    // ============ STAGE 1: Basic Profile ============
    private String fullName;
    private String email;
    private String phoneNumber;
    private String whatsappNumber;
    private List<String> languagesSpoken;
    private String aboutMe;
    private String preferredContact;
    private String profilePhoto;

    // ============ STAGE 2: Skills & Trust ============
    private String primaryCategory;
    private List<String> secondarySkills;
    private Integer yearsOfExperience;
    private String skillLevel;
    private List<String> workTypes;
    private List<String> specializations;
    private String teamSize;
    private String idType;
    private String idNumber;
    private String idProofUrl;

    // ============ STAGE 3: Pricing & Location ============
    private String pricingType;
    private Double baseServiceCharge;
    private Double minimumPrice;
    private Double maximumPrice;
    private Double emergencyCharge;
    private Boolean priceNegotiable;
    private Location location;
    private List<String> serviceAreas;
    private Integer serviceRadius;
    private Boolean homeServiceAvailable;
    private String serviceType;

    // ============ STAGE 4: Portfolio & Trust ============
    private List<PortfolioItem> portfolio;
    private List<SocialLink> socialLinks;
    private String shopName;
    private String shopAddress;
    private List<String> shopPhotos;

    // ============ STAGE 5: Availability & Submit ============
    private List<WeeklySchedule> weeklySchedule;
    private List<String> timeSlots;
    private Boolean emergencyAvailability;
    private Boolean holidayWorking;
    private List<BlockedDate> blockedDates;
    private Boolean termsAccepted;
    private Boolean registrationComplete = false;

    // ============ Stats ============
    private ContractorStats stats;
    private Double averageRating = 0.0;
    private Integer totalReviews = 0;

    // ============ SOCIAL FEATURES ============
    private Integer totalPosts = 0;
    private Integer totalStories = 0;
    private Integer totalLikesReceived = 0;
    private Integer totalCommentsReceived = 0;
    private Integer totalViews = 0;

    // Followers & Following
    private List<String> followers = new ArrayList<>();
    private List<String> following = new ArrayList<>();
    private Integer followersCount = 0;
    private Integer followingCount = 0;

    // Booking Stats
    private Integer totalBookings = 0;
    private Integer completedBookings = 0;
    private Integer pendingBookings = 0;
    private Integer cancelledBookings = 0;
    private Double totalEarnings = 0.0;
    private Double averageBookingValue = 0.0;
    private Double completionRate = 0.0;

    // Verification & Trust
    private Boolean isVerified = false;
    private Boolean idVerified = false;
    private Boolean backgroundChecked = false;

    // Social Presence
    private String websiteUrl;
    private String instagramHandle;
    private String youtubeChannel;
    private String facebookPage;
    private String linkedinProfile;

    // ============ Timestamps ============
    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    // ============ INNER CLASSES ============

    @Data
    public static class Location {
        private String address;
        private Double latitude;
        private Double longitude;
        private String city;
        private String state;
        private String country;
        private String pincode;
    }

    @Data
    public static class PortfolioItem {
        private String title;
        private String description;
        private String category;
        private List<String> imageUrls;
        private String videoUrl;
        private String documentUrl;
        private String projectLink;
        private String clientFeedback;
        private String location;
        private String timeTaken;
    }

    @Data
    public static class SocialLink {
        private String platform;
        private String url;
    }

    @Data
    public static class WeeklySchedule {
        private String day;
        private Boolean available;
        private String startTime;
        private String endTime;
    }

    @Data
    public static class BlockedDate {
        private LocalDateTime date;
        private String reason;
    }

    @Data
    public static class ContractorStats {
        private Integer totalCustomers = 0;
        private Integer completedJobs = 0;
        private Double totalEarnings = 0.0;
        private Double averageRating = 0.0;
        private Double responseTimeHours = 0.0;
        private Integer completionRate = 0;
        private Integer cancellationRate = 0;
        private Integer profileCompleteness = 0;
    }

    // ============ MANUAL GETTERS & SETTERS ============

    public String getId() { return id; }
    public String getUserId() { return userId; }
    public Integer getCurrentRegistrationStage() { return currentRegistrationStage; }
    public String getFullName() { return fullName; }
    public String getEmail() { return email; }
    public String getPhoneNumber() { return phoneNumber; }
    public String getWhatsappNumber() { return whatsappNumber; }
    public List<String> getLanguagesSpoken() { return languagesSpoken; }
    public String getAboutMe() { return aboutMe; }
    public String getPreferredContact() { return preferredContact; }
    public String getProfilePhoto() { return profilePhoto; }
    public String getPrimaryCategory() { return primaryCategory; }
    public List<String> getSecondarySkills() { return secondarySkills; }
    public Integer getYearsOfExperience() { return yearsOfExperience; }
    public String getSkillLevel() { return skillLevel; }
    public List<String> getWorkTypes() { return workTypes; }
    public List<String> getSpecializations() { return specializations; }
    public String getTeamSize() { return teamSize; }
    public String getIdType() { return idType; }
    public String getIdNumber() { return idNumber; }
    public String getIdProofUrl() { return idProofUrl; }
    public String getPricingType() { return pricingType; }
    public Double getBaseServiceCharge() { return baseServiceCharge; }
    public Double getMinimumPrice() { return minimumPrice; }
    public Double getMaximumPrice() { return maximumPrice; }
    public Double getEmergencyCharge() { return emergencyCharge; }
    public Boolean getPriceNegotiable() { return priceNegotiable; }
    public Location getLocation() { return location; }
    public List<String> getServiceAreas() { return serviceAreas; }
    public Integer getServiceRadius() { return serviceRadius; }
    public Boolean getHomeServiceAvailable() { return homeServiceAvailable; }
    public String getServiceType() { return serviceType; }
    public List<PortfolioItem> getPortfolio() { return portfolio; }
    public List<SocialLink> getSocialLinks() { return socialLinks; }
    public String getShopName() { return shopName; }
    public String getShopAddress() { return shopAddress; }
    public List<String> getShopPhotos() { return shopPhotos; }
    public List<WeeklySchedule> getWeeklySchedule() { return weeklySchedule; }
    public List<String> getTimeSlots() { return timeSlots; }
    public Boolean getEmergencyAvailability() { return emergencyAvailability; }
    public Boolean getHolidayWorking() { return holidayWorking; }
    public List<BlockedDate> getBlockedDates() { return blockedDates; }
    public Boolean getTermsAccepted() { return termsAccepted; }
    public Boolean getRegistrationComplete() { return registrationComplete; }
    public ContractorStats getStats() { return stats; }
    public Double getAverageRating() { return averageRating; }
    public Integer getTotalReviews() { return totalReviews; }
    public Integer getTotalPosts() { return totalPosts; }
    public Integer getTotalStories() { return totalStories; }
    public Integer getTotalLikesReceived() { return totalLikesReceived; }
    public Integer getTotalCommentsReceived() { return totalCommentsReceived; }
    public Integer getTotalViews() { return totalViews; }
    public List<String> getFollowers() { return followers; }
    public List<String> getFollowing() { return following; }
    public Integer getFollowersCount() { return followersCount; }
    public Integer getFollowingCount() { return followingCount; }
    public Integer getTotalBookings() { return totalBookings; }
    public Integer getCompletedBookings() { return completedBookings; }
    public Integer getPendingBookings() { return pendingBookings; }
    public Integer getCancelledBookings() { return cancelledBookings; }
    public Double getTotalEarnings() { return totalEarnings; }
    public Double getAverageBookingValue() { return averageBookingValue; }
    public Double getCompletionRate() { return completionRate; }
    public Boolean getIsVerified() { return isVerified; }
    public Boolean getIdVerified() { return idVerified; }
    public Boolean getBackgroundChecked() { return backgroundChecked; }
    public String getWebsiteUrl() { return websiteUrl; }
    public String getInstagramHandle() { return instagramHandle; }
    public String getYoutubeChannel() { return youtubeChannel; }
    public String getFacebookPage() { return facebookPage; }
    public String getLinkedinProfile() { return linkedinProfile; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    public void setId(String id) { this.id = id; }
    public void setUserId(String userId) { this.userId = userId; }
    public void setCurrentRegistrationStage(Integer currentRegistrationStage) { this.currentRegistrationStage = currentRegistrationStage; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public void setEmail(String email) { this.email = email; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    public void setWhatsappNumber(String whatsappNumber) { this.whatsappNumber = whatsappNumber; }
    public void setLanguagesSpoken(List<String> languagesSpoken) { this.languagesSpoken = languagesSpoken; }
    public void setAboutMe(String aboutMe) { this.aboutMe = aboutMe; }
    public void setPreferredContact(String preferredContact) { this.preferredContact = preferredContact; }
    public void setProfilePhoto(String profilePhoto) { this.profilePhoto = profilePhoto; }
    public void setPrimaryCategory(String primaryCategory) { this.primaryCategory = primaryCategory; }
    public void setSecondarySkills(List<String> secondarySkills) { this.secondarySkills = secondarySkills; }
    public void setYearsOfExperience(Integer yearsOfExperience) { this.yearsOfExperience = yearsOfExperience; }
    public void setSkillLevel(String skillLevel) { this.skillLevel = skillLevel; }
    public void setWorkTypes(List<String> workTypes) { this.workTypes = workTypes; }
    public void setSpecializations(List<String> specializations) { this.specializations = specializations; }
    public void setTeamSize(String teamSize) { this.teamSize = teamSize; }
    public void setIdType(String idType) { this.idType = idType; }
    public void setIdNumber(String idNumber) { this.idNumber = idNumber; }
    public void setIdProofUrl(String idProofUrl) { this.idProofUrl = idProofUrl; }
    public void setPricingType(String pricingType) { this.pricingType = pricingType; }
    public void setBaseServiceCharge(Double baseServiceCharge) { this.baseServiceCharge = baseServiceCharge; }
    public void setMinimumPrice(Double minimumPrice) { this.minimumPrice = minimumPrice; }
    public void setMaximumPrice(Double maximumPrice) { this.maximumPrice = maximumPrice; }
    public void setEmergencyCharge(Double emergencyCharge) { this.emergencyCharge = emergencyCharge; }
    public void setPriceNegotiable(Boolean priceNegotiable) { this.priceNegotiable = priceNegotiable; }
    public void setLocation(Location location) { this.location = location; }
    public void setServiceAreas(List<String> serviceAreas) { this.serviceAreas = serviceAreas; }
    public void setServiceRadius(Integer serviceRadius) { this.serviceRadius = serviceRadius; }
    public void setHomeServiceAvailable(Boolean homeServiceAvailable) { this.homeServiceAvailable = homeServiceAvailable; }
    public void setServiceType(String serviceType) { this.serviceType = serviceType; }
    public void setPortfolio(List<PortfolioItem> portfolio) { this.portfolio = portfolio; }
    public void setSocialLinks(List<SocialLink> socialLinks) { this.socialLinks = socialLinks; }
    public void setShopName(String shopName) { this.shopName = shopName; }
    public void setShopAddress(String shopAddress) { this.shopAddress = shopAddress; }
    public void setShopPhotos(List<String> shopPhotos) { this.shopPhotos = shopPhotos; }
    public void setWeeklySchedule(List<WeeklySchedule> weeklySchedule) { this.weeklySchedule = weeklySchedule; }
    public void setTimeSlots(List<String> timeSlots) { this.timeSlots = timeSlots; }
    public void setEmergencyAvailability(Boolean emergencyAvailability) { this.emergencyAvailability = emergencyAvailability; }
    public void setHolidayWorking(Boolean holidayWorking) { this.holidayWorking = holidayWorking; }
    public void setBlockedDates(List<BlockedDate> blockedDates) { this.blockedDates = blockedDates; }
    public void setTermsAccepted(Boolean termsAccepted) { this.termsAccepted = termsAccepted; }
    public void setRegistrationComplete(Boolean registrationComplete) { this.registrationComplete = registrationComplete; }
    public void setStats(ContractorStats stats) { this.stats = stats; }
    public void setAverageRating(Double averageRating) { this.averageRating = averageRating; }
    public void setTotalReviews(Integer totalReviews) { this.totalReviews = totalReviews; }
    public void setTotalPosts(Integer totalPosts) { this.totalPosts = totalPosts; }
    public void setTotalStories(Integer totalStories) { this.totalStories = totalStories; }
    public void setTotalLikesReceived(Integer totalLikesReceived) { this.totalLikesReceived = totalLikesReceived; }
    public void setTotalCommentsReceived(Integer totalCommentsReceived) { this.totalCommentsReceived = totalCommentsReceived; }
    public void setTotalViews(Integer totalViews) { this.totalViews = totalViews; }
    public void setFollowers(List<String> followers) { this.followers = followers; }
    public void setFollowing(List<String> following) { this.following = following; }
    public void setFollowersCount(Integer followersCount) { this.followersCount = followersCount; }
    public void setFollowingCount(Integer followingCount) { this.followingCount = followingCount; }
    public void setTotalBookings(Integer totalBookings) { this.totalBookings = totalBookings; }
    public void setCompletedBookings(Integer completedBookings) { this.completedBookings = completedBookings; }
    public void setPendingBookings(Integer pendingBookings) { this.pendingBookings = pendingBookings; }
    public void setCancelledBookings(Integer cancelledBookings) { this.cancelledBookings = cancelledBookings; }
    public void setTotalEarnings(Double totalEarnings) { this.totalEarnings = totalEarnings; }
    public void setAverageBookingValue(Double averageBookingValue) { this.averageBookingValue = averageBookingValue; }
    public void setCompletionRate(Double completionRate) { this.completionRate = completionRate; }
    public void setIsVerified(Boolean isVerified) { this.isVerified = isVerified; }
    public void setIdVerified(Boolean idVerified) { this.idVerified = idVerified; }
    public void setBackgroundChecked(Boolean backgroundChecked) { this.backgroundChecked = backgroundChecked; }
    public void setWebsiteUrl(String websiteUrl) { this.websiteUrl = websiteUrl; }
    public void setInstagramHandle(String instagramHandle) { this.instagramHandle = instagramHandle; }
    public void setYoutubeChannel(String youtubeChannel) { this.youtubeChannel = youtubeChannel; }
    public void setFacebookPage(String facebookPage) { this.facebookPage = facebookPage; }
    public void setLinkedinProfile(String linkedinProfile) { this.linkedinProfile = linkedinProfile; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
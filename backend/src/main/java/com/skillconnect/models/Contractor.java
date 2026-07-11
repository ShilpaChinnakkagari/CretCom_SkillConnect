package com.skillconnect.models;

import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Document(collection = "contractors")
@Data
public class Contractor {

    @Id
    private String id;

    @Indexed(unique = true)
    private String userId; // Reference to User.id

    // ============ STAGE TRACKING ============
    private Integer currentRegistrationStage; // 1, 2, 3, 4, or 5

    // ============ STAGE 1: Basic Profile ============
    private String fullName;
    private String email; // Read-only from Google
    private String phoneNumber;
    private String whatsappNumber;
    private List<String> languagesSpoken;
    private String aboutMe;
    private String preferredContact; // CALL, WHATSAPP, IN_APP_CHAT
    private String profilePhoto; // Cloudinary URL

    // ============ STAGE 2: Skills & Trust ============
    private String primaryCategory; // Mason, Electrician, etc.
    private List<String> secondarySkills;
    private Integer yearsOfExperience;
    private String skillLevel; // BEGINNER, INTERMEDIATE, EXPERT
    private List<String> workTypes; // RESIDENTIAL, COMMERCIAL, INDUSTRIAL
    private List<String> specializations;
    private String teamSize; // SOLO, SMALL_TEAM, COMPANY
    private String idType; // AADHAAR, PAN, DRIVING_LICENSE
    private String idNumber; // Encrypted
    private String idProofUrl; // Cloudinary URL

    // ============ STAGE 3: Pricing & Location ============
    private String pricingType; // FIXED, HOURLY, PER_PROJECT, NEGOTIABLE
    private Double baseServiceCharge;
    private Double minimumPrice;
    private Double maximumPrice;
    private Double emergencyCharge;
    private Boolean priceNegotiable;
    private Location location;
    private List<String> serviceAreas;
    private Integer serviceRadius; // in km
    private Boolean homeServiceAvailable;
    private String serviceType; // ONSITE, OFFSITE, BOTH

    // ============ STAGE 4: Portfolio & Trust ============
    private List<PortfolioItem> portfolio;
    private List<SocialLink> socialLinks;
    private String shopName;
    private String shopAddress;
    private List<String> shopPhotos; // Cloudinary URLs

    // ============ STAGE 5: Availability & Submit ============
    private List<WeeklySchedule> weeklySchedule;
    private List<String> timeSlots; // MORNING, AFTERNOON, EVENING, FULL_DAY
    private Boolean emergencyAvailability;
    private Boolean holidayWorking;
    private List<BlockedDate> blockedDates;
    private Boolean termsAccepted;
    private Boolean registrationComplete = false;

    // ============ Stats (Auto-calculated) ============
    private ContractorStats stats;

    // ============ Timestamps ============
    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    // ============ Inner Classes ============

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
        private String category; // BEFORE, AFTER, ONGOING, COMPLETED
        private List<String> imageUrls; // Cloudinary URLs
        private String videoUrl;
        private String documentUrl;
        private String projectLink;
        private String clientFeedback;
        private String location;
        private String timeTaken;
    }

    @Data
    public static class SocialLink {
        private String platform; // INSTAGRAM, YOUTUBE, FACEBOOK, LINKEDIN
        private String url;
    }

    @Data
    public static class WeeklySchedule {
        private String day; // MONDAY, TUESDAY, etc.
        private Boolean available;
        private String startTime; // HH:mm
        private String endTime; // HH:mm
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
        private Integer completionRate = 0; // percentage
        private Integer cancellationRate = 0; // percentage
        private Integer profileCompleteness = 0; // percentage
    }
}
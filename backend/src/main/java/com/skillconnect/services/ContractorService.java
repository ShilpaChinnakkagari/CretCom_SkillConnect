package com.skillconnect.services;

import com.skillconnect.models.Contractor;
import com.skillconnect.models.User;
import com.skillconnect.repositories.ContractorRepository;
import com.skillconnect.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class ContractorService {

    private final ContractorRepository contractorRepository;
    private final UserRepository userRepository;

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

    public Contractor saveCompleteRegistration(String userId, Map<String, Object> data) {
        log.info("📝 Starting complete registration for userId: {}", userId);
        
        // Check if user exists
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        // Delete existing contractor if any
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
        
        Object baseCharge = data.get("baseServiceCharge");
        if (baseCharge != null) {
            if (baseCharge instanceof Double) {
                contractor.setBaseServiceCharge((Double) baseCharge);
            } else if (baseCharge instanceof String) {
                try {
                    contractor.setBaseServiceCharge(Double.parseDouble((String) baseCharge));
                } catch (NumberFormatException e) {
                    contractor.setBaseServiceCharge(0.0);
                }
            }
        }
        
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
        
        Object maxPrice = data.get("maximumPrice");
        if (maxPrice != null) {
            if (maxPrice instanceof Double) {
                contractor.setMaximumPrice((Double) maxPrice);
            } else if (maxPrice instanceof String) {
                try {
                    contractor.setMaximumPrice(Double.parseDouble((String) maxPrice));
                } catch (NumberFormatException e) {
                    contractor.setMaximumPrice(0.0);
                }
            }
        }
        
        Object emergencyCharge = data.get("emergencyCharge");
        if (emergencyCharge != null) {
            if (emergencyCharge instanceof Double) {
                contractor.setEmergencyCharge((Double) emergencyCharge);
            } else if (emergencyCharge instanceof String) {
                try {
                    contractor.setEmergencyCharge(Double.parseDouble((String) emergencyCharge));
                } catch (NumberFormatException e) {
                    contractor.setEmergencyCharge(0.0);
                }
            }
        }
        
        contractor.setPriceNegotiable((Boolean) data.get("priceNegotiable"));

        Map<String, Object> locationData = (Map<String, Object>) data.get("location");
        if (locationData != null) {
            Contractor.Location location = new Contractor.Location();
            location.setAddress((String) locationData.get("address"));
            location.setCity((String) locationData.get("city"));
            location.setState((String) locationData.get("state"));
            location.setCountry((String) locationData.get("country"));
            location.setPincode((String) locationData.get("pincode"));
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
                item.setTitle((String) itemData.get("title"));
                item.setDescription((String) itemData.get("description"));
                item.setCategory((String) itemData.get("category"));
                item.setImageUrls((List<String>) itemData.get("imageUrls"));
                item.setVideoUrl((String) itemData.get("videoUrl"));
                item.setDocumentUrl((String) itemData.get("documentUrl"));
                item.setProjectLink((String) itemData.get("projectLink"));
                item.setClientFeedback((String) itemData.get("clientFeedback"));
                item.setLocation((String) itemData.get("location"));
                item.setTimeTaken((String) itemData.get("timeTaken"));
                portfolio.add(item);
            }
            contractor.setPortfolio(portfolio);
        }

        List<Map<String, Object>> socialLinksData = (List<Map<String, Object>>) data.get("socialLinks");
        if (socialLinksData != null && !socialLinksData.isEmpty()) {
            List<Contractor.SocialLink> socialLinks = new ArrayList<>();
            for (Map<String, Object> linkData : socialLinksData) {
                Contractor.SocialLink link = new Contractor.SocialLink();
                link.setPlatform((String) linkData.get("platform"));
                link.setUrl((String) linkData.get("url"));
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
                day.setDay((String) dayData.get("day"));
                day.setAvailable((Boolean) dayData.get("available"));
                day.setStartTime((String) dayData.get("startTime"));
                day.setEndTime((String) dayData.get("endTime"));
                schedule.add(day);
            }
            contractor.setWeeklySchedule(schedule);
        }

        contractor.setTimeSlots((List<String>) data.get("timeSlots"));
        contractor.setEmergencyAvailability((Boolean) data.get("emergencyAvailability"));
        contractor.setHolidayWorking((Boolean) data.get("holidayWorking"));
        
        List<Map<String, Object>> blockedData = (List<Map<String, Object>>) data.get("blockedDates");
        if (blockedData != null && !blockedData.isEmpty()) {
            List<Contractor.BlockedDate> blockedDates = new ArrayList<>();
            for (Map<String, Object> blockedDto : blockedData) {
                Contractor.BlockedDate blocked = new Contractor.BlockedDate();
                blocked.setDate(LocalDateTime.parse((String) blockedDto.get("date")));
                blocked.setReason((String) blockedDto.get("reason"));
                blockedDates.add(blocked);
            }
            contractor.setBlockedDates(blockedDates);
        }

        contractor.setTermsAccepted((Boolean) data.get("termsAccepted"));
        contractor.setUpdatedAt(LocalDateTime.now());

        log.info("💾 Saving contractor to database for user: {}", userId);
        Contractor savedContractor = contractorRepository.save(contractor);

        log.info("✅ Contractor registration COMPLETED for user: {}", userId);
        return savedContractor;
    }
}
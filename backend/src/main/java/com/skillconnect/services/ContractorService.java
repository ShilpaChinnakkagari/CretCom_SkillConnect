package com.skillconnect.services;

import com.skillconnect.dto.*;
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

@Service
@RequiredArgsConstructor
@Slf4j
public class ContractorService {

    private final ContractorRepository contractorRepository;
    private final UserRepository userRepository;

    // ============ GET ALL CONTRACTORS ============
    public List<Contractor> getAllContractors() {
        return contractorRepository.findAll();
    }

    // ============ GET CONTRACTOR BY ID ============
    public Contractor getContractorById(String contractorId) {
        return contractorRepository.findById(contractorId)
                .orElseThrow(() -> new RuntimeException("Contractor not found"));
    }

    // ============ GET CONTRACTOR BY USER ID ============
    public Contractor getContractorByUserId(String userId) {
        log.info("🔍 Looking for contractor with userId: {}", userId);
        Contractor contractor = contractorRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Contractor profile not found for user: " + userId));
        log.info("✅ Found contractor: {} with id: {}", contractor.getFullName(), contractor.getId());
        return contractor;
    }

    // ============ STAGE 1: Basic Profile ============
    public Contractor saveStage1(String userId, ContractorStage1DTO dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Contractor contractor = contractorRepository.findByUserId(userId).orElse(null);

        if (contractor == null) {
            contractor = new Contractor();
            contractor.setUserId(userId);
            contractor.setEmail(dto.getEmail());
            contractor.setCreatedAt(LocalDateTime.now());
            contractor.setStats(new Contractor.ContractorStats());
        }

        contractor.setFullName(dto.getFullName());
        contractor.setEmail(dto.getEmail());
        contractor.setPhoneNumber(dto.getPhoneNumber());
        contractor.setWhatsappNumber(dto.getWhatsappNumber());
        contractor.setLanguagesSpoken(dto.getLanguagesSpoken());
        contractor.setAboutMe(dto.getAboutMe());
        contractor.setPreferredContact(dto.getPreferredContact());
        if (dto.getProfilePhoto() != null) {
            contractor.setProfilePhoto(dto.getProfilePhoto());
        }
        contractor.setUpdatedAt(LocalDateTime.now());

        user.setName(dto.getFullName());
        user.setPhone(dto.getPhoneNumber());
        userRepository.save(user);

        updateProfileCompleteness(contractor);
        log.info("✅ Stage 1 saved for user: {}", userId);

        return contractorRepository.save(contractor);
    }

    // ============ STAGE 2: Skills & Trust ============
    public Contractor saveStage2(String userId, ContractorStage2DTO dto) {
        Contractor contractor = getContractorByUserId(userId);

        contractor.setPrimaryCategory(dto.getPrimaryCategory());
        contractor.setSecondarySkills(dto.getSecondarySkills());
        contractor.setYearsOfExperience(dto.getYearsOfExperience());
        contractor.setSkillLevel(dto.getSkillLevel());
        contractor.setWorkTypes(dto.getWorkTypes());
        contractor.setSpecializations(dto.getSpecializations());
        contractor.setTeamSize(dto.getTeamSize());
        contractor.setIdType(dto.getIdType());
        contractor.setIdNumber(dto.getIdNumber());
        contractor.setIdProofUrl(dto.getIdProofUrl());
        contractor.setUpdatedAt(LocalDateTime.now());

        updateProfileCompleteness(contractor);
        log.info("✅ Stage 2 saved for user: {}", userId);

        return contractorRepository.save(contractor);
    }

    // ============ STAGE 3: Pricing & Location ============
    public Contractor saveStage3(String userId, ContractorStage3DTO dto) {
        Contractor contractor = getContractorByUserId(userId);

        contractor.setPricingType(dto.getPricingType());
        contractor.setBaseServiceCharge(dto.getBaseServiceCharge());
        contractor.setMinimumPrice(dto.getMinimumPrice());
        contractor.setMaximumPrice(dto.getMaximumPrice());
        contractor.setEmergencyCharge(dto.getEmergencyCharge());
        contractor.setPriceNegotiable(dto.getPriceNegotiable());

        Contractor.Location location = new Contractor.Location();
        location.setAddress(dto.getLocation().getAddress());
        location.setLatitude(dto.getLocation().getLatitude());
        location.setLongitude(dto.getLocation().getLongitude());
        location.setCity(dto.getLocation().getCity());
        location.setState(dto.getLocation().getState());
        location.setCountry(dto.getLocation().getCountry());
        location.setPincode(dto.getLocation().getPincode());
        contractor.setLocation(location);

        contractor.setServiceAreas(dto.getServiceAreas());
        contractor.setServiceRadius(dto.getServiceRadius());
        contractor.setHomeServiceAvailable(dto.getHomeServiceAvailable());
        contractor.setServiceType(dto.getServiceType());
        contractor.setUpdatedAt(LocalDateTime.now());

        updateProfileCompleteness(contractor);
        log.info("✅ Stage 3 saved for user: {}", userId);

        return contractorRepository.save(contractor);
    }

    // ============ STAGE 4: Portfolio & Trust ============
    public Contractor saveStage4(String userId, ContractorStage4DTO dto) {
        Contractor contractor = getContractorByUserId(userId);

        if (dto.getPortfolio() != null) {
            List<Contractor.PortfolioItem> portfolio = new ArrayList<>();
            for (ContractorStage4DTO.PortfolioItemDTO itemDto : dto.getPortfolio()) {
                Contractor.PortfolioItem item = new Contractor.PortfolioItem();
                item.setTitle(itemDto.getTitle());
                item.setDescription(itemDto.getDescription());
                item.setCategory(itemDto.getCategory());
                item.setImageUrls(itemDto.getImageUrls());
                item.setVideoUrl(itemDto.getVideoUrl());
                item.setDocumentUrl(itemDto.getDocumentUrl());
                item.setProjectLink(itemDto.getProjectLink());
                item.setClientFeedback(itemDto.getClientFeedback());
                item.setLocation(itemDto.getLocation());
                item.setTimeTaken(itemDto.getTimeTaken());
                portfolio.add(item);
            }
            contractor.setPortfolio(portfolio);
        }

        if (dto.getSocialLinks() != null) {
            List<Contractor.SocialLink> socialLinks = new ArrayList<>();
            for (ContractorStage4DTO.SocialLinkDTO linkDto : dto.getSocialLinks()) {
                Contractor.SocialLink link = new Contractor.SocialLink();
                link.setPlatform(linkDto.getPlatform());
                link.setUrl(linkDto.getUrl());
                socialLinks.add(link);
            }
            contractor.setSocialLinks(socialLinks);
        }

        contractor.setShopName(dto.getShopName());
        contractor.setShopAddress(dto.getShopAddress());
        contractor.setShopPhotos(dto.getShopPhotos());
        contractor.setUpdatedAt(LocalDateTime.now());

        updateProfileCompleteness(contractor);
        log.info("✅ Stage 4 saved for user: {}", userId);

        return contractorRepository.save(contractor);
    }

    // ============ STAGE 5: Availability & Submit ============
    public Contractor saveStage5(String userId, ContractorStage5DTO dto) {
        Contractor contractor = getContractorByUserId(userId);

        if (dto.getWeeklySchedule() != null) {
            List<Contractor.WeeklySchedule> schedule = new ArrayList<>();
            for (ContractorStage5DTO.WeeklyScheduleDTO scheduleDto : dto.getWeeklySchedule()) {
                Contractor.WeeklySchedule day = new Contractor.WeeklySchedule();
                day.setDay(scheduleDto.getDay());
                day.setAvailable(scheduleDto.getAvailable());
                day.setStartTime(scheduleDto.getStartTime());
                day.setEndTime(scheduleDto.getEndTime());
                schedule.add(day);
            }
            contractor.setWeeklySchedule(schedule);
        }

        contractor.setTimeSlots(dto.getTimeSlots());
        contractor.setEmergencyAvailability(dto.getEmergencyAvailability());
        contractor.setHolidayWorking(dto.getHolidayWorking());

        if (dto.getBlockedDates() != null) {
            List<Contractor.BlockedDate> blockedDates = new ArrayList<>();
            for (ContractorStage5DTO.BlockedDateDTO blockedDto : dto.getBlockedDates()) {
                Contractor.BlockedDate blocked = new Contractor.BlockedDate();
                blocked.setDate(LocalDateTime.parse(blockedDto.getDate()));
                blocked.setReason(blockedDto.getReason());
                blockedDates.add(blocked);
            }
            contractor.setBlockedDates(blockedDates);
        }

        contractor.setTermsAccepted(dto.getTermsAccepted());
        contractor.setRegistrationComplete(true);
        contractor.setUpdatedAt(LocalDateTime.now());

        updateProfileCompleteness(contractor);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setUserType("CONTRACTOR");
        user.setRole("CONTRACTOR");
        userRepository.save(user);

        log.info("✅ Contractor registration completed for user: {}", userId);

        return contractorRepository.save(contractor);
    }

    // ============ UPDATE PROFILE COMPLETENESS ============
    private void updateProfileCompleteness(Contractor contractor) {
        int completeness = 0;
        int totalFields = 20;

        if (contractor.getFullName() != null) completeness++;
        if (contractor.getPhoneNumber() != null) completeness++;
        if (contractor.getLanguagesSpoken() != null && !contractor.getLanguagesSpoken().isEmpty()) completeness++;
        if (contractor.getAboutMe() != null) completeness++;
        if (contractor.getProfilePhoto() != null) completeness++;
        if (contractor.getPrimaryCategory() != null) completeness++;
        if (contractor.getYearsOfExperience() != null) completeness++;
        if (contractor.getSkillLevel() != null) completeness++;
        if (contractor.getWorkTypes() != null && !contractor.getWorkTypes().isEmpty()) completeness++;
        if (contractor.getPricingType() != null) completeness++;
        if (contractor.getMinimumPrice() != null) completeness++;
        if (contractor.getLocation() != null) completeness++;
        if (contractor.getServiceAreas() != null && !contractor.getServiceAreas().isEmpty()) completeness++;
        if (contractor.getPortfolio() != null && !contractor.getPortfolio().isEmpty()) completeness++;
        if (contractor.getWeeklySchedule() != null && !contractor.getWeeklySchedule().isEmpty()) completeness++;
        if (contractor.getTermsAccepted() != null && contractor.getTermsAccepted()) completeness++;

        int percentage = (int) Math.round((double) completeness / totalFields * 100);
        if (contractor.getStats() == null) {
            contractor.setStats(new Contractor.ContractorStats());
        }
        contractor.getStats().setProfileCompleteness(Math.min(percentage, 100));
    }
}
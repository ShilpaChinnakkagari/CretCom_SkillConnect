package com.skillconnect.services;

import com.skillconnect.models.Story;
import com.skillconnect.models.User;
import com.skillconnect.models.Contractor;
import com.skillconnect.repositories.StoryRepository;
import com.skillconnect.repositories.UserRepository;
import com.skillconnect.repositories.ContractorRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class StoryService {

    private final StoryRepository storyRepository;
    private final UserRepository userRepository;
    private final ContractorRepository contractorRepository;

    public Story createStory(String userId, Story story) {
        log.info("📸 Creating story for user: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        if (!"CONTRACTOR".equals(user.getUserType())) {
            throw new RuntimeException("Only contractors can create stories");
        }

        Contractor contractor = contractorRepository.findByUserId(userId).orElse(null);

        story.setContractorId(userId);
        story.setContractorName(contractor != null ? contractor.getFullName() : user.getName());
        story.setContractorProfilePhoto(contractor != null ? contractor.getProfilePhoto() : user.getProfilePicture());
        
        // ✅ FIX: Use UTC for consistent time
        LocalDateTime now = LocalDateTime.now(ZoneOffset.UTC);
        story.setCreatedAt(now);
        story.setExpiresAt(now.plusHours(24));
        story.setActive(true);

        Story savedStory = storyRepository.save(story);

        if (contractor != null) {
            contractor.setTotalStories(contractor.getTotalStories() + 1);
            contractorRepository.save(contractor);
        }

        log.info("✅ Story created with id: {}, expires at: {}", savedStory.getId(), savedStory.getExpiresAt());
        return savedStory;
    }

    public List<Story> getActiveStoriesByContractor(String contractorId) {
        log.info("📸 Fetching active stories for contractor: {}", contractorId);
        
        LocalDateTime now = LocalDateTime.now(ZoneOffset.UTC);
        return storyRepository.findByContractorIdAndIsActiveTrueAndExpiresAtAfter(
                contractorId, now
        );
    }

    public List<Story> getFeedStories(String userId) {
        log.info("📰 Fetching story feed for user: {}", userId);

        Contractor contractor = contractorRepository.findByUserId(userId).orElse(null);

        List<String> followingIds = new ArrayList<>();
        if (contractor != null && contractor.getFollowing() != null) {
            followingIds = contractor.getFollowing();
        }

        LocalDateTime now = LocalDateTime.now(ZoneOffset.UTC);

        // ✅ FIX: Include the user's own stories in the feed
        List<Story> allStories = new ArrayList<>();

        // 1. Get user's own active stories
        List<Story> ownStories = storyRepository.findByContractorIdAndIsActiveTrueAndExpiresAtAfter(
                userId, now
        );
        allStories.addAll(ownStories);

        // 2. Get stories from followed contractors
        if (!followingIds.isEmpty()) {
            List<Story> followedStories = storyRepository.findByContractorIdInAndIsActiveTrueAndExpiresAtAfterOrderByCreatedAtDesc(
                    followingIds, now
            );
            allStories.addAll(followedStories);
        } else {
            // 3. If not following anyone, get all other active stories (exclude own to avoid duplicates)
            List<Story> otherStories = storyRepository.findByIsActiveTrueAndExpiresAtAfterOrderByCreatedAtDesc(now);
            otherStories = otherStories.stream()
                    .filter(story -> !story.getContractorId().equals(userId))
                    .collect(Collectors.toList());
            allStories.addAll(otherStories);
        }

        // ✅ Remove duplicates and sort by createdAt descending
        List<Story> uniqueStories = allStories.stream()
                .distinct()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .collect(Collectors.toList());

        log.info("📰 Feed stories count: {} (own: {}, followed: {})", 
                uniqueStories.size(), ownStories.size(), followingIds.size());
        
        return uniqueStories;
    }

    public Story getStoryById(String storyId) {
        log.info("📄 Fetching story: {}", storyId);
        return storyRepository.findById(storyId)
                .orElseThrow(() -> new RuntimeException("Story not found"));
    }

    public Story viewStory(String storyId) {
        log.info("👁️ Viewing story: {}", storyId);

        Story story = storyRepository.findById(storyId)
                .orElseThrow(() -> new RuntimeException("Story not found"));

        story.setViews(story.getViews() + 1);
        return storyRepository.save(story);
    }

    public void deleteStory(String storyId, String userId) {
        log.info("🗑️ Deleting story: {} by user: {}", storyId, userId);

        Story story = storyRepository.findById(storyId)
                .orElseThrow(() -> new RuntimeException("Story not found"));

        if (!story.getContractorId().equals(userId)) {
            throw new RuntimeException("You can only delete your own stories");
        }

        story.setActive(false);
        storyRepository.save(story);

        Contractor contractor = contractorRepository.findByUserId(userId).orElse(null);
        if (contractor != null && contractor.getTotalStories() > 0) {
            contractor.setTotalStories(contractor.getTotalStories() - 1);
            contractorRepository.save(contractor);
        }

        log.info("✅ Story deleted successfully");
    }

    @Scheduled(cron = "0 * * * * *") // ✅ Run every minute for testing, change to hourly for production
    public void deleteExpiredStories() {
        log.info("🗑️ Running scheduled job: Deleting expired stories...");
        LocalDateTime now = LocalDateTime.now(ZoneOffset.UTC);
        
        // ✅ Also mark stories as inactive if expired
        List<Story> expiredStories = storyRepository.findByExpiresAtBeforeAndIsActiveTrue(now);
        for (Story story : expiredStories) {
            story.setActive(false);
            storyRepository.save(story);
            log.info("⏰ Story expired and deactivated: {}", story.getId());
        }
        
        // Delete permanently (optional - keep for analytics)
        // storyRepository.deleteByExpiresAtBefore(now);
        
        log.info("✅ Expired stories processed: {}", expiredStories.size());
    }
}
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
import java.util.ArrayList;
import java.util.List;

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

        story.setContractorId(userId);
        story.setCreatedAt(LocalDateTime.now());
        story.setExpiresAt(LocalDateTime.now().plusHours(24));
        story.setActive(true);

        Story savedStory = storyRepository.save(story);

        Contractor contractor = contractorRepository.findByUserId(userId).orElse(null);
        if (contractor != null) {
            contractor.setTotalStories(contractor.getTotalStories() + 1);
            contractorRepository.save(contractor);
        }

        log.info("✅ Story created with id: {}", savedStory.getId());
        return savedStory;
    }

    public List<Story> getActiveStoriesByContractor(String contractorId) {
        log.info("📸 Fetching active stories for contractor: {}", contractorId);
        return storyRepository.findByContractorIdAndIsActiveTrueAndExpiresAtAfter(
                contractorId, LocalDateTime.now()
        );
    }

    public List<Story> getFeedStories(String userId) {
        log.info("📰 Fetching story feed for user: {}", userId);

        Contractor contractor = contractorRepository.findByUserId(userId).orElse(null);

        List<String> followingIds = new ArrayList<>();
        if (contractor != null && contractor.getFollowing() != null) {
            followingIds = contractor.getFollowing();
        }

        if (followingIds.isEmpty()) {
            return storyRepository.findByIsActiveTrueAndExpiresAtAfterOrderByCreatedAtDesc(LocalDateTime.now());
        }

        return storyRepository.findByContractorIdInAndIsActiveTrueAndExpiresAtAfterOrderByCreatedAtDesc(
                followingIds, LocalDateTime.now()
        );
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

    @Scheduled(cron = "0 0 * * * *")
    public void deleteExpiredStories() {
        log.info("🗑️ Running scheduled job: Deleting expired stories...");
        storyRepository.deleteByExpiresAtBefore(LocalDateTime.now());
        log.info("✅ Expired stories deletion completed");
    }
}
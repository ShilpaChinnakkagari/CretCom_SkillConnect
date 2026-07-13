package com.skillconnect.controllers;

import com.skillconnect.models.Story;
import com.skillconnect.services.StoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/stories")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@Slf4j
public class StoryController {

    private final StoryService storyService;

    @PostMapping("/create")
    public ResponseEntity<?> createStory(@RequestBody Story story, HttpSession session) {
        try {
            String userId = (String) session.getAttribute("userId");
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "User not logged in"));
            }

            log.info("📸 Creating story for user: {}", userId);
            Story createdStory = storyService.createStory(userId, story);
            log.info("✅ Story created: {}", createdStory.getId());
            return ResponseEntity.ok(createdStory);
        } catch (Exception e) {
            log.error("Error creating story: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/contractor/{contractorId}")
    public ResponseEntity<?> getStoriesByContractor(@PathVariable String contractorId) {
        try {
            log.info("📸 Fetching stories for contractor: {}", contractorId);
            List<Story> stories = storyService.getActiveStoriesByContractor(contractorId);
            log.info("📸 Found {} stories for contractor {}", stories.size(), contractorId);
            return ResponseEntity.ok(stories);
        } catch (Exception e) {
            log.error("Error fetching stories: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/feed")
    public ResponseEntity<?> getFeedStories(HttpSession session) {
        try {
            String userId = (String) session.getAttribute("userId");
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "User not logged in"));
            }

            List<Story> stories = storyService.getFeedStories(userId);
            log.info("📰 Feed stories: {}", stories.size());
            return ResponseEntity.ok(stories);
        } catch (Exception e) {
            log.error("Error fetching story feed: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{storyId}/view")
    public ResponseEntity<?> viewStory(@PathVariable String storyId) {
        try {
            Story story = storyService.viewStory(storyId);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "views", story.getViews()
            ));
        } catch (Exception e) {
            log.error("Error viewing story: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{storyId}")
    public ResponseEntity<?> deleteStory(@PathVariable String storyId, HttpSession session) {
        try {
            String userId = (String) session.getAttribute("userId");
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "User not logged in"));
            }

            storyService.deleteStory(storyId, userId);
            return ResponseEntity.ok(Map.of("success", true, "message", "Story deleted successfully"));
        } catch (Exception e) {
            log.error("Error deleting story: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
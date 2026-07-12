package com.skillconnect.controllers;

import com.skillconnect.models.Contractor;
import com.skillconnect.services.ContractorService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/contractor")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@Slf4j
public class ContractorController {

    private final ContractorService contractorService;

    // ============ GET PROFILE ============
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@RequestParam String userId) {
        try {
            log.info("Fetching profile for userId: {}", userId);
            
            if (userId == null || userId.isEmpty()) {
                Map<String, String> response = new HashMap<>();
                response.put("error", "userId is required");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
            
            if (!contractorService.contractorExists(userId)) {
                log.info("No contractor profile found for userId: {}", userId);
                Map<String, String> response = new HashMap<>();
                response.put("error", "Contractor profile not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
            
            Contractor contractor = contractorService.getContractorByUserId(userId);
            log.info("Profile found for userId: {}", userId);
            return ResponseEntity.ok(contractor);
            
        } catch (Exception e) {
            log.error("Error in getProfile: {}", e.getMessage(), e);
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // ============ SAVE STAGE DATA ============
    @PostMapping("/register/stage")
    public ResponseEntity<?> saveStageData(@RequestBody Map<String, Object> stageData) {
        try {
            log.info("📝 Saving stage data");
            
            String userId = (String) stageData.get("userId");
            if (userId == null || userId.isEmpty()) {
                Map<String, String> response = new HashMap<>();
                response.put("error", "userId is required");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
            
            Integer stage = (Integer) stageData.get("stage");
            if (stage == null || stage < 1 || stage > 5) {
                Map<String, String> response = new HashMap<>();
                response.put("error", "Valid stage number (1-5) is required");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
            
            Contractor contractor = contractorService.saveStageData(userId, stage, stageData);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Stage " + stage + " saved successfully");
            response.put("stage", contractor.getCurrentRegistrationStage());
            response.put("registrationComplete", contractor.getRegistrationComplete());
            
            log.info("✅ Stage {} saved for userId: {}", stage, userId);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error saving stage data: {}", e.getMessage(), e);
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // ============ GET REGISTRATION STAGE ============
    @GetMapping("/profile/stage")
    public ResponseEntity<?> getRegistrationStage(@RequestParam String userId) {
        try {
            log.info("📊 Getting registration stage for userId: {}", userId);
            
            if (userId == null || userId.isEmpty()) {
                Map<String, String> response = new HashMap<>();
                response.put("error", "userId is required");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
            
            Map<String, Object> response = new HashMap<>();
            
            if (!contractorService.contractorExists(userId)) {
                response.put("exists", false);
                response.put("stage", 1);
                response.put("registrationComplete", false);
            } else {
                Contractor contractor = contractorService.getContractorByUserId(userId);
                response.put("exists", true);
                response.put("stage", contractor.getCurrentRegistrationStage() != null ? contractor.getCurrentRegistrationStage() : 1);
                response.put("registrationComplete", contractor.getRegistrationComplete());
                response.put("contractor", contractor);
            }
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error getting registration stage: {}", e.getMessage(), e);
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // ============ COMPLETE REGISTRATION ============
    @PostMapping("/register/complete")
    public ResponseEntity<?> completeRegistration(@RequestBody Map<String, Object> allData) {
        try {
            log.info("Received registration data");
            
            String userId = (String) allData.get("userId");
            if (userId == null || userId.isEmpty()) {
                log.error("userId is missing from request");
                Map<String, String> response = new HashMap<>();
                response.put("error", "userId is required");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
            
            log.info("Completing registration for userId: {}", userId);
            
            Contractor contractor = contractorService.saveCompleteRegistration(userId, allData);
            contractorService.updateUserRole(userId);
            
            log.info("✅ Registration completed successfully for userId: {}", userId);
            return ResponseEntity.ok(contractor);
            
        } catch (Exception e) {
            log.error("Error completing registration: {}", e.getMessage(), e);
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // ============ GET FULL PROFILE ============
    @GetMapping("/profile/full/{contractorId}")
    public ResponseEntity<?> getFullProfile(@PathVariable String contractorId) {
        try {
            log.info("📄 Fetching full profile for contractor: {}", contractorId);
            Map<String, Object> profile = contractorService.getContractorFullProfile(contractorId);
            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            log.error("Error fetching full profile: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ============ FOLLOW CONTRACTOR ============
    @PostMapping("/follow/{contractorUserId}")
    public ResponseEntity<?> followContractor(@PathVariable String contractorUserId, HttpSession session) {
        try {
            String userId = (String) session.getAttribute("userId");
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "User not logged in"));
            }

            if (userId.equals(contractorUserId)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "You cannot follow yourself"));
            }

            Contractor contractor = contractorService.followContractor(userId, contractorUserId);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Followed successfully",
                    "followersCount", contractor.getFollowersCount()
            ));
        } catch (Exception e) {
            log.error("Error following contractor: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ============ UNFOLLOW CONTRACTOR ============
    @PostMapping("/unfollow/{contractorUserId}")
    public ResponseEntity<?> unfollowContractor(@PathVariable String contractorUserId, HttpSession session) {
        try {
            String userId = (String) session.getAttribute("userId");
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "User not logged in"));
            }

            Contractor contractor = contractorService.unfollowContractor(userId, contractorUserId);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Unfollowed successfully",
                    "followersCount", contractor.getFollowersCount()
            ));
        } catch (Exception e) {
            log.error("Error unfollowing contractor: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ============ CHECK IF FOLLOWING ============
    @GetMapping("/is-following/{contractorUserId}")
    public ResponseEntity<?> isFollowing(@PathVariable String contractorUserId, HttpSession session) {
        try {
            String userId = (String) session.getAttribute("userId");
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "User not logged in"));
            }

            boolean isFollowing = contractorService.isFollowing(userId, contractorUserId);
            return ResponseEntity.ok(Map.of("isFollowing", isFollowing));
        } catch (Exception e) {
            log.error("Error checking follow status: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ============ RECOMMENDED CONTRACTORS ============
    @GetMapping("/recommended")
    public ResponseEntity<?> getRecommendedContractors(HttpSession session) {
        try {
            String userId = (String) session.getAttribute("userId");
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "User not logged in"));
            }

            List<Contractor> recommended = contractorService.getRecommendedContractors(userId);
            return ResponseEntity.ok(recommended);
        } catch (Exception e) {
            log.error("Error getting recommended contractors: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
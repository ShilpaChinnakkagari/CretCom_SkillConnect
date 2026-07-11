package com.skillconnect.controllers;

import com.skillconnect.models.Contractor;
import com.skillconnect.services.ContractorService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/contractor")  // ✅ CHANGED: Removed /api
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@Slf4j
public class ContractorController {

    private final ContractorService contractorService;

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
}
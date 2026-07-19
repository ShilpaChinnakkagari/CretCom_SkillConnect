package com.skillconnect.controllers;

import com.skillconnect.models.User;
import com.skillconnect.services.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/customer")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@Slf4j
public class UserController {

    private final UserService userService;

    // ===== GET CUSTOMER PROFILE =====
    @GetMapping("/profile")
    public ResponseEntity<?> getCustomerProfile(HttpSession session) {
        try {
            String userId = (String) session.getAttribute("userId");
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "User not logged in"));
            }

            log.info("📄 Fetching customer profile for userId: {}", userId);
            User user = userService.getUserById(userId);
            return ResponseEntity.ok(user);

        } catch (Exception e) {
            log.error("Error fetching customer profile: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ===== UPDATE CUSTOMER PROFILE =====
    @PutMapping("/profile")
    public ResponseEntity<?> updateCustomerProfile(@RequestBody Map<String, Object> request, HttpSession session) {
        try {
            String userId = (String) session.getAttribute("userId");
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "User not logged in"));
            }

            log.info("📝 Updating customer profile for userId: {}", userId);

            String name = (String) request.get("name");
            String phoneNumber = (String) request.get("phoneNumber");
            String location = (String) request.get("location");
            
            @SuppressWarnings("unchecked")
            List<String> languages = (List<String>) request.get("languages");
            
            @SuppressWarnings("unchecked")
            Map<String, Object> preferences = (Map<String, Object>) request.get("preferences");

            User updatedUser = userService.updateCustomerProfile(
                    userId, name, phoneNumber, location, languages, preferences
            );
            
            return ResponseEntity.ok(updatedUser);

        } catch (Exception e) {
            log.error("Error updating customer profile: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
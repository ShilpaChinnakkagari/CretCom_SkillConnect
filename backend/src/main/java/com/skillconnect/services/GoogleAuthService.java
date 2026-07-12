package com.skillconnect.services;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import com.skillconnect.dto.AuthResponse;
import com.skillconnect.dto.GoogleAuthRequest;
import com.skillconnect.models.User;
import com.skillconnect.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class GoogleAuthService {

    private final UserRepository userRepository;

    public AuthResponse authenticateWithGoogle(GoogleAuthRequest request) {
        log.info("🔐 Authenticating with Google");

        try {
            String idToken = request.getIdToken();  // ✅ FIXED: getIdToken()
            
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);
            String email = decodedToken.getEmail();
            String name = decodedToken.getName();
            String picture = decodedToken.getPicture();

            log.info("✅ Google user verified: {}", email);

            // Check if user exists
            User user = userRepository.findByEmail(email).orElse(null);
            boolean isNewUser = false;

            if (user == null) {
                // Create new user
                user = new User();
                user.setEmail(email);
                user.setName(name);
                user.setProfilePicture(picture);
                user.setAuthProvider("GOOGLE");
                user.setIsVerified(true);
                user.setIsActive(true);
                user.setCreatedAt(LocalDateTime.now());
                user.setUpdatedAt(LocalDateTime.now());
                user.setUserType(request.getUserType() != null ? request.getUserType() : "CUSTOMER");
                user.setRole(request.getUserType() != null ? request.getUserType() : "CUSTOMER");
                userRepository.save(user);
                isNewUser = true;
                log.info("✅ New user created via Google: {}", email);
            } else {
                // Update existing user
                user.setName(name);
                user.setProfilePicture(picture);
                user.setUpdatedAt(LocalDateTime.now());
                user.setLastLogin(LocalDateTime.now());
                userRepository.save(user);
                log.info("✅ User updated via Google: {}", email);
            }

            // Build response
            AuthResponse response = new AuthResponse();
            response.setUserId(user.getId());
            response.setEmail(user.getEmail());
            response.setName(user.getName());
            response.setUserType(user.getUserType());
            response.setRole(user.getRole());
            response.setProfilePicture(user.getProfilePicture());
            response.setNewUser(isNewUser);

            log.info("✅ Google authentication successful for: {}", email);
            return response;

        } catch (Exception e) {
            log.error("❌ Google authentication failed: {}", e.getMessage());
            throw new RuntimeException("Google authentication failed: " + e.getMessage());
        }
    }
}
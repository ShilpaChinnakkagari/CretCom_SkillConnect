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
        try {
            FirebaseToken decodedToken = FirebaseAuth.getInstance()
                    .verifyIdToken(request.getIdToken());

            String email = decodedToken.getEmail();
            String name = decodedToken.getName();
            String picture = decodedToken.getPicture();
            boolean emailVerified = decodedToken.isEmailVerified();

            log.info("Google user: email={}, name={}", email, name);

            User user = userRepository.findByEmail(email).orElse(null);
            boolean isNewUser = false;

            if (user == null) {
                user = new User();
                user.setEmail(email);
                user.setName(name);
                user.setProfilePicture(picture);
                user.setAuthProvider("GOOGLE");
                user.setVerified(emailVerified);
                user.setActive(true);
                user.setCreatedAt(LocalDateTime.now());
                user.setUpdatedAt(LocalDateTime.now());

                user = userRepository.save(user);
                isNewUser = true;
                log.info("✅ New user registered via Firebase Google: {}", email);
            } else {
                if (user.getProfilePicture() == null && picture != null) {
                    user.setProfilePicture(picture);
                }
                user.setLastLogin(LocalDateTime.now());
                user = userRepository.save(user);
                log.info("✅ User logged in via Firebase Google: {}", email);
            }

            AuthResponse response = new AuthResponse();
            response.setUserId(user.getId());
            response.setEmail(user.getEmail());
            response.setName(user.getName());
            response.setUserType(user.getUserType());
            response.setProfilePicture(user.getProfilePicture());
            response.setNewUser(isNewUser);

            log.info("✅ Returning userId: {}", user.getId());

            return response;

        } catch (Exception e) {
            log.error("❌ Google authentication failed: {}", e.getMessage());
            throw new RuntimeException("Google authentication failed: " + e.getMessage());
        }
    }
}
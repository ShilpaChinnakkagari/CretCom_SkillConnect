package com.skillconnect.services;

import com.skillconnect.dto.AuthResponse;
import com.skillconnect.dto.LoginRequest;
import com.skillconnect.dto.RegisterRequest;
import com.skillconnect.models.User;
import com.skillconnect.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // ===== REGISTER =====
    public AuthResponse register(RegisterRequest request) {
        log.info("📝 Registering new user: {}", request.getEmail());

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setName(request.getName());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setUserType(null); // No role yet - will be set during onboarding
        user.setRole(null);
        user.setActive(true);
        user.setVerified(false);
        user.setAuthProvider("LOCAL");
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        User savedUser = userRepository.save(user);
        log.info("✅ User registered successfully: {}", savedUser.getEmail());

        AuthResponse response = new AuthResponse();
        response.setUserId(savedUser.getId());
        response.setEmail(savedUser.getEmail());
        response.setName(savedUser.getName());
        response.setUserType(savedUser.getUserType());
        response.setRole(savedUser.getRole());
        response.setProfilePicture(savedUser.getProfilePicture());
        response.setNewUser(true);

        return response;
    }

    // ===== LOGIN =====
    public AuthResponse login(LoginRequest request) {
        log.info("🔐 Login attempt: {}", request.getEmail());

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        if (!user.isActive()) {
            throw new RuntimeException("Account is disabled");
        }

        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        log.info("✅ User logged in: {}", user.getEmail());

        AuthResponse response = new AuthResponse();
        response.setUserId(user.getId());
        response.setEmail(user.getEmail());
        response.setName(user.getName());
        response.setUserType(user.getUserType());
        response.setRole(user.getRole());
        response.setProfilePicture(user.getProfilePicture());
        response.setNewUser(false);

        return response;
    }

    // ===== UPDATE USER ROLE =====
    public User updateUserRole(String userId, String userType) {
        log.info("📝 Updating user role: {} -> {}", userId, userType);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setUserType(userType);
        user.setRole(userType);
        user.setUpdatedAt(LocalDateTime.now());

        User updatedUser = userRepository.save(user);
        log.info("✅ User role updated to: {}", userType);
        return updatedUser;
    }

    // ===== GET USER BY ID =====
    public User getUserById(String userId) {
        log.info("📄 Fetching user by id: {}", userId);
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
    }

    // ===== GET USER BY EMAIL =====
    public User getUserByEmail(String email) {
        log.info("📄 Fetching user by email: {}", email);
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }

    // ===== CHECK IF EMAIL EXISTS =====
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    // ===== UPDATE CUSTOMER PROFILE =====
    public User updateCustomerProfile(String userId, String name, String phoneNumber, 
                                       String location, List<String> languages, 
                                       Map<String, Object> preferences) {
        log.info("📝 Updating customer profile for userId: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (name != null && !name.isEmpty()) {
            user.setName(name);
        }
        if (phoneNumber != null && !phoneNumber.isEmpty()) {
            user.setPhoneNumber(phoneNumber);
        }
        if (location != null && !location.isEmpty()) {
            user.setLocation(location);
        }
        if (languages != null) {
            user.setLanguages(languages);
        }
        if (preferences != null) {
            user.setPreferences(preferences);
        }

        user.setUpdatedAt(LocalDateTime.now());

        User updatedUser = userRepository.save(user);
        log.info("✅ Customer profile updated for userId: {}", userId);
        return updatedUser;
    }
}
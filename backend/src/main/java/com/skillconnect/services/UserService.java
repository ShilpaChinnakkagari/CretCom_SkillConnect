package com.skillconnect.services;

import com.skillconnect.dto.AuthResponse;
import com.skillconnect.dto.LoginRequest;
import com.skillconnect.dto.RegisterRequest;
import com.skillconnect.models.User;
import com.skillconnect.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // ===== REGISTER =====
    public AuthResponse register(RegisterRequest request) {
        log.info("📝 Registering user: {}", request.getEmail());

        // Check if user exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("User already exists with email: " + request.getEmail());
        }

        // Create user
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPhoneNumber(request.getPhoneNumber());  // ✅ FIXED: phoneNumber
        user.setName(request.getName());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setUserType(request.getUserType() != null ? request.getUserType() : "CUSTOMER");
        user.setRole(request.getUserType() != null ? request.getUserType() : "CUSTOMER");
        user.setAuthProvider("LOCAL");
        user.setIsActive(true);
        user.setIsVerified(false);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        User savedUser = userRepository.save(user);
        log.info("✅ User registered: {}", savedUser.getEmail());

        // Build response
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
        log.info("🔐 User login: {}", request.getEmail());

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found with email: " + request.getEmail()));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        if (!user.getIsActive()) {
            throw new RuntimeException("Account is deactivated");
        }

        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

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

    // ===== UPDATE USER ROLE =====
    public User updateUserRole(String userId, String userType) {
        log.info("📝 Updating user role: {} -> {}", userId, userType);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setUserType(userType);
        user.setRole(userType);
        user.setUpdatedAt(LocalDateTime.now());

        return userRepository.save(user);
    }

    // ===== UPDATE USER =====
    public User updateUser(User user) {
        log.info("📝 Updating user: {}", user.getId());
        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    // ===== DELETE USER =====
    public void deleteUser(String userId) {
        log.info("🗑️ Deleting user: {}", userId);
        userRepository.deleteById(userId);
    }

    // ===== GET USER BY EMAIL (for internal use) =====
    public User findUserByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }
}
package com.skillconnect.controllers;

import com.skillconnect.dto.AuthResponse;
import com.skillconnect.dto.GoogleAuthRequest;
import com.skillconnect.dto.LoginRequest;
import com.skillconnect.dto.RegisterRequest;
import com.skillconnect.models.User;
import com.skillconnect.services.GoogleAuthService;
import com.skillconnect.services.UserService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AuthController {

    private final UserService userService;
    private final GoogleAuthService googleAuthService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request, HttpSession session) {
        AuthResponse response = userService.register(request);
        session.setAttribute("userId", response.getUserId());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request, HttpSession session) {
        AuthResponse response = userService.login(request);
        session.setAttribute("userId", response.getUserId());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/google")
    public ResponseEntity<AuthResponse> googleAuth(@RequestBody GoogleAuthRequest request, HttpSession session) {
        AuthResponse response = googleAuthService.authenticateWithGoogle(request);
        session.setAttribute("userId", response.getUserId());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/users/role")
    public ResponseEntity<User> updateUserRole(
            HttpSession session,
            @RequestBody Map<String, String> request) {

        String userId = (String) session.getAttribute("userId");
        if (userId == null) {
            throw new RuntimeException("User not logged in");
        }

        String userType = request.get("userType");
        User user = userService.updateUserRole(userId, userType);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(HttpSession session) {
        String userId = (String) session.getAttribute("userId");
        if (userId == null) {
            throw new RuntimeException("User not logged in");
        }
        User user = userService.getUserById(userId);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok("Logged out successfully");
    }
}
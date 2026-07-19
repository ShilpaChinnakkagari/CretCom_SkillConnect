package com.skillconnect.models;

import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Document(collection = "users")
@Data
public class User {

    @Id
    private String id;

    @Indexed(unique = true)
    private String email;

    private String name;
    private String password;
    private String profilePicture;

    // ✅ ADDED: Customer profile fields
    private String phoneNumber;
    private String location;
    private List<String> languages = new ArrayList<>();
    private Map<String, Object> preferences = new HashMap<>();

    private String userType; // CUSTOMER, CONTRACTOR, ADMIN
    private String role;
    private boolean isActive = true;
    private boolean isVerified = false;
    private String authProvider; // GOOGLE, LOCAL

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    // ===== GETTERS =====
    public String getId() { return id; }
    public String getEmail() { return email; }
    public String getName() { return name; }
    public String getPassword() { return password; }
    public String getProfilePicture() { return profilePicture; }
    public String getPhoneNumber() { return phoneNumber; }
    public String getLocation() { return location; }
    public List<String> getLanguages() { return languages; }
    public Map<String, Object> getPreferences() { return preferences; }
    public String getUserType() { return userType; }
    public String getRole() { return role; }
    public boolean isActive() { return isActive; }
    public boolean isVerified() { return isVerified; }
    public String getAuthProvider() { return authProvider; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    // ===== SETTERS =====
    public void setId(String id) { this.id = id; }
    public void setEmail(String email) { this.email = email; }
    public void setName(String name) { this.name = name; }
    public void setPassword(String password) { this.password = password; }
    public void setProfilePicture(String profilePicture) { this.profilePicture = profilePicture; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    public void setLocation(String location) { this.location = location; }
    public void setLanguages(List<String> languages) { this.languages = languages; }
    public void setPreferences(Map<String, Object> preferences) { this.preferences = preferences; }
    public void setUserType(String userType) { this.userType = userType; }
    public void setRole(String role) { this.role = role; }
    public void setActive(boolean active) { isActive = active; }
    public void setVerified(boolean verified) { isVerified = verified; }
    public void setAuthProvider(String authProvider) { this.authProvider = authProvider; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
package com.skillconnect.dto;

import lombok.Data;

@Data
public class AuthResponse {
    private String userId;
    private String email;
    private String name;
    private String userType;
    private String role;
    private String profilePicture;
    private boolean isNewUser;

    // ===== MANUAL GETTERS =====
    public String getUserId() { return userId; }
    public String getEmail() { return email; }
    public String getName() { return name; }
    public String getUserType() { return userType; }
    public String getRole() { return role; }
    public String getProfilePicture() { return profilePicture; }
    public boolean isNewUser() { return isNewUser; }

    // ===== MANUAL SETTERS =====
    public void setUserId(String userId) { this.userId = userId; }
    public void setEmail(String email) { this.email = email; }
    public void setName(String name) { this.name = name; }
    public void setUserType(String userType) { this.userType = userType; }
    public void setRole(String role) { this.role = role; }
    public void setProfilePicture(String profilePicture) { this.profilePicture = profilePicture; }
    public void setNewUser(boolean newUser) { isNewUser = newUser; }
}
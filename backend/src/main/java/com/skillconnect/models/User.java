package com.skillconnect.models;

import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "users")
@Data
public class User {

    @Id
    private String id;

    @Indexed(unique = true)
    private String email;

    private String password;
    private String name;
    private String phoneNumber;
    private String profilePicture;

    // ROLE: CUSTOMER, CONTRACTOR, ADMIN
    private String role;
    private String userType;

    private Boolean isActive = true;
    private Boolean isVerified = false;
    private String authProvider; // GOOGLE, LOCAL

    // ============ GETTERS & SETTERS ============
    // Lombok @Data handles all getters/setters

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
    private LocalDateTime lastLogin;

    // Manual getters for fields used in other files
    public String getId() { return id; }
    public String getEmail() { return email; }
    public String getName() { return name; }
    public String getUserType() { return userType; }
    public String getRole() { return role; }
    public String getPhoneNumber() { return phoneNumber; }
    public String getProfilePicture() { return profilePicture; }
    public Boolean getIsActive() { return isActive; }
    public Boolean getIsVerified() { return isVerified; }
    public String getPassword() { return password; }
    public String getAuthProvider() { return authProvider; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public LocalDateTime getLastLogin() { return lastLogin; }

    public void setId(String id) { this.id = id; }
    public void setEmail(String email) { this.email = email; }
    public void setName(String name) { this.name = name; }
    public void setUserType(String userType) { this.userType = userType; }
    public void setRole(String role) { this.role = role; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    public void setProfilePicture(String profilePicture) { this.profilePicture = profilePicture; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    public void setIsVerified(Boolean isVerified) { this.isVerified = isVerified; }
    public void setPassword(String password) { this.password = password; }
    public void setAuthProvider(String authProvider) { this.authProvider = authProvider; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public void setLastLogin(LocalDateTime lastLogin) { this.lastLogin = lastLogin; }
}
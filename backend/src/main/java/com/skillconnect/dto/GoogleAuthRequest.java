package com.skillconnect.dto;

import lombok.Data;

@Data
public class GoogleAuthRequest {
    private String idToken;
    private String userType;

    // ===== MANUAL GETTERS =====
    public String getIdToken() { return idToken; }
    public String getUserType() { return userType; }

    // ===== MANUAL SETTERS =====
    public void setIdToken(String idToken) { this.idToken = idToken; }
    public void setUserType(String userType) { this.userType = userType; }
}
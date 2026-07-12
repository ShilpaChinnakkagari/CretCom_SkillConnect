package com.skillconnect.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;

    // ===== MANUAL GETTERS =====
    public String getEmail() { return email; }
    public String getPassword() { return password; }

    // ===== MANUAL SETTERS =====
    public void setEmail(String email) { this.email = email; }
    public void setPassword(String password) { this.password = password; }
}
package com.skillconnect.dto;

import lombok.Data;

@Data
public class AuthResponse {
    private String userId;
    private String email;
    private String name;
    private String userType;
    private String role;
    private boolean isNewUser;
    private String profilePicture;
}
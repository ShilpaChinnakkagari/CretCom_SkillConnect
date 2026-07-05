package com.skillconnect.dto;

import lombok.Data;

@Data
public class GoogleAuthRequest {
    private String idToken;
    private String userType; // CUSTOMER, PROVIDER
}
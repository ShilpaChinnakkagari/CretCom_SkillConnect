package com.skillconnect.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class ContractorStage1DTO {

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Phone number is required")
    @Size(min = 10, max = 15)
    private String phoneNumber;

    private String whatsappNumber;

    @NotNull(message = "Languages spoken is required")
    private List<String> languagesSpoken;

    @NotBlank(message = "About me is required")
    @Size(min = 20, max = 500, message = "About me must be between 20 and 500 characters")
    private String aboutMe;

    private String preferredContact; // CALL, WHATSAPP, IN_APP_CHAT

    private String profilePhoto; // Cloudinary URL
}
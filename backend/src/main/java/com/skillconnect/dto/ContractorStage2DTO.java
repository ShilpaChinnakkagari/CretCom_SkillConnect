package com.skillconnect.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class ContractorStage2DTO {

    @NotBlank(message = "Primary category is required")
    private String primaryCategory;

    private List<String> secondarySkills;

    @NotNull(message = "Years of experience is required")
    private Integer yearsOfExperience;

    @NotBlank(message = "Skill level is required")
    private String skillLevel; // BEGINNER, INTERMEDIATE, EXPERT

    private List<String> workTypes; // RESIDENTIAL, COMMERCIAL, INDUSTRIAL

    private List<String> specializations;

    private String teamSize; // SOLO, SMALL_TEAM, COMPANY

    private String idType; // AADHAAR, PAN, DRIVING_LICENSE

    private String idNumber;

    private String idProofUrl;
}
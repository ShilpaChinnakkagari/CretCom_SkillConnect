package com.skillconnect.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class ContractorStage3DTO {

    @NotBlank(message = "Pricing type is required")
    private String pricingType; // FIXED, HOURLY, PER_PROJECT, NEGOTIABLE

    private Double baseServiceCharge;

    @NotNull(message = "Minimum price is required")
    private Double minimumPrice;

    private Double maximumPrice;

    private Double emergencyCharge;

    private Boolean priceNegotiable;

    @NotNull(message = "Location is required")
    private LocationDTO location;

    @NotNull(message = "Service areas are required")
    private List<String> serviceAreas;

    private Integer serviceRadius;

    private Boolean homeServiceAvailable;

    private String serviceType; // ONSITE, OFFSITE, BOTH

    @Data
    public static class LocationDTO {
        private String address;
        private Double latitude;
        private Double longitude;
        private String city;
        private String state;
        private String country;
        private String pincode;
    }
}
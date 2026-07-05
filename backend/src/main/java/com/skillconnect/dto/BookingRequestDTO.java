package com.skillconnect.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BookingRequestDTO {

    @NotBlank(message = "Contractor ID is required")
    private String contractorId;

    @NotBlank(message = "Date is required")
    private String date;

    @NotBlank(message = "Time is required")
    private String time;

    @NotBlank(message = "Address is required")
    private String address;

    private String description;

    @NotNull(message = "Budget is required")
    private Double budget;
}
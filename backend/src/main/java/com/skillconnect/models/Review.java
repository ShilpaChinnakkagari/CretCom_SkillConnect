package com.skillconnect.models;

import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "reviews")
@Data
public class Review {

    @Id
    private String id;

    private String contractorId;
    private String customerId;
    private String bookingId;

    private String customerName;
    private String customerProfilePhoto;
    private String comment;
    private double rating; // 1.0 - 5.0

    private List<String> images = new ArrayList<>();

    @CreatedDate
    private LocalDateTime createdAt;

    // Response from contractor
    private String contractorResponse;
    private LocalDateTime responseAt;
}
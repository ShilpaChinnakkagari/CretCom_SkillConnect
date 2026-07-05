package com.skillconnect.models;

import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "bookings")
@Data
public class Booking {

    @Id
    private String id;

    private String customerId;
    private String customerName;
    private String contractorId;
    private String contractorName;
    private String serviceCategory;

    private String date;
    private String time;
    private String address;
    private String description;
    private Double budget;

    private String status;

    @CreatedDate
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public Booking() {
        this.status = "PENDING";
    }
}
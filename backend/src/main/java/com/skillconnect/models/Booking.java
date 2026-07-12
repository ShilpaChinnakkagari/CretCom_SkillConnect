package com.skillconnect.models;

import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "bookings")
@Data
public class Booking {

    @Id
    private String id;

    private String customerId;
    private String customerName;
    private String contractorId;
    private String contractorName;
    private String contractorCategory;

    private String service;
    private String description;
    private LocalDateTime date;
    private String location;
    private Double budget;
    private List<String> images = new ArrayList<>();

    private String status; // PENDING, ACCEPTED, REJECTED, COMPLETED, CANCELLED

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    // ============ GETTERS & SETTERS ============
    public String getId() { return id; }
    public String getCustomerId() { return customerId; }
    public String getCustomerName() { return customerName; }
    public String getContractorId() { return contractorId; }
    public String getContractorName() { return contractorName; }
    public String getContractorCategory() { return contractorCategory; }
    public String getService() { return service; }
    public String getDescription() { return description; }
    public LocalDateTime getDate() { return date; }
    public String getLocation() { return location; }
    public Double getBudget() { return budget; }
    public List<String> getImages() { return images; }
    public String getStatus() { return status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    public void setId(String id) { this.id = id; }
    public void setCustomerId(String customerId) { this.customerId = customerId; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public void setContractorId(String contractorId) { this.contractorId = contractorId; }
    public void setContractorName(String contractorName) { this.contractorName = contractorName; }
    public void setContractorCategory(String contractorCategory) { this.contractorCategory = contractorCategory; }
    public void setService(String service) { this.service = service; }
    public void setDescription(String description) { this.description = description; }
    public void setDate(LocalDateTime date) { this.date = date; }
    public void setLocation(String location) { this.location = location; }
    public void setBudget(Double budget) { this.budget = budget; }
    public void setImages(List<String> images) { this.images = images; }
    public void setStatus(String status) { this.status = status; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
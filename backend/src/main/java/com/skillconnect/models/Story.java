package com.skillconnect.models;

import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Document(collection = "stories")
@Data
public class Story {

    @Id
    private String id;

    private String contractorId;
    private String contractorName;
    private String contractorProfilePhoto;

    // Story Types: PHOTO, VIDEO
    private String type;
    private String mediaUrl;
    private String caption;

    private LocalDateTime expiresAt;
    private int views = 0;
    private boolean isActive = true;

    @CreatedDate
    private LocalDateTime createdAt;

    public boolean isExpired() {
        // ✅ FIX: Use UTC for consistent comparison
        LocalDateTime now = LocalDateTime.now(ZoneOffset.UTC);
        return now.isAfter(expiresAt) || !isActive;
    }

    public boolean isActiveAndValid() {
        LocalDateTime now = LocalDateTime.now(ZoneOffset.UTC);
        return isActive && now.isBefore(expiresAt);
    }

    // ===== GETTERS & SETTERS =====
    public String getId() { return id; }
    public String getContractorId() { return contractorId; }
    public String getContractorName() { return contractorName; }
    public String getContractorProfilePhoto() { return contractorProfilePhoto; }
    public String getType() { return type; }
    public String getMediaUrl() { return mediaUrl; }
    public String getCaption() { return caption; }
    public LocalDateTime getExpiresAt() { return expiresAt; }
    public int getViews() { return views; }
    public boolean isActive() { return isActive; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setId(String id) { this.id = id; }
    public void setContractorId(String contractorId) { this.contractorId = contractorId; }
    public void setContractorName(String contractorName) { this.contractorName = contractorName; }
    public void setContractorProfilePhoto(String contractorProfilePhoto) { this.contractorProfilePhoto = contractorProfilePhoto; }
    public void setType(String type) { this.type = type; }
    public void setMediaUrl(String mediaUrl) { this.mediaUrl = mediaUrl; }
    public void setCaption(String caption) { this.caption = caption; }
    public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }
    public void setViews(int views) { this.views = views; }
    public void setActive(boolean active) { isActive = active; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
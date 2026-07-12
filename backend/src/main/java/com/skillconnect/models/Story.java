package com.skillconnect.models;

import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "stories")
@Data
public class Story {

    @Id
    private String id;

    private String contractorId;

    // Story Types: PHOTO, VIDEO
    private String type;

    private String mediaUrl;
    private String caption;

    // Auto-expires after 24 hours
    private LocalDateTime expiresAt;

    private int views = 0;
    private boolean isActive = true;

    @CreatedDate
    private LocalDateTime createdAt;

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiresAt);
    }
}
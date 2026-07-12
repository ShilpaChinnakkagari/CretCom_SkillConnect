package com.skillconnect.models;

import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "posts")
@Data
public class Post {

    @Id
    private String id;

    private String contractorId;
    private String type; // PROJECT_SHOWCASE, ACHIEVEMENT, EDUCATIONAL, OFFER

    private String title;
    private String description;
    private List<String> images = new ArrayList<>();
    private String videoUrl;
    private String location;
    private String category;
    private Double budget;

    private int likes = 0;
    private List<Comment> comments = new ArrayList<>();
    private int views = 0;

    private boolean isActive = true;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    // ============ GETTERS & SETTERS ============
    public String getId() { return id; }
    public String getContractorId() { return contractorId; }
    public String getType() { return type; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public List<String> getImages() { return images; }
    public String getVideoUrl() { return videoUrl; }
    public String getLocation() { return location; }
    public String getCategory() { return category; }
    public Double getBudget() { return budget; }
    public int getLikes() { return likes; }
    public List<Comment> getComments() { return comments; }
    public int getViews() { return views; }
    public boolean isActive() { return isActive; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    public void setId(String id) { this.id = id; }
    public void setContractorId(String contractorId) { this.contractorId = contractorId; }
    public void setType(String type) { this.type = type; }
    public void setTitle(String title) { this.title = title; }
    public void setDescription(String description) { this.description = description; }
    public void setImages(List<String> images) { this.images = images; }
    public void setVideoUrl(String videoUrl) { this.videoUrl = videoUrl; }
    public void setLocation(String location) { this.location = location; }
    public void setCategory(String category) { this.category = category; }
    public void setBudget(Double budget) { this.budget = budget; }
    public void setLikes(int likes) { this.likes = likes; }
    public void setComments(List<Comment> comments) { this.comments = comments; }
    public void setViews(int views) { this.views = views; }
    public void setActive(boolean active) { isActive = active; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    @Data
    public static class Comment {
        private String userId;
        private String userName;
        private String userProfilePhoto;
        private String text;
        private LocalDateTime createdAt = LocalDateTime.now();

        public String getUserId() { return userId; }
        public String getUserName() { return userName; }
        public String getUserProfilePhoto() { return userProfilePhoto; }
        public String getText() { return text; }
        public LocalDateTime getCreatedAt() { return createdAt; }

        public void setUserId(String userId) { this.userId = userId; }
        public void setUserName(String userName) { this.userName = userName; }
        public void setUserProfilePhoto(String userProfilePhoto) { this.userProfilePhoto = userProfilePhoto; }
        public void setText(String text) { this.text = text; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    }
}
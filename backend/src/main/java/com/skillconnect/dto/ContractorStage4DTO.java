package com.skillconnect.dto;

import lombok.Data;

import java.util.List;

@Data
public class ContractorStage4DTO {

    private List<PortfolioItemDTO> portfolio;

    private List<SocialLinkDTO> socialLinks;

    private String shopName;

    private String shopAddress;

    private List<String> shopPhotos;

    @Data
    public static class PortfolioItemDTO {
        private String title;
        private String description;
        private String category; // BEFORE, AFTER, ONGOING, COMPLETED
        private List<String> imageUrls;
        private String videoUrl;
        private String documentUrl;
        private String projectLink;
        private String clientFeedback;
        private String location;
        private String timeTaken;
    }

    @Data
    public static class SocialLinkDTO {
        private String platform; // INSTAGRAM, YOUTUBE, FACEBOOK, LINKEDIN
        private String url;
    }
}
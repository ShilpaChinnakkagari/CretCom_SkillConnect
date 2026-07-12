package com.skillconnect.services;

import com.skillconnect.models.Post;
import com.skillconnect.models.User;
import com.skillconnect.models.Contractor;
import com.skillconnect.repositories.PostRepository;
import com.skillconnect.repositories.UserRepository;
import com.skillconnect.repositories.ContractorRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final ContractorRepository contractorRepository;

    // ===== CREATE POST =====
    public Post createPost(String userId, Post post) {
        log.info("📝 Creating post for user: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        if (!"CONTRACTOR".equals(user.getUserType())) {
            throw new RuntimeException("Only contractors can create posts");
        }

        post.setContractorId(userId);
        post.setContractorName(user.getName());
        post.setContractorProfilePhoto(user.getProfilePicture());
        post.setIsVerified(false);
        post.setCreatedAt(LocalDateTime.now());
        post.setUpdatedAt(LocalDateTime.now());
        post.setActive(true);

        Contractor contractor = contractorRepository.findByUserId(userId).orElse(null);
        if (contractor != null) {
            post.setIsVerified(contractor.getIsVerified() != null && contractor.getIsVerified());
        }

        Post savedPost = postRepository.save(post);

        if (contractor != null) {
            contractor.setTotalPosts(contractor.getTotalPosts() + 1);
            contractorRepository.save(contractor);
        }

        log.info("✅ Post created with id: {}", savedPost.getId());
        return savedPost;
    }

    // ===== ENRICH POSTS WITH CONTRACTOR DETAILS =====
    private List<Post> enrichPostsWithContractorDetails(List<Post> posts) {
        if (posts == null || posts.isEmpty()) return posts;

        for (Post post : posts) {
            if (post.getContractorId() != null) {
                Contractor contractor = contractorRepository.findByUserId(post.getContractorId()).orElse(null);
                User user = userRepository.findById(post.getContractorId()).orElse(null);
                
                if (contractor != null) {
                    post.setContractorName(contractor.getFullName() != null ? contractor.getFullName() : "Unknown");
                    post.setContractorProfilePhoto(contractor.getProfilePhoto());
                    post.setIsVerified(contractor.getIsVerified() != null && contractor.getIsVerified());
                } else if (user != null) {
                    post.setContractorName(user.getName() != null ? user.getName() : "Unknown");
                    post.setContractorProfilePhoto(user.getProfilePicture());
                    post.setIsVerified(false);
                } else {
                    post.setContractorName("Unknown");
                    post.setContractorProfilePhoto(null);
                    post.setIsVerified(false);
                }
            }
        }
        return posts;
    }

    // ===== GET POSTS BY CONTRACTOR =====
    public List<Post> getPostsByContractor(String contractorId) {
        log.info("📄 Fetching posts for contractor: {}", contractorId);
        List<Post> posts = postRepository.findByContractorIdAndActiveTrue(contractorId);
        return enrichPostsWithContractorDetails(posts);
    }

    // ===== GET FEED POSTS =====
    public List<Post> getFeedPosts(String userId) {
        log.info("📰 Fetching feed for user: {}", userId);
        List<Post> posts = postRepository.findByActiveTrueOrderByCreatedAtDesc();
        return enrichPostsWithContractorDetails(posts);
    }

    // ===== GET SINGLE POST =====
    public Post getPostById(String postId) {
        log.info("📄 Fetching post: {}", postId);
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        
        if (post.getContractorId() != null) {
            Contractor contractor = contractorRepository.findByUserId(post.getContractorId()).orElse(null);
            User user = userRepository.findById(post.getContractorId()).orElse(null);
            
            if (contractor != null) {
                post.setContractorName(contractor.getFullName() != null ? contractor.getFullName() : "Unknown");
                post.setContractorProfilePhoto(contractor.getProfilePhoto());
                post.setIsVerified(contractor.getIsVerified() != null && contractor.getIsVerified());
            } else if (user != null) {
                post.setContractorName(user.getName() != null ? user.getName() : "Unknown");
                post.setContractorProfilePhoto(user.getProfilePicture());
                post.setIsVerified(false);
            }
        }
        
        return post;
    }

    // ===== UPDATE POST =====
    public Post updatePost(String postId, String userId, Post updatedPost) {
        log.info("📝 Updating post: {} by user: {}", postId, userId);

        Post existingPost = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (!existingPost.getContractorId().equals(userId)) {
            throw new RuntimeException("You can only edit your own posts");
        }

        if (updatedPost.getTitle() != null) existingPost.setTitle(updatedPost.getTitle());
        if (updatedPost.getDescription() != null) existingPost.setDescription(updatedPost.getDescription());
        if (updatedPost.getType() != null) existingPost.setType(updatedPost.getType());
        if (updatedPost.getImages() != null) existingPost.setImages(updatedPost.getImages());
        if (updatedPost.getVideoUrl() != null) existingPost.setVideoUrl(updatedPost.getVideoUrl());
        if (updatedPost.getLocation() != null) existingPost.setLocation(updatedPost.getLocation());
        if (updatedPost.getCategory() != null) existingPost.setCategory(updatedPost.getCategory());
        if (updatedPost.getBudget() != null) existingPost.setBudget(updatedPost.getBudget());

        existingPost.setUpdatedAt(LocalDateTime.now());

        Post savedPost = postRepository.save(existingPost);
        log.info("✅ Post updated with id: {}", savedPost.getId());
        return savedPost;
    }

    // ===== LIKE POST =====
    public Post likePost(String postId, String userId) {
        log.info("👍 Liking post: {} by user: {}", postId, userId);

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        post.setLikes(post.getLikes() + 1);
        post.setUpdatedAt(LocalDateTime.now());

        Post updatedPost = postRepository.save(post);

        Contractor contractor = contractorRepository.findByUserId(post.getContractorId()).orElse(null);
        if (contractor != null) {
            contractor.setTotalLikesReceived(contractor.getTotalLikesReceived() + 1);
            contractorRepository.save(contractor);
        }

        return updatedPost;
    }

    // ===== COMMENT ON POST =====
    public Post addComment(String postId, String userId, String text) {
        log.info("💬 Adding comment on post: {} by user: {}", postId, userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        Post.Comment comment = new Post.Comment();
        comment.setUserId(userId);
        comment.setUserName(user.getName());
        comment.setUserProfilePhoto(user.getProfilePicture());
        comment.setText(text);
        comment.setCreatedAt(LocalDateTime.now());

        post.getComments().add(comment);
        post.setUpdatedAt(LocalDateTime.now());

        Post updatedPost = postRepository.save(post);

        Contractor contractor = contractorRepository.findByUserId(post.getContractorId()).orElse(null);
        if (contractor != null) {
            contractor.setTotalCommentsReceived(contractor.getTotalCommentsReceived() + 1);
            contractorRepository.save(contractor);
        }

        return updatedPost;
    }

    // ===== ✅ DELETE POST - FIXED =====
    public void deletePost(String postId, String userId) {
        log.info("🗑️ Deleting post: {} by user: {}", postId, userId);

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (!post.getContractorId().equals(userId)) {
            throw new RuntimeException("You can only delete your own posts");
        }

        post.setActive(false);
        postRepository.save(post);

        // ✅ FIX: Decrement totalPosts when post is deleted
        Contractor contractor = contractorRepository.findByUserId(userId).orElse(null);
        if (contractor != null && contractor.getTotalPosts() != null && contractor.getTotalPosts() > 0) {
            contractor.setTotalPosts(contractor.getTotalPosts() - 1);
            contractorRepository.save(contractor);
        }

        log.info("✅ Post deleted successfully");
    }
}
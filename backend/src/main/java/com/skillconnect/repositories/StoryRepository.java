package com.skillconnect.repositories;

import com.skillconnect.models.Story;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface StoryRepository extends MongoRepository<Story, String> {

    List<Story> findByContractorIdAndIsActiveTrueAndExpiresAtAfter(
            String contractorId, 
            LocalDateTime now
    );

    List<Story> findByContractorIdInAndIsActiveTrueAndExpiresAtAfterOrderByCreatedAtDesc(
            List<String> contractorIds, 
            LocalDateTime now
    );

    List<Story> findByIsActiveTrueAndExpiresAtAfterOrderByCreatedAtDesc(
            LocalDateTime now
    );

    List<Story> findByExpiresAtBeforeAndIsActiveTrue(
            LocalDateTime now
    );

    void deleteByExpiresAtBefore(LocalDateTime now);
}
package com.skillconnect.repositories;

import com.skillconnect.models.Post;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends MongoRepository<Post, String> {

    List<Post> findByContractorIdAndIsActiveTrue(String contractorId);

    List<Post> findByContractorIdInAndIsActiveTrueOrderByCreatedAtDesc(List<String> contractorIds);

    List<Post> findByIsActiveTrueOrderByCreatedAtDesc();

    long countByContractorIdAndIsActiveTrue(String contractorId);

    void deleteByContractorId(String contractorId);
}
package com.skillconnect.repositories;

import com.skillconnect.models.Post;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends MongoRepository<Post, String> {

    List<Post> findByContractorIdAndActiveTrue(String contractorId);

    List<Post> findByContractorIdInAndActiveTrueOrderByCreatedAtDesc(List<String> contractorIds);

    List<Post> findByActiveTrueOrderByCreatedAtDesc();

    long countByContractorIdAndActiveTrue(String contractorId);

    void deleteByContractorId(String contractorId);
}
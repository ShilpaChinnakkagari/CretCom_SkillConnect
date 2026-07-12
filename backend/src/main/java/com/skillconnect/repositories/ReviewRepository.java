package com.skillconnect.repositories;

import com.skillconnect.models.Review;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends MongoRepository<Review, String> {

    List<Review> findByContractorId(String contractorId);

    List<Review> findByCustomerId(String customerId);

    List<Review> findByContractorIdOrderByCreatedAtDesc(String contractorId);

    double countByContractorId(String contractorId);
}
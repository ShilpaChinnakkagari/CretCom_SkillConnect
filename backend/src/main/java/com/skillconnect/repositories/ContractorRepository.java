package com.skillconnect.repositories;

import com.skillconnect.models.Contractor;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ContractorRepository extends MongoRepository<Contractor, String> {

    Optional<Contractor> findByUserId(String userId);

    boolean existsByUserId(String userId);

    void deleteByUserId(String userId);

    // Top 10 contractors by rating (for recommendations)
    List<Contractor> findTop10ByOrderByAverageRatingDesc();
}
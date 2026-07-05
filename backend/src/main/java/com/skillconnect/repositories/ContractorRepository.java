package com.skillconnect.repositories;

import com.skillconnect.models.Contractor;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ContractorRepository extends MongoRepository<Contractor, String> {

    Optional<Contractor> findByUserId(String userId);

    Optional<Contractor> findByEmail(String email);

    boolean existsByUserId(String userId);

    long countByPrimaryCategory(String primaryCategory);

    long countByRegistrationCompleteTrue();
}
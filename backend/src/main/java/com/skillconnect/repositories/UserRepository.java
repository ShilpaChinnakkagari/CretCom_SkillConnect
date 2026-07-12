package com.skillconnect.repositories;

import com.skillconnect.models.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findByEmail(String email);

    // ✅ FIXED: Changed from findByPhone to findByPhoneNumber
    Optional<User> findByPhoneNumber(String phoneNumber);

    Optional<User> findByEmailAndPassword(String email, String password);

    boolean existsByEmail(String email);

    boolean existsByPhoneNumber(String phoneNumber);

    void deleteByEmail(String email);
}
package com.skillconnect.repositories;

import com.skillconnect.models.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {

    List<Booking> findByCustomerIdOrderByCreatedAtDesc(String customerId);

    List<Booking> findByContractorIdOrderByCreatedAtDesc(String contractorId);

    List<Booking> findAllByOrderByCreatedAtDesc();

    List<Booking> findByStatus(String status);

    List<Booking> findByCustomerIdAndStatus(String customerId, String status);

    List<Booking> findByContractorIdAndStatus(String contractorId, String status);
}
package com.skillconnect.repositories;

import com.skillconnect.models.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {

    List<Booking> findByCustomerId(String customerId);

    List<Booking> findByContractorId(String contractorId);

    List<Booking> findByCustomerIdAndStatus(String customerId, String status);

    List<Booking> findByContractorIdAndStatus(String contractorId, String status);

    long countByContractorIdAndStatus(String contractorId, String status);

    long countByCustomerId(String customerId);
}
package com.skillconnect.services;

import com.skillconnect.dto.BookingRequestDTO;
import com.skillconnect.models.Booking;
import com.skillconnect.models.Contractor;
import com.skillconnect.models.User;
import com.skillconnect.repositories.BookingRepository;
import com.skillconnect.repositories.ContractorRepository;
import com.skillconnect.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ContractorRepository contractorRepository;
    private final UserRepository userRepository;

    public Booking createBooking(String customerId, BookingRequestDTO request) {
        Contractor contractor = contractorRepository.findById(request.getContractorId())
                .orElseThrow(() -> new RuntimeException("Contractor not found"));

        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        Booking booking = new Booking();
        booking.setCustomerId(customerId);
        booking.setCustomerName(customer.getName());
        booking.setContractorId(request.getContractorId());
        booking.setContractorName(contractor.getFullName());
        booking.setServiceCategory(contractor.getPrimaryCategory());
        booking.setDate(request.getDate());
        booking.setTime(request.getTime());
        booking.setAddress(request.getAddress());
        booking.setDescription(request.getDescription());
        booking.setBudget(request.getBudget());
        booking.setStatus("PENDING");
        booking.setCreatedAt(LocalDateTime.now());
        booking.setUpdatedAt(LocalDateTime.now());

        log.info("✅ New booking created: {} -> {} on {}", customer.getName(), contractor.getFullName(), request.getDate());

        return bookingRepository.save(booking);
    }

    public List<Booking> getBookingsByCustomer(String customerId) {
        log.info("🔍 Getting bookings for customer: {}", customerId);
        List<Booking> bookings = bookingRepository.findByCustomerId(customerId);
        log.info("🔍 Found {} bookings", bookings.size());
        return bookings;
    }

    public List<Booking> getBookingsByContractor(String contractorId) {
        log.info("🔍 Getting bookings for contractor: {}", contractorId);
        List<Booking> bookings = bookingRepository.findByContractorId(contractorId);
        log.info("🔍 Found {} bookings", bookings.size());
        return bookings;
    }

    public Booking updateBookingStatus(String bookingId, String status) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setStatus(status);
        booking.setUpdatedAt(LocalDateTime.now());

        log.info("✅ Booking {} status updated to: {}", bookingId, status);

        return bookingRepository.save(booking);
    }

    public long getCompletedJobsCount(String contractorId) {
        return bookingRepository.countByContractorIdAndStatus(contractorId, "COMPLETED");
    }

    public long getCustomerCount(String contractorId) {
        return bookingRepository.countByContractorIdAndStatus(contractorId, "COMPLETED");
    }
}
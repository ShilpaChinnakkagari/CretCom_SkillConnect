package com.skillconnect.services;

import com.skillconnect.models.Booking;
import com.skillconnect.models.User;
import com.skillconnect.models.Contractor;
import com.skillconnect.repositories.BookingRepository;
import com.skillconnect.repositories.UserRepository;
import com.skillconnect.repositories.ContractorRepository;
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
    private final UserRepository userRepository;
    private final ContractorRepository contractorRepository;

    // ===== CREATE BOOKING =====
    public Booking createBooking(String customerId, String contractorId, String service, 
                                  String description, String date, String location, Double budget) {
        log.info("📝 Creating booking: customer={}, contractor={}, service={}", customerId, contractorId, service);

        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        User contractorUser = userRepository.findById(contractorId)
                .orElseThrow(() -> new RuntimeException("Contractor not found"));

        Contractor contractor = contractorRepository.findByUserId(contractorId).orElse(null);

        Booking booking = new Booking();
        booking.setCustomerId(customerId);
        booking.setCustomerName(customer.getName());
        booking.setContractorId(contractorId);
        booking.setContractorName(contractorUser.getName());
        if (contractor != null) {
            booking.setContractorCategory(contractor.getPrimaryCategory());
        }
        booking.setService(service);
        booking.setDescription(description);
        booking.setDate(date != null ? LocalDateTime.parse(date) : LocalDateTime.now());
        booking.setLocation(location);
        booking.setBudget(budget);
        booking.setStatus("PENDING");
        booking.setCreatedAt(LocalDateTime.now());
        booking.setUpdatedAt(LocalDateTime.now());

        Booking savedBooking = bookingRepository.save(booking);
        log.info("✅ Booking created with id: {}", savedBooking.getId());
        return savedBooking;
    }

    // ===== GET BOOKING BY ID =====
    public Booking getBookingById(String bookingId) {
        log.info("📄 Fetching booking by id: {}", bookingId);
        return bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + bookingId));
    }

    // ===== GET BOOKINGS BY CUSTOMER =====
    public List<Booking> getBookingsByCustomer(String customerId) {
        log.info("📄 Fetching bookings for customer: {}", customerId);
        return bookingRepository.findByCustomerIdOrderByCreatedAtDesc(customerId);
    }

    // ===== GET BOOKINGS BY CONTRACTOR =====
    public List<Booking> getBookingsByContractor(String contractorId) {
        log.info("📄 Fetching bookings for contractor: {}", contractorId);
        return bookingRepository.findByContractorIdOrderByCreatedAtDesc(contractorId);
    }

    // ===== UPDATE BOOKING STATUS WITH REASON =====
    public Booking updateBookingStatus(String bookingId, String status, String userId, String reason) {
        log.info("📝 Updating booking {} status to: {}, reason: {}", bookingId, status, reason);

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.getCustomerId().equals(userId) && !booking.getContractorId().equals(userId)) {
            throw new RuntimeException("You are not authorized to update this booking");
        }

        if (!isValidStatus(status)) {
            throw new RuntimeException("Invalid status: " + status);
        }

        if ((status.equals("ACCEPTED") || status.equals("REJECTED")) && !booking.getContractorId().equals(userId)) {
            throw new RuntimeException("Only the contractor can accept or reject bookings");
        }

        if (status.equals("COMPLETED") && !booking.getContractorId().equals(userId)) {
            throw new RuntimeException("Only the contractor can mark bookings as completed");
        }

        if (status.equals("CANCELLED") && !booking.getCustomerId().equals(userId)) {
            throw new RuntimeException("Only the customer can cancel bookings");
        }

        booking.setStatus(status);
        booking.setUpdatedAt(LocalDateTime.now());

        // ✅ Save rejection reason if REJECTED
        if (status.equals("REJECTED") && reason != null && !reason.trim().isEmpty()) {
            booking.setRejectionReason(reason);
        }

        // ✅ Save cancel reason if CANCELLED
        if (status.equals("CANCELLED") && reason != null && !reason.trim().isEmpty()) {
            booking.setCancelReason(reason);
        }

        Booking updatedBooking = bookingRepository.save(booking);
        log.info("✅ Booking {} status updated to: {}", bookingId, status);
        return updatedBooking;
    }

    // ===== GET ALL BOOKINGS =====
    public List<Booking> getAllBookings() {
        log.info("📄 Fetching all bookings");
        return bookingRepository.findAllByOrderByCreatedAtDesc();
    }

    // ===== GET BOOKINGS BY STATUS =====
    public List<Booking> getBookingsByStatus(String status) {
        log.info("📄 Fetching bookings with status: {}", status);
        return bookingRepository.findByStatus(status);
    }

    // ===== DELETE BOOKING =====
    public void deleteBooking(String bookingId, String userId) {
        log.info("🗑️ Deleting booking: {}", bookingId);

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.getCustomerId().equals(userId) && !booking.getContractorId().equals(userId)) {
            throw new RuntimeException("You are not authorized to delete this booking");
        }

        if (!booking.getStatus().equals("PENDING")) {
            throw new RuntimeException("Only pending bookings can be deleted");
        }

        bookingRepository.deleteById(bookingId);
        log.info("✅ Booking {} deleted", bookingId);
    }

    private boolean isValidStatus(String status) {
        return status.equals("PENDING") || status.equals("ACCEPTED") || 
               status.equals("REJECTED") || status.equals("COMPLETED") || 
               status.equals("CANCELLED");
    }
}
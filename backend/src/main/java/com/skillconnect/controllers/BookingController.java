package com.skillconnect.controllers;

import com.skillconnect.dto.BookingRequestDTO;
import com.skillconnect.models.Booking;
import com.skillconnect.services.BookingService;
import com.skillconnect.services.ContractorService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bookings")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class BookingController {

    private final BookingService bookingService;
    private final ContractorService contractorService;

    private String getUserIdFromSession(HttpSession session) {
        String userId = (String) session.getAttribute("userId");
        if (userId == null) {
            throw new RuntimeException("User not logged in. Please login again.");
        }
        return userId;
    }

    @PostMapping
    public ResponseEntity<?> createBooking(
            HttpSession session,
            @Valid @RequestBody BookingRequestDTO request) {
        try {
            String customerId = getUserIdFromSession(session);
            Booking booking = bookingService.createBooking(customerId, request);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getMessage());
        }
    }

    @GetMapping("/customer")
    public ResponseEntity<?> getCustomerBookings(HttpSession session) {
        try {
            String customerId = getUserIdFromSession(session);
            System.out.println("🔍 Getting bookings for customer: " + customerId);
            List<Booking> bookings = bookingService.getBookingsByCustomer(customerId);
            System.out.println("✅ Found " + bookings.size() + " bookings");
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to load bookings: " + e.getMessage());
        }
    }

    @GetMapping("/contractor")
    public ResponseEntity<?> getContractorBookings(HttpSession session) {
        try {
            String userId = getUserIdFromSession(session);
            var contractor = contractorService.getContractorByUserId(userId);
            String contractorId = contractor.getId();
            List<Booking> bookings = bookingService.getBookingsByContractor(contractorId);
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to load bookings: " + e.getMessage());
        }
    }

    @PutMapping("/{bookingId}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable String bookingId,
            @RequestBody String status) {
        try {
            Booking booking = bookingService.updateBookingStatus(bookingId, status);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getMessage());
        }
    }
}
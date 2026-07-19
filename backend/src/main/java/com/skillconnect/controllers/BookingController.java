package com.skillconnect.controllers;

import com.skillconnect.models.Booking;
import com.skillconnect.services.BookingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/bookings")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@Slf4j
public class BookingController {

    private final BookingService bookingService;

    // ===== CREATE BOOKING =====
    @PostMapping("/create")
    public ResponseEntity<?> createBooking(@RequestBody Map<String, Object> request, HttpSession session) {
        try {
            String userId = (String) session.getAttribute("userId");
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "User not logged in"));
            }

            String contractorId = (String) request.get("contractorId");
            String service = (String) request.get("service");
            String description = (String) request.get("description");
            String date = (String) request.get("date");
            String location = (String) request.get("location");
            Double budget = request.get("budget") != null ? Double.valueOf(request.get("budget").toString()) : null;

            if (contractorId == null || contractorId.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "contractorId is required"));
            }

            if (service == null || service.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "service is required"));
            }

            if (date == null || date.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "date is required"));
            }

            log.info("📝 Creating booking: customer={}, contractor={}, service={}", userId, contractorId, service);

            Booking booking = bookingService.createBooking(
                    userId, contractorId, service, description, date, location, budget
            );

            return ResponseEntity.ok(booking);

        } catch (Exception e) {
            log.error("Error creating booking: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ===== GET BOOKINGS BY CUSTOMER =====
    @GetMapping("/customer")
    public ResponseEntity<?> getCustomerBookings(HttpSession session) {
        try {
            String userId = (String) session.getAttribute("userId");
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "User not logged in"));
            }

            log.info("📄 Fetching bookings for customer: {}", userId);
            List<Booking> bookings = bookingService.getBookingsByCustomer(userId);
            return ResponseEntity.ok(bookings);

        } catch (Exception e) {
            log.error("Error fetching customer bookings: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ===== GET BOOKINGS BY CONTRACTOR =====
    @GetMapping("/contractor")
    public ResponseEntity<?> getContractorBookings(HttpSession session) {
        try {
            String userId = (String) session.getAttribute("userId");
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "User not logged in"));
            }

            log.info("📄 Fetching bookings for contractor: {}", userId);
            List<Booking> bookings = bookingService.getBookingsByContractor(userId);
            return ResponseEntity.ok(bookings);

        } catch (Exception e) {
            log.error("Error fetching contractor bookings: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ===== GET BOOKING BY ID =====
    @GetMapping("/{bookingId}")
    public ResponseEntity<?> getBookingById(@PathVariable String bookingId) {
        try {
            log.info("📄 Fetching booking by id: {}", bookingId);
            Booking booking = bookingService.getBookingById(bookingId);
            return ResponseEntity.ok(booking);

        } catch (Exception e) {
            log.error("Error fetching booking: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ===== UPDATE BOOKING STATUS WITH REASON =====
    @PutMapping("/{bookingId}/status")
    public ResponseEntity<?> updateBookingStatus(
            @PathVariable String bookingId,
            @RequestBody Map<String, String> request,
            HttpSession session) {
        try {
            String userId = (String) session.getAttribute("userId");
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "User not logged in"));
            }

            String status = request.get("status");
            if (status == null || status.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Status is required"));
            }

            // ✅ Get reason if provided
            String reason = request.get("reason");

            log.info("📝 Updating booking {} status to: {}, reason: {}", bookingId, status, reason);
            Booking booking = bookingService.updateBookingStatus(bookingId, status, userId, reason);
            return ResponseEntity.ok(booking);

        } catch (Exception e) {
            log.error("Error updating booking status: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ===== DELETE BOOKING =====
    @DeleteMapping("/{bookingId}")
    public ResponseEntity<?> deleteBooking(@PathVariable String bookingId, HttpSession session) {
        try {
            String userId = (String) session.getAttribute("userId");
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "User not logged in"));
            }

            log.info("🗑️ Deleting booking: {}", bookingId);
            bookingService.deleteBooking(bookingId, userId);
            return ResponseEntity.ok(Map.of("success", true, "message", "Booking deleted successfully"));

        } catch (Exception e) {
            log.error("Error deleting booking: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
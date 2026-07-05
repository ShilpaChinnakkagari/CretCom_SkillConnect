package com.skillconnect.controllers;

import com.skillconnect.dto.*;
import com.skillconnect.models.Contractor;
import com.skillconnect.services.ContractorService;
import com.skillconnect.services.UserService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/contractor")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ContractorController {

    private final ContractorService contractorService;
    private final UserService userService;

    private String getUserIdFromSession(HttpSession session) {
        String userId = (String) session.getAttribute("userId");
        System.out.println("🔍 ContractorController - Session userId: " + userId);
        if (userId == null) {
            throw new RuntimeException("User not logged in. Please login again.");
        }
        return userId;
    }

    @GetMapping
    public ResponseEntity<List<Contractor>> getAllContractors() {
        List<Contractor> contractors = contractorService.getAllContractors();
        return ResponseEntity.ok(contractors);
    }

    @GetMapping("/{contractorId}")
    public ResponseEntity<Contractor> getContractorById(@PathVariable String contractorId) {
        Contractor contractor = contractorService.getContractorById(contractorId);
        return ResponseEntity.ok(contractor);
    }

    @GetMapping("/profile")
    public ResponseEntity<Contractor> getProfile(HttpSession session) {
        String userId = getUserIdFromSession(session);
        Contractor contractor = contractorService.getContractorByUserId(userId);
        return ResponseEntity.ok(contractor);
    }

    @PostMapping("/register/stage1")
    public ResponseEntity<Contractor> saveStage1(
            HttpSession session,
            @Valid @RequestBody ContractorStage1DTO dto) {

        String userId = getUserIdFromSession(session);
        Contractor contractor = contractorService.saveStage1(userId, dto);
        return ResponseEntity.ok(contractor);
    }

    @PostMapping("/register/stage2")
    public ResponseEntity<Contractor> saveStage2(
            HttpSession session,
            @Valid @RequestBody ContractorStage2DTO dto) {

        String userId = getUserIdFromSession(session);
        Contractor contractor = contractorService.saveStage2(userId, dto);
        return ResponseEntity.ok(contractor);
    }

    @PostMapping("/register/stage3")
    public ResponseEntity<Contractor> saveStage3(
            HttpSession session,
            @Valid @RequestBody ContractorStage3DTO dto) {

        String userId = getUserIdFromSession(session);
        Contractor contractor = contractorService.saveStage3(userId, dto);
        return ResponseEntity.ok(contractor);
    }

    @PostMapping("/register/stage4")
    public ResponseEntity<Contractor> saveStage4(
            HttpSession session,
            @Valid @RequestBody ContractorStage4DTO dto) {

        String userId = getUserIdFromSession(session);
        Contractor contractor = contractorService.saveStage4(userId, dto);
        return ResponseEntity.ok(contractor);
    }

    @PostMapping("/register/stage5")
    public ResponseEntity<Contractor> saveStage5(
            HttpSession session,
            @Valid @RequestBody ContractorStage5DTO dto) {

        String userId = getUserIdFromSession(session);
        Contractor contractor = contractorService.saveStage5(userId, dto);
        return ResponseEntity.ok(contractor);
    }
}
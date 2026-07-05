package com.skillconnect.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class ContractorStage5DTO {

    @NotNull(message = "Weekly schedule is required")
    private List<WeeklyScheduleDTO> weeklySchedule;

    private List<String> timeSlots; // MORNING, AFTERNOON, EVENING, FULL_DAY

    private Boolean emergencyAvailability;

    private Boolean holidayWorking;

    private List<BlockedDateDTO> blockedDates;

    @NotNull(message = "Terms must be accepted")
    private Boolean termsAccepted;

    @Data
    public static class WeeklyScheduleDTO {
        private String day; // MONDAY, TUESDAY, etc.
        private Boolean available;
        private String startTime;
        private String endTime;
    }

    @Data
    public static class BlockedDateDTO {
        private String date;
        private String reason;
    }
}
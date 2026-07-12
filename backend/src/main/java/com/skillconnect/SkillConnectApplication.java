package com.skillconnect;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling  // ✅ ADD THIS
public class SkillConnectApplication {

    public static void main(String[] args) {
        SpringApplication.run(SkillConnectApplication.class, args);
        System.out.println("🚀 SkillConnect API started successfully!");
    }
}
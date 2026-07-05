package com.skillconnect;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@SpringBootApplication
@EnableMongoAuditing
public class SkillConnectApplication {
    public static void main(String[] args) {
        SpringApplication.run(SkillConnectApplication.class, args);
        System.out.println("🚀 SkillConnect API started successfully!");
    }
}
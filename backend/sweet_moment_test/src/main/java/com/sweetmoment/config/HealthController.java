package com.sweetmoment.config;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

@RestController
public class HealthController {

    @GetMapping("/")
    public Map<String, Object> rootHealth() {
        return Map.of(
                "status", "UP",
                "service", "sweet-full-backend",
                "timestamp", Instant.now().toString()
        );
    }

    @GetMapping("/api/health")
    public Map<String, Object> apiHealth() {
        return rootHealth();
    }
}

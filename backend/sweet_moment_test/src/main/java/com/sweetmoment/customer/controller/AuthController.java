package com.sweetmoment.customer.controller;

import com.sweetmoment.customer.dto.AuthDtos;
import com.sweetmoment.customer.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/auth/register")
    public AuthDtos.AuthResponse register(@Valid @RequestBody AuthDtos.RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/auth/login")
    public AuthDtos.AuthResponse login(@Valid @RequestBody AuthDtos.LoginRequest request) {
        return authService.login(request);
    }

    @GetMapping("/users/{userId}")
    public AuthDtos.UserResponse getUser(@PathVariable Long userId) {
        return authService.getUserById(userId);
    }

    @PutMapping("/users/{userId}")
    public AuthDtos.UserResponse updateUser(@PathVariable Long userId, @RequestBody AuthDtos.UpdateProfileRequest request) {
        return authService.updateUser(userId, request);
    }
}

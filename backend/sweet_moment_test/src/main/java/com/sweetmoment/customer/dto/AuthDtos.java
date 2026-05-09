package com.sweetmoment.customer.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AuthDtos {

    public static class RegisterRequest {
        @NotBlank public String firstName;
        @NotBlank public String lastName;
        @Email @NotBlank public String email;
        @Size(min = 8) @NotBlank public String password;
    }

    public static class LoginRequest {
        @Email @NotBlank public String email;
        @NotBlank public String password;
    }

    public static class AuthResponse {
        public String token;
        public UserResponse user;
    }

    public static class UserResponse {
        public Long id;
        public String firstName;
        public String lastName;
        public String email;
        public String city;
        public String phone;
        public String createdAt;
    }

    public static class UpdateProfileRequest {
        public String firstName;
        public String lastName;
        public String city;
        public String phone;
    }
}

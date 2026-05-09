package com.sweetmoment.customer.service;

import com.sweetmoment.customer.dto.AuthDtos;
import com.sweetmoment.exception.BadRequestException;
import com.sweetmoment.exception.NotFoundException;
import com.sweetmoment.shared.entity.Profile;
import com.sweetmoment.shared.entity.User;
import com.sweetmoment.shared.repository.ProfileRepository;
import com.sweetmoment.shared.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, ProfileRepository profileRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthDtos.AuthResponse register(AuthDtos.RegisterRequest request) {
        if (userRepository.existsByEmail(request.email.toLowerCase())) {
            throw new BadRequestException("Cet email existe déjà");
        }
        User user = new User();
        user.setFirstName(request.firstName.trim());
        user.setLastName(request.lastName.trim());
        user.setEmail(request.email.toLowerCase().trim());
        user.setPassword(passwordEncoder.encode(request.password));
        userRepository.save(user);

        Profile profile = new Profile();
        profile.setUser(user);
        profileRepository.save(profile);

        return buildAuthResponse(user);
    }

    public AuthDtos.AuthResponse login(AuthDtos.LoginRequest request) {
        User user = userRepository.findByEmail(request.email.toLowerCase().trim())
                .orElseThrow(() -> new BadRequestException("Email ou mot de passe incorrect"));
        if (!passwordEncoder.matches(request.password, user.getPassword())) {
            throw new BadRequestException("Email ou mot de passe incorrect");
        }
        return buildAuthResponse(user);
    }

    public AuthDtos.UserResponse getUserById(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new NotFoundException("Utilisateur introuvable"));
        return toUserResponse(user);
    }

    public AuthDtos.UserResponse updateUser(Long userId, AuthDtos.UpdateProfileRequest req) {
        User user = userRepository.findById(userId).orElseThrow(() -> new NotFoundException("Utilisateur introuvable"));
        Profile profile = profileRepository.findByUserId(userId).orElseGet(() -> {
            Profile p = new Profile();
            p.setUser(user);
            return p;
        });

        if (req.firstName != null && !req.firstName.isBlank()) user.setFirstName(req.firstName.trim());
        if (req.lastName != null && !req.lastName.isBlank()) user.setLastName(req.lastName.trim());
        if (req.city != null) profile.setCity(req.city.trim());
        if (req.phone != null) profile.setPhone(req.phone.trim());

        userRepository.save(user);
        profileRepository.save(profile);
        return toUserResponse(user);
    }

    private AuthDtos.AuthResponse buildAuthResponse(User user) {
        AuthDtos.AuthResponse response = new AuthDtos.AuthResponse();
        response.token = "sm-token-" + UUID.randomUUID();
        response.user = toUserResponse(user);
        return response;
    }

    private AuthDtos.UserResponse toUserResponse(User user) {
        Profile profile = profileRepository.findByUserId(user.getId()).orElse(null);
        AuthDtos.UserResponse dto = new AuthDtos.UserResponse();
        dto.id = user.getId();
        dto.firstName = user.getFirstName();
        dto.lastName = user.getLastName();
        dto.email = user.getEmail();
        dto.createdAt = user.getCreatedAt().toString();
        dto.city = profile != null ? profile.getCity() : null;
        dto.phone = profile != null ? profile.getPhone() : null;
        return dto;
    }
}

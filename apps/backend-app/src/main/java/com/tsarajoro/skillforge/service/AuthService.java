package com.tsarajoro.skillforge.service;

import com.tsarajoro.skillforge.domain.Role;
import com.tsarajoro.skillforge.domain.User;
import com.tsarajoro.skillforge.exception.AuthenticationFailedException;
import com.tsarajoro.skillforge.exception.EmailAlreadyUsedException;
import com.tsarajoro.skillforge.repository.UserRepository;
import com.tsarajoro.skillforge.security.JwtService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public User register(String email, String rawPassword, Role role) {
        if (userRepository.existsByEmail(email)) {
            throw new EmailAlreadyUsedException(email);
        }
        User user = User.newUser(email, passwordEncoder.encode(rawPassword), role);
        return userRepository.save(user);
    }

    public TokenPair login(String email, String rawPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AuthenticationFailedException("invalid credentials"));
        if (!passwordEncoder.matches(rawPassword, user.getPasswordHash())) {
            throw new AuthenticationFailedException("invalid credentials");
        }
        return new TokenPair(
                jwtService.generateAccessToken(user),
                jwtService.generateRefreshToken(user));
    }

    public TokenPair refresh(String refreshToken) {
        try {
            Claims claims = jwtService.parse(refreshToken);
            if (!"refresh".equals(claims.get("type", String.class))) {
                throw new AuthenticationFailedException("not a refresh token");
            }
            UUID userId = UUID.fromString(claims.getSubject());
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new AuthenticationFailedException("user not found"));
            return new TokenPair(
                    jwtService.generateAccessToken(user),
                    jwtService.generateRefreshToken(user));
        } catch (JwtException e) {
            throw new AuthenticationFailedException("invalid refresh token");
        }
    }

    public record TokenPair(String accessToken, String refreshToken) {}
}

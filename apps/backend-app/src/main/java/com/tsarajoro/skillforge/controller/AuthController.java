package com.tsarajoro.skillforge.controller;

import com.tsarajoro.skillforge.domain.Role;
import com.tsarajoro.skillforge.service.AuthService;
import com.tsarajoro.skillforge.service.AuthService.TokenPair;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@Valid @RequestBody RegisterRequest body) {
        var user = authService.register(body.email(), body.password(), body.role());
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new RegisterResponse(user.getId().toString(), user.getEmail(), user.getRole()));
    }

    @PostMapping("/login")
    public TokenPair login(@Valid @RequestBody LoginRequest body) {
        return authService.login(body.email(), body.password());
    }

    @PostMapping("/refresh")
    public TokenPair refresh(@Valid @RequestBody RefreshRequest body) {
        return authService.refresh(body.refreshToken());
    }

    public record RegisterRequest(
            @Email @NotBlank String email,
            @NotBlank @Size(min = 12, max = 128) String password,
            @NotNull Role role) {}

    public record RegisterResponse(String id, String email, Role role) {}

    public record LoginRequest(
            @Email @NotBlank String email,
            @NotBlank String password) {}

    public record RefreshRequest(@NotBlank String refreshToken) {}
}

package org.example.eventix.service;

import jakarta.transaction.Transactional;
import java.util.Map;

import org.example.eventix.dto.AuthResponse;
import org.example.eventix.dto.LoginRequest;
import org.example.eventix.dto.RegisterRequest;
import org.example.eventix.model.User;
import org.example.eventix.model.enums.Role;
import org.example.eventix.repository.UserRepository;
import org.example.eventix.security.JwtService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository users;
    private final PasswordEncoder pe;
    private final JwtService jwt;

    public AuthService(UserRepository users, PasswordEncoder pe, JwtService jwt) {
        this.users = users;
        this.pe = pe;
        this.jwt = jwt;
    }

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        String email = normEmail(req.email());
        String raw = normPassword(req.password());

        log.info("[AUTH] register attempt email='{}'", email);

        if (users.existsByEmailIgnoreCase(email)) {
            log.info("[AUTH] register fail email='{}' — already used", email);
            throw new IllegalArgumentException("Email already used");
        }

        User u = new User();
        u.setEmail(email);
        u.setPasswordHash(pe.encode(raw));
        u.setRole(Role.USER);
        users.save(u);

        log.info("[AUTH] register success email='{}' id={}", email, u.getId());

        String token = jwt.generate(u.getEmail(), Map.of("role", u.getRole().name()));
        return new AuthResponse(token);
    }

    public AuthResponse login(LoginRequest req) {
        String email = normEmail(req.email());
        String raw   = normPassword(req.password());

        log.info("[AUTH] login attempt email='{}'", email);

        var u = users.findByEmailIgnoreCase(email)
                .orElseThrow(() -> {
                    log.info("[AUTH] login fail email='{}' — user not found", email);
                    return new IllegalArgumentException("Invalid email or password");
                });

        boolean matches = pe.matches(raw, u.getPasswordHash());
        log.info("[AUTH] login check email='{}' matches={}", email, matches);

        if (!matches) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        String token = jwt.generate(u.getEmail(), Map.of("role", u.getRole().name()));
        log.info("[AUTH] login success email='{}'", email);
        return new AuthResponse(token);
    }

    private static String normEmail(String email) {
        return email == null ? "" : email.trim().toLowerCase();
    }

    private static String normPassword(String password) {
        return password == null ? "" : password.trim();
    }
}




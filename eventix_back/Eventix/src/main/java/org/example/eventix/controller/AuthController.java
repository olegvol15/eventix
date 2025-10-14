package org.example.eventix.controller;

import jakarta.validation.Valid;
import org.example.eventix.dto.AuthResponse;
import org.example.eventix.dto.LoginRequest;
import org.example.eventix.dto.RegisterRequest;
import org.example.eventix.service.AuthService;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(path = "/api/v1/auth", produces = MediaType.APPLICATION_JSON_VALUE)
public class AuthController {

    private final AuthService auth;

    public AuthController(AuthService auth) {
        this.auth = auth;
    }

    @PostMapping(path = "/register", consumes = MediaType.APPLICATION_JSON_VALUE)
    public AuthResponse register(@Valid @RequestBody RegisterRequest req) {
        return auth.register(req);
    }

    @PostMapping(path = "/login", consumes = MediaType.APPLICATION_JSON_VALUE)
    public AuthResponse login(@Valid @RequestBody LoginRequest req) {
        return auth.login(req);
    }

    @GetMapping("/me")
    public Map<String, Object> me(Authentication principal) {
        boolean authenticated = principal != null && principal.isAuthenticated();
        return Map.of(
                "authenticated", authenticated,
                "name", authenticated ? principal.getName() : null,
                "authorities",
                authenticated
                        ? principal.getAuthorities().stream().map(Object::toString).toList()
                        : List.of()
        );
    }
}



package org.example.eventix.controller;

import jakarta.validation.Valid;
import org.example.eventix.dto.AuthResponse;
import org.example.eventix.dto.LoginRequest;
import org.example.eventix.dto.RegisterRequest;
import org.example.eventix.service.AuthService;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
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
    public Map<String, Object> me(Authentication auth) {
        boolean authenticated = auth != null && auth.isAuthenticated();

        Map<String, Object> resp = new LinkedHashMap<>();
        resp.put("authenticated", authenticated);

        if (authenticated) {
            resp.put("name", auth.getName());
            resp.put("authorities", auth.getAuthorities()
                    .stream().map(Object::toString).toList());
        } else {
            resp.put("name", null);
            resp.put("authorities", List.of());
        }
        return resp;
    }
}



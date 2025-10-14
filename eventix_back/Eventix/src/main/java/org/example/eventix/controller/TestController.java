package org.example.eventix.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/test")
public class TestController {
    @GetMapping("/protected")
    public String protectedEndpoint(org.springframework.security.core.Authentication auth) {
        return "ok: " + (auth != null ? auth.getName() : "anon");
    }
}


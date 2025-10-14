package org.example.eventix.controller;

import jakarta.validation.Valid;
import org.example.eventix.dto.AdminEventRequest;
import org.example.eventix.dto.AdminEventResponse;
import org.example.eventix.service.AdminEventService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/events")
public class AdminEventController {

    private final AdminEventService adminService;

    public AdminEventController(AdminEventService adminService) {
        this.adminService = adminService;
    }

    @GetMapping
    public Page<AdminEventResponse> list(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String category,
            Pageable pageable
    ) {
        return adminService.list(name, category, pageable);
    }

    @GetMapping("/{id}")
    public AdminEventResponse get(@PathVariable Long id) {
        return adminService.get(id);
    }

    @PostMapping
    public ResponseEntity<AdminEventResponse> create(@Valid @RequestBody AdminEventRequest req) {
        return ResponseEntity.ok(adminService.create(req));
    }

    @PutMapping("/{id}")
    public AdminEventResponse update(@PathVariable Long id, @Valid @RequestBody AdminEventRequest req) {
        return adminService.update(id, req);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        adminService.delete(id);
        return ResponseEntity.noContent().build();
    }
}


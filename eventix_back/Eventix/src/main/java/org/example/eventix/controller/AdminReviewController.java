package org.example.eventix.controller;

import org.example.eventix.dto.AdminReviewResponse;
import org.example.eventix.service.AdminReviewService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "/api/v1/admin/reviews", produces = MediaType.APPLICATION_JSON_VALUE)
@PreAuthorize("hasRole('ADMIN')")
public class AdminReviewController {

    private final AdminReviewService service;

    public AdminReviewController(AdminReviewService service) {
        this.service = service;
    }

    @GetMapping
    public Page<AdminReviewResponse> list(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long eventId,
            @RequestParam(required = false) Long userId,
            @PageableDefault(size = 10, sort = "createdAt") Pageable pageable
    ) {
        return service.list(q, status, eventId, userId, pageable);
    }

    @PatchMapping("/{id}/approve")
    public AdminReviewResponse approvePatch(@PathVariable Long id) {
        return service.approve(id);
    }

    @PostMapping("/{id}/approve")
    public AdminReviewResponse approvePost(@PathVariable Long id) {
        return service.approve(id);
    }

    @PatchMapping("/{id}/reject")
    public AdminReviewResponse rejectPatch(@PathVariable Long id) {
        return service.reject(id);
    }

    @PostMapping("/{id}/reject")
    public AdminReviewResponse rejectPost(@PathVariable Long id) {
        return service.reject(id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}



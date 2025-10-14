package org.example.eventix.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.example.eventix.model.enums.Role;

@Entity
@Table(
        name = "users",
        uniqueConstraints = @UniqueConstraint(columnNames = "email")
)
@Getter
@Setter
public class User {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 120)
    private String email;

    @Column(name = "password_hash", nullable = false, length = 100)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role = Role.USER;

    @PrePersist @PreUpdate
    void normalize() {
        if (email != null) email = email.trim().toLowerCase();
    }
}



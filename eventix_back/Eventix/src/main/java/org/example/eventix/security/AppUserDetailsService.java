package org.example.eventix.security;

import java.util.List;
import org.example.eventix.model.User;
import org.example.eventix.repository.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service
public class AppUserDetailsService implements UserDetailsService {

    private final UserRepository users;

    public AppUserDetailsService(UserRepository users) {
        this.users = users;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        String norm = email == null ? null : email.trim().toLowerCase();

        User u = users.findByEmailIgnoreCase(norm)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        var auths = List.of(new SimpleGrantedAuthority("ROLE_" + u.getRole().name()));
        return org.springframework.security.core.userdetails.User
                .withUsername(u.getEmail())
                .password(u.getPasswordHash())
                .authorities(auths)
                .build();
    }
}



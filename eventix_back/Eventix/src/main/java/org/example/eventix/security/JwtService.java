package org.example.eventix.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import java.util.Map;

@Service
public class JwtService {

    private final String secret;
    private final String issuer;
    private final long ttlMinutes;
    private final long clockSkewSeconds;

    private SecretKey key;

    public JwtService(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.issuer:eventix}") String issuer,
            @Value("${app.jwt.ttl-minutes:120}") long ttlMinutes,
            @Value("${app.jwt.clock-skew-seconds:60}") long clockSkewSeconds
    ) {
        this.secret = secret;
        this.issuer = issuer;
        this.ttlMinutes = ttlMinutes;
        this.clockSkewSeconds = clockSkewSeconds;
    }

    @PostConstruct
    void init() {
        if (secret == null || secret.getBytes(StandardCharsets.UTF_8).length < 32) {
            throw new IllegalStateException(
                    "app.jwt.secret must be at least 32 bytes for HS256 (use a long random string)"
            );
        }
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String generate(String subject, Map<String, Object> claims) {
        Instant now = Instant.now();
        return Jwts.builder()
                .setClaims(claims == null ? new java.util.HashMap<>() : claims)
                .setSubject(subject)
                .setIssuer(issuer)
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(now.plus(Duration.ofMinutes(ttlMinutes))))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public Jws<Claims> parse(String token) throws JwtException {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .requireIssuer(issuer)
                .setAllowedClockSkewSeconds(clockSkewSeconds)
                .build()
                .parseClaimsJws(token);
    }

    public String getSubject(String token) {
        return parse(token).getBody().getSubject();
    }

    public boolean isValid(String token, UserDetails user) {
        try {
            Claims c = parse(token).getBody();
            String subject = c.getSubject();
            Date exp = c.getExpiration();
            return subject != null
                    && subject.equals(user.getUsername())
                    && exp != null
                    && exp.after(new Date());
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}


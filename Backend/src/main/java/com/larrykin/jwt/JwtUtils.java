package com.larrykin.jwt;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Slf4j
@Component
public class JwtUtils {

    @Value("${JWT_SECRET}")
    private String jwtSecret;
    @Value("${JWT_EXPIRATION}")
    private int jwtExpirationMs;

    private SecretKey key;

    @PostConstruct
    public void init() {
        this.key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
    }

    public String getJwtFromHeader(HttpServletRequest request) {
        log.info("JwtUtils:: Extracting Jwt token from Authorization Header");
        String bearerToken = request.getHeader("Authorization");
        log.info("JwtUtils:: Authorization Header: {}",
                bearerToken);
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7); // remove bearer prefix
        }
        return null;
    }

    public String generateTokenFromUsername(UserDetails userDetails) {
        log.info("JwtUtils:: Generating JWT token");
        String username = userDetails.getUsername();

        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(new Date().getTime() + jwtExpirationMs))
                .signWith(key)
                .compact();
    }


    public String getUsernameFromJwtToken(String token) {
        log.info("JwtUtils:: Extracting username JWT token");
        Claims claims = Jwts.parser().setSigningKey(key).build().parseClaimsJws(token).getBody();
        return claims.getSubject();
    }

    public boolean validateJwtToken(String authToken) {
        log.info("JwtUtils:: validating jwt token");
        try {
            Jwts.parser().setSigningKey(key).build().parseClaimsJws(authToken).getBody();
            return true;
        } catch (MalformedJwtException e) {
            log.error("JwtUtils:: Invalid JWT token{}", e.getMessage());
        } catch (ExpiredJwtException e) {
            log.error("JwtUtils:: JWT token is expired: {}", e.getMessage());
        } catch (UnsupportedJwtException ex) {
            log.error("JwtUtils:: JWT token is unsupported: {}", ex.getMessage());
        } catch (IllegalArgumentException e) {
            log.error("JwtUtils:: JWT claims String is empty{}", e.getMessage());
        }
        return false;
    }
}

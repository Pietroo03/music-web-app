package org.project.spring.music_album.demo.config;

import io.jsonwebtoken.*;
import jakarta.servlet.http.HttpServletRequest;
import org.project.spring.music_album.demo.security.DatabaseUserDetailsService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import java.security.Key;
import java.util.Date;
import javax.crypto.spec.SecretKeySpec;

@Component
public class JwtTokenProvider {

    private final Key secretKey;
    private final DatabaseUserDetailsService userDetailsService;

    @Value("${jwt.expiration-time}")
    private long expirationTime;

    // Iniezione del databaseUserDetailsService tramite costruttore
    public JwtTokenProvider(JwtConfig jwtConfig, DatabaseUserDetailsService userDetailsService) {
        this.secretKey = new SecretKeySpec(jwtConfig.getSecretKey().getBytes(), SignatureAlgorithm.HS512.getJcaName());
        this.userDetailsService = userDetailsService;
    }

    // Genera il token JWT
    public String generateToken(UserDetails userDetails) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expirationTime); // Impostiamo la scadenza del token

        return Jwts.builder()
                .setSubject(userDetails.getUsername())
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(secretKey) // Firma il token con la chiave
                .compact();
    }

    // Estrai il nome utente dal token
    public String getUsernameFromToken(String token) {
        Claims claims = getClaimsFromToken(token);
        return claims.getSubject();
    }

    // Estrai i claims (informazioni) dal token
    private Claims getClaimsFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey) // Imposta la chiave di firma
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // Controlla se il token è scaduto
    public boolean isTokenExpired(String token) {
        Date expiration = getClaimsFromToken(token).getExpiration();
        return expiration.before(new Date());
    }

    // Controlla se il token è valido
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(secretKey).build().parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    // Estrai il token dalla richiesta HTTP
    public String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7); // Rimuove la parte "Bearer " del token
        }
        return null;
    }

    // Ottieni l'autenticazione (crea un oggetto Authentication)
    public Authentication getAuthentication(String token) {
        String username = getUsernameFromToken(token); // Ottieni il nome utente dal token
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        return new UsernamePasswordAuthenticationToken(userDetails, "", userDetails.getAuthorities());
    }
}

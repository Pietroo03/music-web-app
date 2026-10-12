package org.project.spring.music_album.demo.config;

import io.jsonwebtoken.*;
import jakarta.servlet.http.HttpServletRequest;
import org.project.spring.music_album.demo.security.DatabaseUserDetails;
import org.project.spring.music_album.demo.security.DatabaseUserDetailsService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import java.security.Key;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

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

    // Firma un token con identità, ruoli, versione e scadenza per autenticare le richieste successive.
    public String generateToken(UserDetails userDetails) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expirationTime); // Impostiamo la scadenza del token

        // I ruoli sono claims del token e vengono riutilizzati nei controlli di autorizzazione.
        List<String> roles = userDetails.getAuthorities().stream()
                .map(grantedAuthority -> grantedAuthority.getAuthority())
                .collect(Collectors.toList());

        return Jwts.builder()
                .setSubject(userDetails.getUsername())
                .claim("roles", roles) // Aggiungi i ruoli come claim
                .claim("tokenVersion", userDetails instanceof DatabaseUserDetails databaseUser
                        ? databaseUser.getTokenVersion()
                        : 0)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(secretKey) // Firma il token con la chiave
                .compact();
    }

    // In questo progetto il subject del token è lo username.
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

    // Il parser controlla firma e struttura; le eccezioni indicano un token non utilizzabile.
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(secretKey).build().parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    // Accetta Authorization: Bearer <token> e restituisce solo il token, senza il prefisso.
    public String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7); // Rimuove la parte "Bearer " del token
        }
        return null;
    }

    // Ricarica l'utente e confronta tokenVersion per poter revocare i token già emessi.
    public Authentication getAuthentication(String token) {
        String username = getUsernameFromToken(token); // Ottieni il nome utente dal token
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        Integer tokenVersion = getClaimsFromToken(token).get("tokenVersion", Integer.class);
        int currentVersion = userDetails instanceof DatabaseUserDetails databaseUser
                ? databaseUser.getTokenVersion()
                : 0;
        if ((tokenVersion == null ? 0 : tokenVersion) != currentVersion) {
            throw new BadCredentialsException("JWT revocato");
        }
        return new UsernamePasswordAuthenticationToken(userDetails, "", userDetails.getAuthorities());
    }
}

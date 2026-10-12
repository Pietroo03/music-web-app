package org.project.spring.music_album.demo.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.project.spring.music_album.demo.config.JwtTokenProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

// Eseguito una volta per richiesta: se il bearer token è valido imposta l'identità nel contesto Spring.
public class JwtFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;

    public JwtFilter(JwtTokenProvider jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, java.io.IOException {
        // Il provider prende dall'header Authorization la parte dopo il prefisso "Bearer ".
        String token = jwtTokenProvider.resolveToken(request);

        // Un token verificato diventa un Authentication consultabile dalle regole di accesso.
        if (token != null && jwtTokenProvider.validateToken(token)) {
            try {
                Authentication authentication = jwtTokenProvider.getAuthentication(token);
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } catch (AuthenticationException exception) {
                // Il token non valido non deve lasciare dati di autenticazione nel contesto della richiesta.
                SecurityContextHolder.clearContext();
            }
        }

        // Anche senza token si prosegue: la regola dell'endpoint deciderà se il login è necessario.
        filterChain.doFilter(request, response);
    }
}

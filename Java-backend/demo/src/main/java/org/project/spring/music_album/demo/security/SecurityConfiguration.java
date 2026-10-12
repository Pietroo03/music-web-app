package org.project.spring.music_album.demo.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.project.spring.music_album.demo.config.JwtTokenProvider;

import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {

    // Definisce la catena HTTP: sessioni, autorizzazioni, errori e filtro JWT.
    @Bean
    SecurityFilterChain filterChain(HttpSecurity http, JwtTokenProvider jwtTokenProvider) throws Exception {

        http
                // L'autenticazione usa esclusivamente il bearer token nell'header Authorization.
                // Il frontend usa un'origine diversa, quindi abilitiamo il CORS configurato dall'app.
                .cors(withDefaults())
                // La sessione è stateless: ogni richiesta protetta porta il JWT nell'header Authorization.
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(requests -> requests
                        // Le richieste preflight CORS non contengono credenziali e devono poter passare.
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers(HttpMethod.POST,
                                "/api/auth/login",
                                "/api/auth/register",
                                "/api/auth/verify-email",
                                "/api/auth/resend-verification",
                                "/api/auth/forgot-password",
                                "/api/auth/reset-password",
                                "/api/auth/account-deletion-confirm").permitAll()
                        // Profilo e richiesta di eliminazione sono azioni riservate all'utente autenticato.
                        .requestMatchers(HttpMethod.POST, "/api/auth/account-deletion-request",
                                "/api/auth/profile/photo").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/auth/profile").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/auth/profile/username",
                                "/api/auth/profile/password").authenticated()
                        .requestMatchers("/api/auth/**").denyAll()
                        // Solo gli URL delle copertine sono pubblici; gli altri dati restano protetti.
                        .requestMatchers(HttpMethod.GET, "/api/albums/covers").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/albums/**", "/api/artists/**", "/api/genres/**")
                        .hasAnyAuthority("USER", "ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/albums/**", "/api/artists/**", "/api/genres/**")
                        .hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/albums/**", "/api/artists/**", "/api/genres/**")
                        .hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/albums/**", "/api/artists/**", "/api/genres/**")
                        .hasAuthority("ADMIN")
                        // Regola di chiusura: ogni altra API richiede login e ogni altra rotta viene negata.
                        .requestMatchers("/api/**").authenticated()
                        .anyRequest().denyAll())
                .exceptionHandling(exceptions -> exceptions
                        .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)))
                // Il filtro JWT popola l'utente corrente prima dei controlli di autorizzazione.
                .addFilterBefore(new JwtFilter(jwtTokenProvider), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // Collega il caricamento utenti dal database al controllo password fatto da Spring Security.
    @Bean
    DaoAuthenticationProvider authenticationProvider(DatabaseUserDetailsService userDetailsService,
            BCryptPasswordEncoder passwordEncoder) {
        DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();

        authenticationProvider.setUserDetailsService(userDetailsService);
        authenticationProvider.setPasswordEncoder(passwordEncoder);

        return authenticationProvider;
    }

    // BCrypt crea hash non reversibili; al login la password viene confrontata con l'hash salvato.
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

}

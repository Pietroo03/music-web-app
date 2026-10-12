package org.project.spring.music_album.demo.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JwtConfig {

    // Il segreto arriva dalla configurazione esterna, quindi non è incorporato nel codice sorgente.
    @Value("${jwt.secret}")
    private String secretKey;

    public String getSecretKey() {
        return secretKey;
    }
}

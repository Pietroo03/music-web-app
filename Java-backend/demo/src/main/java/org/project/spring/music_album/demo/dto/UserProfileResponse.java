package org.project.spring.music_album.demo.dto;

import java.time.Instant;

// Vista ridotta del profilo restituita all'interfaccia: non espone password, email o ruoli.
public record UserProfileResponse(String username, Instant createdAt, String profileImage) {
}

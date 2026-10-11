package org.project.spring.music_album.demo.dto;

import java.time.Instant;

public record UserProfileResponse(String username, Instant createdAt, String profileImage) {
}

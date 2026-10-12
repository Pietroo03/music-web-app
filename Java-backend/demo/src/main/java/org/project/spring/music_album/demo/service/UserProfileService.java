package org.project.spring.music_album.demo.service;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.Iterator;
import java.util.Locale;

import javax.imageio.ImageIO;
import javax.imageio.ImageReader;
import javax.imageio.stream.ImageInputStream;

import org.project.spring.music_album.demo.dto.UserProfileResponse;
import org.project.spring.music_album.demo.model.User;
import org.project.spring.music_album.demo.model.UserProfileImage;
import org.project.spring.music_album.demo.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
// Contiene le regole del profilo che non appartengono al controller HTTP.
public class UserProfileService {

    // I limiti proteggono memoria e decoder da file troppo grandi o immagini con dimensioni anomale.
    private static final long MAX_IMAGE_BYTES = 2 * 1024 * 1024;
    private static final int MAX_IMAGE_DIMENSION = 2048;
    private static final long MAX_IMAGE_PIXELS = 4_000_000;

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserProfileService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    // Prepara la risposta del profilo senza modificare dati persistenti.
    public UserProfileResponse getProfile(String username) {
        return toResponse(findUser(username));
    }

    @Transactional
    // Valida l'immagine e la salva come entità collegata all'utente.
    public void updateProfileImage(String username, MultipartFile image) {
        if (image == null || image.isEmpty() || image.getSize() > MAX_IMAGE_BYTES) {
            throw new IllegalArgumentException("Scegli un'immagine non vuota di massimo 2 MB.");
        }

        // Il tipo MIME dichiarato è un primo filtro; validateImage controlla anche i byte reali.
        String contentType = image.getContentType();
        if (!"image/png".equalsIgnoreCase(contentType) && !"image/jpeg".equalsIgnoreCase(contentType)) {
            throw new IllegalArgumentException("Sono supportate solo immagini PNG o JPEG.");
        }

        try {
            byte[] bytes = image.getBytes();
            validateImage(bytes, contentType);
            User user = findUser(username);
            UserProfileImage profileImage = user.getProfileImage();
            if (profileImage == null) {
                profileImage = new UserProfileImage();
                profileImage.setUser(user);
                user.setProfileImage(profileImage);
            }
            profileImage.setImageData(bytes);
            profileImage.setContentType(contentType.toLowerCase(Locale.ROOT));
            userRepository.save(user);
        } catch (IOException exception) {
            throw new IllegalArgumentException("Impossibile leggere l'immagine selezionata.", exception);
        }
    }

    @Transactional
    // Cambia username solo se non è già assegnato a un altro utente.
    public User updateUsername(String currentUsername, String requestedUsername) {
        String newUsername = requestedUsername == null ? "" : requestedUsername.trim();
        User user = findUser(currentUsername);
        if (!user.getUsername().equals(newUsername)) {
            userRepository.findByUsername(newUsername)
                    .filter(existing -> !existing.getId().equals(user.getId()))
                    .ifPresent(existing -> {
                        throw new IllegalArgumentException("Username già in uso.");
                    });
            user.setUsername(newUsername);
            user.setTokenVersion((user.getTokenVersion() == null ? 0 : user.getTokenVersion()) + 1);
        }
        return userRepository.save(user);
    }

    @Transactional
    // Verifica la password attuale, impedisce di riutilizzarla e aggiorna la versione JWT.
    public User changePassword(String username, String currentPassword, String newPassword) {
        User user = findUser(username);
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new IllegalArgumentException("La password attuale non è corretta.");
        }
        if (passwordEncoder.matches(newPassword, user.getPassword())) {
            throw new IllegalArgumentException("La nuova password deve essere diversa da quella attuale.");
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setTokenVersion((user.getTokenVersion() == null ? 0 : user.getTokenVersion()) + 1);
        return userRepository.save(user);
    }

    private User findUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Account non trovato."));
    }

    private static UserProfileResponse toResponse(User user) {
        // La foto diventa una data URL, così il frontend può mostrarla senza un endpoint separato.
        String profileImage = null;
        UserProfileImage image = user.getProfileImage();
        if (image != null) {
            profileImage = "data:" + image.getContentType() + ";base64,"
                    + Base64.getEncoder().encodeToString(image.getImageData());
        }
        return new UserProfileResponse(user.getUsername(), user.getCreatedAt(), profileImage);
    }

    private static void validateImage(byte[] bytes, String contentType) throws IOException {
        // ImageIO legge il formato effettivo e le dimensioni senza fidarsi del solo nome del file.
        try (ImageInputStream input = ImageIO.createImageInputStream(new ByteArrayInputStream(bytes))) {
            if (input == null) {
                throw new IllegalArgumentException("Il file selezionato non è un'immagine valida.");
            }

            Iterator<ImageReader> readers = ImageIO.getImageReaders(input);
            if (!readers.hasNext()) {
                throw new IllegalArgumentException("Il file selezionato non è un'immagine valida.");
            }

            ImageReader reader = readers.next();
            try {
                reader.setInput(input, true, true);
                String format = reader.getFormatName().toLowerCase(Locale.ROOT);
                boolean matchesType = "image/png".equalsIgnoreCase(contentType)
                        ? "png".equals(format)
                        : "jpeg".equals(format) || "jpg".equals(format);
                if (!matchesType) {
                    throw new IllegalArgumentException("Il formato del file non corrisponde al tipo dichiarato.");
                }

                int width = reader.getWidth(0);
                int height = reader.getHeight(0);
                if (width < 1 || height < 1 || width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION
                        || (long) width * height > MAX_IMAGE_PIXELS) {
                    throw new IllegalArgumentException("L'immagine deve avere dimensioni massime di 2048 × 2048 pixel.");
                }
            } finally {
                reader.dispose();
            }
        }
    }
}

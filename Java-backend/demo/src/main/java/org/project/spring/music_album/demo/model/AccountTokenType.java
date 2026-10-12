package org.project.spring.music_album.demo.model;

// Distingue lo scopo di un token: la stessa tabella può gestire flussi diversi senza confonderli.
public enum AccountTokenType {
    EMAIL_VERIFICATION,
    PASSWORD_RESET,
    ACCOUNT_DELETION
}

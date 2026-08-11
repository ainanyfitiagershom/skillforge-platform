package com.tsarajoro.skillforge.exception;

/**
 * Invitation inconnue, expiree ou deja utilisee. Toujours mappee en HTTP 410 Gone
 * par GlobalExceptionHandler, pour ne pas differencier les 3 cas cote client
 * (evite l enumeration de tokens valides via difference de statuts HTTP).
 */
public class InvitationInvalidException extends RuntimeException {
    public InvitationInvalidException(String message) {
        super(message);
    }
}

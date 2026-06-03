package com.tsarajoro.skillforge.exception;

public class EmailAlreadyUsedException extends RuntimeException {
    public EmailAlreadyUsedException(String email) {
        super("email already used: " + email);
    }
}

package com.larrykin.exceptions;

public class ReceptionistNotFoundException extends RuntimeException {
    public ReceptionistNotFoundException(String message) {
        super(message);
    }
}

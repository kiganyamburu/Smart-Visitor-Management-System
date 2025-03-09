package com.larrykin.exceptions;

public class HostNotFoundException extends RuntimeException {
    public HostNotFoundException(String message) {
        super(message);
    }
}

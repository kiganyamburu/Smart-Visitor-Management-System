package com.larrykin.exceptions;

public class AuditLogNotFoundException extends RuntimeException {
    public AuditLogNotFoundException(String message) {
        super(message);
    }
}

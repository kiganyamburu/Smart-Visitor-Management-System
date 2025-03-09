package com.larrykin.exceptions;

public class VisitorNotFoundException extends RuntimeException {
    public VisitorNotFoundException(String message) {
        super(message);
    }
}

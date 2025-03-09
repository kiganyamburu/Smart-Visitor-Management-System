package com.larrykin.exceptions;

public class BlackListNotFoundException extends RuntimeException {
    public BlackListNotFoundException(String message) {
        super(message);
    }
}

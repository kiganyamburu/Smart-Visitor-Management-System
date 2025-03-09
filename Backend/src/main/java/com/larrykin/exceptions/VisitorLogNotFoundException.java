package com.larrykin.exceptions;

import com.larrykin.entity.VisitorLog;

public class VisitorLogNotFoundException extends RuntimeException {
    public VisitorLogNotFoundException(String message) {
        super(message);
    }
}

package com.larrykin.Response;

import com.larrykin.enums.Role;
import lombok.Data;

@Data
public class AuthResponse {
    private String jwtToken;
    private String message;
    private Role role;
}

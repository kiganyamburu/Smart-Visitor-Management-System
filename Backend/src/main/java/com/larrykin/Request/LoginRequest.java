package com.larrykin.Request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    @NotBlank(message = "Email cannot be blank")
    String email;
    @NotBlank(message = "Passowrd cannot be blank")
    String password;
}

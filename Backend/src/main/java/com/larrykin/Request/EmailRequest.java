package com.larrykin.Request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class EmailRequest {
    @NotBlank(message = "name cannot be blank")
    private String name;
    @NotBlank(message = "email connot be blank")
    private String email;
    @NotBlank(message = "Phone cannot be blank")
    private String phone;
    @NotBlank(message = "Subject cannot be null")
    private String subject;
    @NotBlank(message = "Message cannot be blank")
    private String message;

    @Override
    public String toString() {
        return "EmailRequest{" +
                "name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", subject= '" + subject + '\'' +
                ", phone='" + phone + '\'' +
                ", message='" + message + '\'' +
                '}';
    }
}

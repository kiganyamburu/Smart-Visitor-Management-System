package com.larrykin.model;

import com.larrykin.enums.Permissions;
import com.larrykin.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "admins")
public class Admin {
    @Id
    private String adminId;
    @NotBlank(message = "fullName cannot be blank")
    private String fullName;
    @NotBlank(message = "PhoneNumber cannot be blank")
    private String phoneNumber;
    @Email
    @NotBlank(message = "email cannot be blank")
    private String email;
    private Role role;
    private String password;
}

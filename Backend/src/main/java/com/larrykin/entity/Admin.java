package com.larrykin.entity;

import com.larrykin.enums.Permissions;
import com.larrykin.enums.Role;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "admins")
public class Admin {
    @Id
    private String adminId;
    @NotBlank
    private String fullName;
    @NotBlank
    private String phoneNumber;
    private Role role;
    private Permissions permissions;
}

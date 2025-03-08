package com.larrykin.entity;

import com.larrykin.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Document(collection = "hosts")
public class Host {
    @Id
    private String hostId;
    @NotBlank
    private String fullName;
    @Email
    private String email;
    @NotBlank
    private String phoneNumber;
    private String department;
    private Role role;
    private List<String> visitorsID;
}

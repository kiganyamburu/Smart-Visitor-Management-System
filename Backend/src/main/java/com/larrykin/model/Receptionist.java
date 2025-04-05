package com.larrykin.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.larrykin.enums.AssignedLocation;
import com.larrykin.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collection;
import java.util.Collections;

@Data
@Document(collection = "receptionists")
public class Receptionist implements AppUser {
    @Id
    private String id;
    @NotBlank(message = "FullName Cannot be blank")
    private String name;
    @Email(message = "Should be an email")
    private String email;
    @NotBlank(message = "Phone number cannot be blank")
    private String phoneNumber;
    private AssignedLocation assignedLocation;
    @NotNull(message = "Role cannot be null")
    private Role role;
    @NotBlank(message = "Password cannot be blank")
    private String password;

    @Override
    @JsonIgnore
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singleton(new SimpleGrantedAuthority("ROLE_" +role.name()));
    }
}

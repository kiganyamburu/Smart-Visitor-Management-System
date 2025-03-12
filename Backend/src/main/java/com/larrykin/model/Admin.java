package com.larrykin.model;

import com.larrykin.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collection;
import java.util.Collections;

@Data
@Document(collection = "admins")
public class Admin implements AppUser {
    @Id
    private String adminId;
    @NotBlank(message = "fullName cannot be blank")
    private String fullName;
    @NotBlank(message = "PhoneNumber cannot be blank")
    private String phoneNumber;
    @Email
    @NotBlank(message = "email cannot be blank")
    private String email;
    @NotBlank(message = "Role cannot be blank")
    private Role role;
    @NotBlank(message = "Password cannot be blank")
    private String password;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singleton(new SimpleGrantedAuthority(role.name()));
    }
}

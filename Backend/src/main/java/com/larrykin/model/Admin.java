package com.larrykin.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
@Document(collection = "admins")
public class Admin implements AppUser {
    @Id
    private String id;
    @NotBlank(message = "fullName cannot be blank")
    private String name;
    @NotBlank(message = "PhoneNumber cannot be blank")
    private String phoneNumber;
    @Email
    @NotBlank(message = "email cannot be blank")
    private String email;
    @NotNull(message = "Role cannot be blank")
    private Role role= Role.ADMIN;
    private String password = "";

    /**
     * GrantedAuthority interface is not directly serializable by Jackson, which is used by Spring Boot to convert JSON to Java objects and vice versa. We have to customize serialization and deserialization
     */
    @Override
    @JsonIgnore //since authorities are derived form the role
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singleton(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }
}

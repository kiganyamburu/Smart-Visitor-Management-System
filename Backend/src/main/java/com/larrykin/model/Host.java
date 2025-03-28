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
import java.util.List;

@Data
@Document(collection = "hosts")
public class Host implements AppUser {
    @Id
    private String hostId;
    @NotBlank(message = "FullName cannot be null")
    private String fullName;
    @Email(message = "Should be an email")
    private String email;
    @NotBlank(message = "PhoneNumber cannot be null")
    private String phoneNumber;
    private String department;
    @NotNull(message = "Role cannot be null")
    private Role role;
    private List<String> visitorsID;
    @NotBlank(message = "Password cannot be Blank")
    private String password;


    @Override
    @JsonIgnore
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singleton(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }
}

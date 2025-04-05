package com.larrykin.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.larrykin.enums.IDTYPE;
import com.larrykin.enums.Role;
import com.larrykin.enums.Status;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collection;
import java.util.Collections;
import java.util.Date;

@Data
@Document(collection = "staff")
public class Staff implements AppUser {
    @Id
    private String id;
    @NotBlank(message = "FullName cannot be null")
    private String name;
    @Email(message = "Should be an email")
    private String email;
    @NotBlank(message = "PhoneNumber cannot be null")
    private String phoneNumber;
    private IDTYPE idtype;
    private String idNumber;
    private String imageUrl;
    private Date checkInTime;
    private Status status;
    private String department;
    private String gender;
    private Role role = Role.STAFF;
    private String password = null;

    @Override
    @JsonIgnore
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singleton(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }
}

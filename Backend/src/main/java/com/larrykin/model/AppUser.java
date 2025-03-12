package com.larrykin.model;

import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

public interface AppUser {
    String getEmail();
    String getPassword();
    Collection<? extends GrantedAuthority> getAuthorities();
}

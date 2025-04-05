package com.larrykin.model;

   import com.larrykin.enums.Role;
   import org.springframework.security.core.GrantedAuthority;
   import java.util.Collection;

   public interface AppUser {
       String getEmail();
       String getPassword();
       Collection<? extends GrantedAuthority> getAuthorities();
       String getId();
       String getName();
       Role getRole();
   }
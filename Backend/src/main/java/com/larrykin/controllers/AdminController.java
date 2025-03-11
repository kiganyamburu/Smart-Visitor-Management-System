package com.larrykin.controllers;

import com.larrykin.Request.LoginRequest;
import com.larrykin.Response.AuthResponse;
import com.larrykin.enums.Role;
import com.larrykin.exceptions.AdminNotFoundException;
import com.larrykin.jwt.JwtUtils;
import com.larrykin.model.Admin;
import com.larrykin.services.AdminServiceImplementation;
import com.larrykin.services.CustomUserDetailsService;
import com.larrykin.services.EmailService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationManagerResolver;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.handler.AbstractUrlHandlerMapping;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/admin")
@Tag(name = "Admin", description = "Admin API's")
public class AdminController {
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtUtils jwtUtils;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private CustomUserDetailsService customUserDetailsService;
    @Autowired
    private AdminServiceImplementation service;
    @Autowired
    private EmailService emailService;


    //? register anew admin
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> createAdmin(@Valid @RequestBody Admin admin) throws Exception {
        try {
            service.findAdminByEmail(admin.getEmail());
            throw new Exception("Email already exists with another account");
        } catch (AdminNotFoundException ignored) {
            //Admin not found proceed with registration
        }

        //if not, encode password and save admin
        try {
            Admin _admin = new Admin();
            _admin.setFullName(admin.getFullName());
            _admin.setPhoneNumber(admin.getPhoneNumber());
            _admin.setEmail(admin.getEmail());
            _admin.setRole(admin.getRole());
            _admin.setPassword(passwordEncoder.encode(admin.getPassword()));

            log.info("AdminController:: Registering admin: {}", _admin);
            Admin createdAdmin = service.createAdmin(admin);
            log.info("Admin saved: {}", createdAdmin);

            Authentication authentication = new UsernamePasswordAuthenticationToken(admin.getEmail(), admin.getPassword());
            SecurityContextHolder.getContext().setAuthentication(authentication);

            UserDetails userDetails = customUserDetailsService.loadUserByUsername(admin.getEmail());

            String jwt = jwtUtils.generateTokenFromUsername(userDetails);

            AuthResponse authResponse = new AuthResponse();
            authResponse.setJwtToken(jwt);
            authResponse.setMessage("Admin registered successfully");
            authResponse.setRole(admin.getRole());


            return ResponseEntity.ok(authResponse);
        } catch (Exception e) {
            throw new Exception("Error occured while registering user" + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest loginRequest) throws Exception {
        try {
            //authenticate with configured authentication method
            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

            if (authentication.isAuthenticated()) {
                UserDetails userDetails = customUserDetailsService.loadUserByUsername(loginRequest.getEmail());
                String jwt = jwtUtils.generateTokenFromUsername(userDetails);

                String role = userDetails.getAuthorities().stream().findFirst().get().getAuthority();

                AuthResponse authResponse = new AuthResponse();
                authResponse.setJwtToken(jwt);
                authResponse.setMessage("Admin logged in successfully");
                authResponse.setRole(Role.valueOf(role));

                return ResponseEntity.ok(authResponse);
            } else {
                throw new AdminNotFoundException("Invalid email or password");
            }
        } catch (Exception e) {
            throw new Exception("Error occurred while logging in admin" + e.getMessage());
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<AuthResponse> logout() {
        SecurityContextHolder.clearContext();

        AuthResponse authResponse = new AuthResponse();
        authResponse.setMessage("Admin logged out Successfully");
        return ResponseEntity.ok(authResponse);
    }

    @GetMapping
    public ResponseEntity<List<Admin>> getAllAdmin() {
        return ResponseEntity.ok(service.getAllAdmins());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Admin> getAdminById(@PathVariable("id") String id) {
        return ResponseEntity.ok(service.getAdminById(id));
    }

    @Secured("ADMIN")
    @PutMapping("/{id}")
    public ResponseEntity<Admin> updateAdmin(@PathVariable("id") String id, @Valid @RequestBody Admin admin) {
        return new ResponseEntity<>(service.updateAdmin(id, admin), HttpStatus.OK);
    }

    @Secured("ADMIN")
    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> deleteAdmin(@PathVariable("id") String id) {
        return ResponseEntity.ok(service.deleteAdmin(id));
    }
}

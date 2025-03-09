package com.larrykin.controllers;

import com.larrykin.entity.Admin;
import com.larrykin.services.AdminServiceImplementation;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/admin")
public class AdminController {
    @Autowired
    private AdminServiceImplementation service;

    @PostMapping
    public ResponseEntity<Admin> createAdmin(@Valid @RequestBody Admin admin) {
        return ResponseEntity.ok(service.createAdmin(admin));
    }

    @GetMapping
    public ResponseEntity<List<Admin>> getAllAdmin() {
        return ResponseEntity.ok(service.getAllAdmins());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Admin> getAdminById(@PathVariable("id") String id) {
        return ResponseEntity.ok(service.getAdminById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Admin> updateAdmin( @PathVariable("id") String id,@Valid @RequestBody Admin admin) {
        return new ResponseEntity<>(service.updateAdmin(id, admin), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public boolean deleteAdmin(@PathVariable("id") String id) {
        return service.deleteAdmin(id);
    }
}

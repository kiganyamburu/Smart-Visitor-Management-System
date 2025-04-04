package com.larrykin.controllers;

import com.larrykin.model.Staff;
import com.larrykin.services.StaffServiceImplementation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/staff")
@Tag(name="Staff", description = "Staff API's")
public class StaffController {
    @Autowired
    private StaffServiceImplementation service;

    @PostMapping
    public ResponseEntity<Staff> save(@Valid @RequestBody Staff staff) {
        return ResponseEntity.ok(service.createStaff(staff));
    }

    @GetMapping
    public ResponseEntity<List<Staff>> findAll() {
        return ResponseEntity.ok(service.getAllStaff());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Staff> findById(@PathVariable("id") String id) {
        return ResponseEntity.ok(service.getStaffById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Staff> update(@PathVariable("id") String id, @Valid @RequestBody Staff staff) {
        return ResponseEntity.ok(service.updateStaff(id, staff));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> delete(@PathVariable("id") String id) {
        return ResponseEntity.ok(service.deleteStaff(id));
    }
}

package com.larrykin.controllers;

import com.larrykin.entity.AuditLog;
import com.larrykin.services.AuditLogServiceImplementation;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/auditlog")
public class AuditLogController {
    @Autowired
    private AuditLogServiceImplementation service;

    @PostMapping
    public ResponseEntity<AuditLog> saveAuditLog(@Valid @RequestBody AuditLog auditLog) {
        return ResponseEntity.ok(service.createAuditLog(auditLog));
    }

    @GetMapping
    public ResponseEntity<List<AuditLog>> findAll() {
        return ResponseEntity.ok(service.getAllAuditLog());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AuditLog> findById(@PathVariable("id") String id) {
        return ResponseEntity.ok(service.getAuditLogById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AuditLog> updateAuditLog(@PathVariable("id") String id, @Valid @RequestBody AuditLog auditLog) {
        return ResponseEntity.ok(service.updateAuditLog(id, auditLog));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> deleteAuditLog(@PathVariable("id") String id) {
        return ResponseEntity.ok(service.deleteAuditLog(id));
    }
}

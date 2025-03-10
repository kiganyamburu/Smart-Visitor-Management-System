package com.larrykin.controllers;

import com.larrykin.entity.VisitorLog;
import com.larrykin.services.VisitorLogServiceImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/visitorlog")
public class VisitorLogController {
    @Autowired
    private VisitorLogServiceImpl service;

    @PostMapping
    public ResponseEntity<VisitorLog> save(@Valid @RequestBody VisitorLog visitorLog) {
        return ResponseEntity.ok(service.createVisitorLog(visitorLog));
    }

    @GetMapping
    public ResponseEntity<List<VisitorLog>> findAll() {
        return ResponseEntity.ok(service.getAllVisitorLogs());
    }

    @GetMapping("/{id}")
    public ResponseEntity<VisitorLog> findById(@PathVariable("id") String id) {
        return ResponseEntity.ok(service.getVisitorLogById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<VisitorLog> update(@PathVariable("id") String id, @Valid @RequestBody VisitorLog visitorLog) {
        return ResponseEntity.ok(service.updateVisitorLog(id, visitorLog));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> delete(@PathVariable("id") String id) {
        return ResponseEntity.ok(service.deleteVisitorLog(id));
    }
}

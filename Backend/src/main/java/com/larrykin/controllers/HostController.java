package com.larrykin.controllers;

import com.larrykin.entity.Host;
import com.larrykin.services.HostServiceImplementation;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/host")
public class HostController {
    @Autowired
    private HostServiceImplementation service;

    @PostMapping
    public ResponseEntity<Host> save(@Valid @RequestBody Host host) {
        return ResponseEntity.ok(service.createHost(host));
    }

    @GetMapping
    public ResponseEntity<List<Host>> findAll() {
        return ResponseEntity.ok(service.getAllHosts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Host> findById(@PathVariable("id") String id) {
        return ResponseEntity.ok(service.getHostById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Host> update(@PathVariable("id") String id, @Valid @RequestBody Host host) {
        return ResponseEntity.ok(service.updateHost(id, host));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> delete(@PathVariable("id") String id) {
        return ResponseEntity.ok(service.deleteHost(id));
    }
}

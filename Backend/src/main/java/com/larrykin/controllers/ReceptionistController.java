package com.larrykin.controllers;

import com.larrykin.entity.Receptionist;
import com.larrykin.services.ReceptionistServiceImplementation;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/receptionist")
public class ReceptionistController {
    @Autowired
    private ReceptionistServiceImplementation service;

    @PostMapping
    public ResponseEntity<Receptionist> save(@Valid @RequestBody Receptionist receptionist) {
        return ResponseEntity.ok(service.createReceptionist(receptionist));
    }

    @GetMapping
    public ResponseEntity<List<Receptionist>> findAll() {
        return ResponseEntity.ok(service.getAllReceptionists());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Receptionist> findById(@PathVariable("id") String id) {
        return ResponseEntity.ok(service.getReceptionistById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Receptionist> update(@PathVariable("id") String id, @Valid @RequestBody Receptionist receptionist) {
        return ResponseEntity.ok(service.updateReceptionist(id, receptionist));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> delete(@PathVariable("id") String id) {
        return ResponseEntity.ok(service.deleteReceptionist(id));
    }

}

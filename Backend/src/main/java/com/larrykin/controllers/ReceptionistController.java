package com.larrykin.controllers;

import com.larrykin.model.Receptionist;
import com.larrykin.services.ReceptionistServiceImplementation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/receptionist")
@Tag(name="Reception", description = "Receptionist API's")
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

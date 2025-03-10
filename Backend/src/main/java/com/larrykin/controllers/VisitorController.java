package com.larrykin.controllers;

import com.larrykin.model.Visitor;
import com.larrykin.services.VisitorServiceImpl;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/visitor")
@Tag(name= "Visitor", description = "Visitor API's")
public class VisitorController {
    @Autowired
    private VisitorServiceImpl service;

    @PostMapping
    public ResponseEntity<Visitor> save(@Valid @RequestBody Visitor visitor) {
        return ResponseEntity.ok(service.createVisitor(visitor));
    }

    @GetMapping
    public ResponseEntity<List<Visitor>> findAll() {
        return ResponseEntity.ok(service.getAllVisitors());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Visitor> findById(@PathVariable("id") String id) {
        return ResponseEntity.ok(service.getVisitorById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Visitor> update(@PathVariable("id") String id, @Valid @RequestBody Visitor visitor) {
        return ResponseEntity.ok(service.updateVisitor(id, visitor));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> delete(@PathVariable("id") String id) {
        return ResponseEntity.ok(service.deleteVisitor(id));
    }
}

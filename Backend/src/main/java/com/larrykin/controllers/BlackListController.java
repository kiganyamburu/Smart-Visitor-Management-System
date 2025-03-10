package com.larrykin.controllers;

import com.larrykin.model.BlackList;
import com.larrykin.services.BlackListServiceImplementation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/blacklist")
@Tag(name = "BlackList", description = "BlackList API's")
public class BlackListController {
    @Autowired
    private BlackListServiceImplementation service;

    @PostMapping
    public ResponseEntity<BlackList> save(@Valid @RequestBody BlackList blackList) {
        return ResponseEntity.ok(service.createBlackList(blackList));
    }

    @GetMapping
    public ResponseEntity<List<BlackList>> findAll() {
        return ResponseEntity.ok(service.getAllBlackLists());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BlackList> findById(@PathVariable("id") String id) {
        return ResponseEntity.ok(service.getBlackListById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BlackList> update(@PathVariable("id") String id, @Valid @RequestBody BlackList blackList) {
        return ResponseEntity.ok(service.updateBlackList(id, blackList));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> delete(@PathVariable("id") String id) {
        return ResponseEntity.ok(service.deleteBlackList(id));
    }
}

package com.larrykin.controllers;

import com.larrykin.entity.Notification;
import com.larrykin.services.NotificationServiceImplementation;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notification")
public class NotificationController {
    @Autowired
    private NotificationServiceImplementation service;

    @PostMapping
    public ResponseEntity<Notification> save(@Valid @RequestBody Notification notification) {
        return ResponseEntity.ok(service.createNotification(notification));
    }

    @GetMapping
    public ResponseEntity<List<Notification>> findAll() {
        return ResponseEntity.ok(service.getAllNotifications());
    }

    @GetMapping("/{id?")
    public ResponseEntity<Notification> findById(@PathVariable("id") String id) {
        return ResponseEntity.ok(service.getNotificationById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Notification> updateNotification(@PathVariable("id") String id, @Valid @RequestBody Notification notification) {
        return ResponseEntity.ok(service.updateNotification(id, notification));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> delete(@PathVariable("id") String id) {
        return ResponseEntity.ok(service.deleteNotification(id));
    }
}

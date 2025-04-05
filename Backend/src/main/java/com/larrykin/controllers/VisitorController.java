package com.larrykin.controllers;

import com.larrykin.Response.VisitorResponse;
import com.larrykin.enums.Status;
import com.larrykin.model.Visitor;
import com.larrykin.services.VisitorServiceImpl;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.SecureRandom;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/visitor")
@Tag(name = "Visitor", description = "Visitor API's")
public class VisitorController {
    @Autowired
    private VisitorServiceImpl service;

    @PostMapping
    public ResponseEntity<Visitor> save(@Valid @RequestBody Visitor visitor) {
        //Check if user exists
        try {
            Visitor exist = service.findVisitorByEmail(visitor.getEmail());
            if (exist != null) {
                ResponseEntity.badRequest().body("You are already Checked in");
            }
        }catch (Exception ignored){}

        return ResponseEntity.ok(service.createVisitor(visitor));
    }

    @PostMapping("/manual-checkin")
    public ResponseEntity<Visitor> manual(@Valid @RequestBody Visitor visitor) {
        Visitor visitorResponse = service.manualCheckIn(visitor);
        log.info("Visitor: {}", visitorResponse);
        return ResponseEntity.ok(visitorResponse);
    }

    @PostMapping("/guest-checkin")
    public ResponseEntity<Visitor> guestCheckIn(@Valid @RequestBody Visitor visitor) {
        Visitor visitorResponse = service.guestCheckin(visitor);
        log.info("Guest Visitor: {}", visitorResponse);
        return ResponseEntity.ok(visitorResponse);
    }

    @GetMapping("/{id}/checkout-qr")
    public ResponseEntity<String> checkout(@PathVariable("id") String id) {
        Visitor visitor = service.getVisitorById(id);
        if (visitor.getStatus() != Status.CHECKED_IN) {
            return ResponseEntity.badRequest().body("You must be checked in first to check out");
        }
        if (visitor.getStatus() != Status.CHECKED_OUT) {
            visitor.setStatus(Status.CHECKED_OUT);
            service.updateVisitor(id, visitor);
            log.info("checked out");
            return ResponseEntity.ok(visitor.getName() + " Checked out Successfully");
        } else {
            log.info("Already checked out");
            return ResponseEntity.badRequest().body("Visitor already checked out");
        }
    }

    @GetMapping("/{id}/checkout-id")
    public ResponseEntity<String> checkoutId(@PathVariable("id") String id) {
        Visitor visitor = service.findByIdNumber(id);
        if (visitor.getStatus() != Status.CHECKED_IN) {
            return ResponseEntity.badRequest().body("You must be checked in first to check out");
        }
        if (visitor.getStatus() != Status.CHECKED_OUT) {
            visitor.setStatus(Status.CHECKED_OUT);
            service.updateVisitor(id, visitor);
            log.info("Checked out");
            return ResponseEntity.ok(visitor.getName() + " Checked out Successfully");
        } else {
            log.info("Already checked out");
            return ResponseEntity.badRequest().body("Visitor already checked out");
        }
    }

    @GetMapping
    public ResponseEntity<List<Visitor>> findAll() {
        return ResponseEntity.ok(service.getAllVisitors());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Visitor> findById(@PathVariable("id") String id) {

        Visitor visitor = service.getVisitorById(id);
        log.info("Visitor: {}", visitor);
        return ResponseEntity.ok(visitor);
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<Visitor> findByEmail(@PathVariable("email") String email) {

        Visitor visitor = service.findVisitorByEmail(email);
        log.info("Visitor: {}", visitor);
        return ResponseEntity.ok(visitor);
    }

    @GetMapping("/{id}/checkin")
    private ResponseEntity<VisitorResponse> checkinVisitor(@PathVariable("id") String id) {
        log.info("Checkin before: {}", id);
        VisitorResponse visitorResponse = service.checkin(id);
        log.info("Visitor Response:{}", visitorResponse);
        return ResponseEntity.ok(visitorResponse);
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

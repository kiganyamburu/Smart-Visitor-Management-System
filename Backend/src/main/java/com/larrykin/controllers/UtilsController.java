package com.larrykin.controllers;

import com.larrykin.model.Staff;
import com.larrykin.model.Stats;
import com.larrykin.model.Visitor;
import com.larrykin.services.StaffService;
import com.larrykin.services.VisitorService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/utils")
@Tag(name = "Utils", description = "Utils API's")
public class UtilsController {
    @Autowired
    private VisitorService visitorService;
    @Autowired
    private StaffService staffService;

    @GetMapping
    private ResponseEntity<Stats> getUtils() {
        Stats stats = new Stats();
        //* get all staff
        List<Staff> staff = staffService.getAllStaff();
        int staffCount = staff.size();

        //* get all visitors
        List<Visitor> visitors = visitorService.getAllVisitors();
        int visitorCount = visitors.size();

        //* total preRegister -- (where qr exist)
        int preRegister = 0;
        int males = 0;
        int females = 0;
        int others = 0;
        for (Visitor v : visitors) {
            if (v.getQrCode() != null && !v.getQrCode().isEmpty()) preRegister++;
            if (v.getGender().equalsIgnoreCase("male")) males++;
            if (v.getGender().equalsIgnoreCase("female")) females++;
            if (v.getGender().equalsIgnoreCase("other")) others++;
        }

        //* get last 7 visitors
        List<Visitor> lastVisitors = visitors.subList(Math.max(visitors.size() - 7, 0), visitors.size());


        stats.setTotalEmployee(staffCount);
        stats.setTotalVisitors(visitorCount);
        stats.setTotalPreRegister(preRegister);
        stats.setMaleVisitors(males);
        stats.setFemaleVisitors(females);
        stats.setOtherVisitors(others);
        stats.setRecentVisitors(lastVisitors);
        return ResponseEntity.ok(stats);
    }
}

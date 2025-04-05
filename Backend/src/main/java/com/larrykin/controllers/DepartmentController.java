package com.larrykin.controllers;

import com.larrykin.model.Department;
import com.larrykin.services.DepartmentService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/department")
@Tag(name = "Department", description = "Department's API's")
public class DepartmentController {
    @Autowired
    private DepartmentService departmentService;

    @PostMapping
    public ResponseEntity<Department> createDepartment(@RequestBody Department department) {
        return ResponseEntity.ok(departmentService.save(department));
    }

    @GetMapping
    public ResponseEntity<List<Department>> findAllDepartments() {
        return ResponseEntity.ok(departmentService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Department> findById(@PathVariable("id") String id) {
        return ResponseEntity.ok(departmentService.findById(id).orElseThrow(() -> new RuntimeException("Department not found")));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Department> updateDepartment(@PathVariable("id") String id, @RequestBody Department department) {
        department.setId(id);
        return ResponseEntity.ok(departmentService.update(department));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteById(@PathVariable("id") String id) {
        departmentService.deleteById(id);
        return ResponseEntity.ok("Department deleted successfully");
    }
}

package com.larrykin.services;

import com.larrykin.model.Department;

import java.util.List;
import java.util.Optional;

public interface DepartmentService {
    Department save(Department department);

    Optional<Department> findById(String id);

    List<Department> findAll();

    Department update(Department department);

    void deleteById(String id);
}

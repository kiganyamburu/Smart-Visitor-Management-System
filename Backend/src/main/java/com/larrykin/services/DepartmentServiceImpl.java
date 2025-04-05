package com.larrykin.services;

import com.larrykin.model.Department;
import com.larrykin.repositories.DepartmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DepartmentServiceImpl implements DepartmentService {
    private DepartmentRepository departmentRepository;

    public DepartmentServiceImpl(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    @Override
    public Department save(Department department) {
        return departmentRepository.save(department);
    }

    @Override
    public Optional<Department> findById(String id) {
        return Optional.ofNullable(departmentRepository.findById(id).orElseThrow(() -> new RuntimeException("Department not found")));
    }

    @Override
    public List<Department> findAll() {
        return departmentRepository.findAll();
    }

    @Override
    public Department update(Department department) {
        Department existingDepartment = departmentRepository.findById(department.getId()).orElseThrow(() -> new RuntimeException("Department not found"));
        existingDepartment.setName(department.getName());
        existingDepartment.setLocation(department.getLocation());
        existingDepartment.setReceptionist(department.getReceptionist());
        existingDepartment.setOperatingHours(department.getOperatingHours());
        return null;
    }

    @Override
    public void deleteById(String id) {
        if (!departmentRepository.existsById(id)) {
            throw new RuntimeException("Department not found");
        }
        departmentRepository.deleteById(id);
    }
}

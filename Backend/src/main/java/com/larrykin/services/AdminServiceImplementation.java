package com.larrykin.services;

import com.larrykin.model.Admin;
import com.larrykin.exceptions.AdminNotFoundException;
import com.larrykin.repositories.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminServiceImplementation implements AdminService {
    @Autowired
    private AdminRepository adminRepository;

    @Override
    public Admin createAdmin(Admin admin) {
        return adminRepository.save(admin);
    }

    @Override
    public Admin getAdminById(String adminId) {
        return adminRepository.findById(adminId).orElseThrow(() -> new AdminNotFoundException("Admin with ID:: " + adminId + " not found"));
    }

    @Override
    public Admin findAdminByEmail(String email) {
        return adminRepository.findByEmail(email).orElseThrow(() -> new AdminNotFoundException("Admin with Email " + email + " not found"));
    }

    @Override
    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }

    @Override
    public Admin updateAdmin(String adminId, Admin updatedAdmin) {
        Admin existingAdmin = getAdminById(adminId);
        existingAdmin.setFullName(updatedAdmin.getFullName());
        existingAdmin.setPhoneNumber(updatedAdmin.getPhoneNumber());
        existingAdmin.setRole(updatedAdmin.getRole());
        existingAdmin.setPassword(updatedAdmin.getPassword());
        return adminRepository.save(existingAdmin);
    }

    @Override
    public boolean deleteAdmin(String adminId) {
        Admin existingAdmin = getAdminById(adminId);
        if (existingAdmin != null) {
            adminRepository.deleteById(adminId);
            return true;
        }
        throw new AdminNotFoundException("Admin");
    }
}

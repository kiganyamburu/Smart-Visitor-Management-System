package com.larrykin.services;

import com.larrykin.model.Admin;

import java.util.List;

public interface AdminService {
    Admin createAdmin(Admin admin);

    Admin getAdminById(String adminId);
    Admin findAdminByEmail(String adminId);

    List<Admin> getAllAdmins();

    Admin updateAdmin(String adminId, Admin updatedAdmin);

    boolean deleteAdmin(String adminId);
}

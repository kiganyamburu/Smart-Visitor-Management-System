package com.larrykin.services;

import com.larrykin.entity.Admin;

import java.util.List;

public interface AdminService {
    Admin createAdmin(Admin admin);

    Admin getAdminById(String adminId);

    List<Admin> getAllAdmins();

    Admin updateAdmin(String adminId, Admin updatedAdmin);

    boolean deleteAdmin(String adminId);
}

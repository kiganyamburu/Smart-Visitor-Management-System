package com.larrykin.services;

import com.larrykin.model.Staff;

import java.util.List;

public interface StaffService {
    Staff createStaff(Staff staff);

    Staff getStaffById(String id);
    Staff findStaffByEmail(String email);

    List<Staff> getAllStaff();

    Staff updateStaff(String id, Staff staff);

    boolean deleteStaff(String id);
}

package com.larrykin.services;

import com.larrykin.model.Staff;
import com.larrykin.exceptions.StaffNotFoundException;
import com.larrykin.repositories.StaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class StaffServiceImplementation implements StaffService {
    @Autowired
    private StaffRepository staffRepository;

    @Override
    public Staff createStaff(Staff staff) {
        staff.setCheckInTime(new Date());
        return staffRepository.save(staff);
    }

    @Override
    public Staff getStaffById(String id) {
        return staffRepository.findById(id).orElseThrow(() -> new StaffNotFoundException("Staff with ID " + id + "not found"));
    }

    @Override
    public Staff findStaffByEmail(String email) {
        return staffRepository.findByEmail(email).orElseThrow(() -> new StaffNotFoundException("Staff with Email " + email + "not found"));
    }

    @Override
    public List<Staff> getAllStaff() {
        return staffRepository.findAll();
    }

    @Override
    public Staff updateStaff(String id, Staff staff) {
        Staff existingStaff = getStaffById(id);
        existingStaff.setFullName(staff.getFullName());
        existingStaff.setEmail(staff.getEmail());
        existingStaff.setPhoneNumber(staff.getPhoneNumber());
        existingStaff.setIdtype(staff.getIdtype());
        existingStaff.setIdNumber(staff.getIdNumber());
        existingStaff.setImageUrl(staff.getImageUrl());
        existingStaff.setDepartment(staff.getDepartment());
        existingStaff.setGender(staff.getGender());

        return staffRepository.save(existingStaff);
    }

    @Override
    public boolean deleteStaff(String id) {
        Staff existingStaff = getStaffById(id);
        if (existingStaff != null) {
            staffRepository.deleteById(id);
            return true;
        }
        throw new StaffNotFoundException("Staff with ID " + id + " not found");
    }
}

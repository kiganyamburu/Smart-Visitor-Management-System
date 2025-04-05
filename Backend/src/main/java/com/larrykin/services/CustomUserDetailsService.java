package com.larrykin.services;

import com.larrykin.component.CustomUserDetails;
import com.larrykin.exceptions.AdminNotFoundException;
import com.larrykin.exceptions.StaffNotFoundException;
import com.larrykin.exceptions.ReceptionistNotFoundException;
import com.larrykin.exceptions.VisitorNotFoundException;
import com.larrykin.model.AppUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    @Autowired
    private AdminService adminService;
    @Autowired
    private StaffService staffService;
    @Autowired
    private ReceptionistService receptionistService;
    @Autowired
    private VisitorService visitorService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        AppUser user = null;
        try {
            user = adminService.findAdminByEmail(username);
        } catch (AdminNotFoundException ignored) {
            // Admin not found, try next service
        }

        if (user == null) {
            try {
                user = staffService.findStaffByEmail(username);
            } catch (StaffNotFoundException ignored) {
                //Staff not found , try next service
            }
        }

        if (user == null) {
            try {
                user = receptionistService.findReceptionistByEmail(username);
            } catch (ReceptionistNotFoundException ignored) {
                //Receptionist not found, try next service
            }
        }

        if (user == null) {
            try {
                user = visitorService.findVisitorByEmail(username);
            } catch (VisitorNotFoundException ignored) {
                // Visitor not found, handle exception below
            }
        }

        if (user == null) {
            throw new UsernameNotFoundException("Admin not found with email: " + username);
        }
        return new CustomUserDetails(user);
    }
}

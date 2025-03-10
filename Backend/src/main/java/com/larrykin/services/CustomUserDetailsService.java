package com.larrykin.services;

import com.larrykin.component.CustomUserDetails;
import com.larrykin.model.Admin;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    @Autowired
    private AdminService adminService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Admin admin;
        try{
            admin = adminService.getAdminById(username);
        }catch (Exception e){
            throw new UsernameNotFoundException("Admin not found with Email:" + username, e);
        }
        if(admin == null){
            throw new UsernameNotFoundException("Admin not found with: " + username);
        }
        return new CustomUserDetails(admin);
    }
}

package com.larrykin.services;

import com.larrykin.model.Host;
import com.larrykin.exceptions.HostNotFoundException;
import com.larrykin.repositories.HostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HostServiceImplementation implements HostService {
    @Autowired
    private HostRepository hostRepository;

    @Override
    public Host createHost(Host host) {
        return hostRepository.save(host);
    }

    @Override
    public Host getHostById(String id) {
        return hostRepository.findById(id).orElseThrow(() -> new HostNotFoundException("Host with ID " + id + "not found"));
    }

    @Override
    public List<Host> getAllHosts() {
        return hostRepository.findAll();
    }

    @Override
    public Host updateHost(String id, Host host) {
        Host existingHost = getHostById(id);
        existingHost.setFullName(host.getFullName());
        existingHost.setEmail(host.getEmail());
        existingHost.setPhoneNumber(host.getPhoneNumber());
        existingHost.setDepartment(host.getDepartment());
        existingHost.setRole(host.getRole());
        existingHost.setVisitorsID(host.getVisitorsID());


        return hostRepository.save(existingHost);
    }

    @Override
    public boolean deleteHost(String id) {
        Host existingHost = getHostById(id);
        if (existingHost != null) {
            hostRepository.deleteById(id);
            return true;
        }
        throw new HostNotFoundException("Host with ID " + id + " not found");
    }
}

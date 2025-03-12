package com.larrykin.services;

import com.larrykin.model.Host;

import java.util.List;

public interface HostService {
    Host createHost(Host host);

    Host getHostById(String id);
    Host findHostByEmail(String email);

    List<Host> getAllHosts();

    Host updateHost(String id, Host host);

    boolean deleteHost(String id);
}

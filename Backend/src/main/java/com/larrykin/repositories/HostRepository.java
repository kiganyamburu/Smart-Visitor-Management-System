package com.larrykin.repositories;

import com.larrykin.model.Host;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HostRepository extends MongoRepository<Host, String> {
    Optional<Host> findByEmail(String email);
}

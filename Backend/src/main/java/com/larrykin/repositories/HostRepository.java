package com.larrykin.repositories;

import com.larrykin.model.Host;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HostRepository extends MongoRepository<Host, String> {
}

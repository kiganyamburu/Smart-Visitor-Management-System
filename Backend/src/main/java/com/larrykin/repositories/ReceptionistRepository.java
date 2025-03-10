package com.larrykin.repositories;

import com.larrykin.model.Receptionist;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReceptionistRepository extends MongoRepository<Receptionist, String> {
}

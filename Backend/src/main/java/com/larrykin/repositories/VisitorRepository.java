package com.larrykin.repositories;

import com.larrykin.model.Visitor;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VisitorRepository extends MongoRepository<Visitor, String> {
    Optional<Visitor> findByEmail(String email);
}

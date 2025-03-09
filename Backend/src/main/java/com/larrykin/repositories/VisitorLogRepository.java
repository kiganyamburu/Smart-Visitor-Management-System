package com.larrykin.repositories;

import com.larrykin.entity.VisitorLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VisitorLogRepository extends MongoRepository<VisitorLog, String> {
}

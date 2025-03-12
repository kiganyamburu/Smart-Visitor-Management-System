package com.larrykin.repositories;

import com.larrykin.model.BlackList;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BlackListRepository extends MongoRepository<BlackList, String> {
}

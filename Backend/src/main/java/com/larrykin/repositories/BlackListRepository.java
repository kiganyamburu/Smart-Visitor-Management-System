package com.larrykin.repositories;

import com.larrykin.entity.BlackList;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BlackListRepository extends MongoRepository<BlackList, String> {
}

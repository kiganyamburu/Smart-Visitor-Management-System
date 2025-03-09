package com.larrykin.services;

import com.larrykin.entity.BlackList;
import com.larrykin.exceptions.BlackListNotFoundException;
import com.larrykin.repositories.BlackListRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BlackListServiceImplementation implements BlackListService {
    @Autowired
    private BlackListRepository blackListRepository;

    @Override
    public BlackList createBlackList(BlackList blackList) {
        return blackListRepository.save(blackList);
    }

    @Override
    public BlackList getBlackListById(String id) {
        return blackListRepository.findById(id).orElseThrow(() -> new BlackListNotFoundException("BlackList with ID" + id + "not found"));
    }

    @Override
    public List<BlackList> getAllBlackLists() {
        return blackListRepository.findAll();
    }

    @Override
    public BlackList updateBlackList(String id, BlackList updatedBLacklist) {
        BlackList existingBlackList = getBlackListById(id);
        existingBlackList.setFullName(updatedBLacklist.getFullName());
        existingBlackList.setIdNumber(updatedBLacklist.getIdNumber());
        existingBlackList.setReason(updatedBLacklist.getReason());
        existingBlackList.setAdminId(updatedBLacklist.getAdminId());

        return blackListRepository.save(existingBlackList);
    }

    @Override
    public boolean deleteBlackList(String id) {
        BlackList blackList = getBlackListById(id);
        if (blackList != null) {
            blackListRepository.deleteById(id);
            return true;
        }
        return false;
    }
}

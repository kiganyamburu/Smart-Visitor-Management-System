package com.larrykin.services;

import com.larrykin.model.BlackList;

import java.util.List;

public interface BlackListService {
    BlackList createBlackList(BlackList blackList);

    BlackList getBlackListById(String id);

    List<BlackList> getAllBlackLists();

    BlackList updateBlackList(String id, BlackList updatedBLacklist);

    boolean deleteBlackList(String id);
}

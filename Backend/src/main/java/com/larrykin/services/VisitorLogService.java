package com.larrykin.services;

import com.larrykin.model.VisitorLog;

import java.util.List;

public interface VisitorLogService {
    VisitorLog createVisitorLog(VisitorLog visitorLog);

    VisitorLog getVisitorLogById(String id);

    List<VisitorLog> getAllVisitorLogs();

    VisitorLog updateVisitorLog(String id, VisitorLog visitorLog);

    boolean deleteVisitorLog(String id);
}

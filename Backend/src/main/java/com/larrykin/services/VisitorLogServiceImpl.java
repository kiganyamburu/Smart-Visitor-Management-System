package com.larrykin.services;

import com.larrykin.model.VisitorLog;
import com.larrykin.exceptions.VisitorLogNotFoundException;
import com.larrykin.repositories.VisitorLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VisitorLogServiceImpl implements VisitorLogService {
    @Autowired
    private VisitorLogRepository visitorLogRepository;

    @Override
    public VisitorLog createVisitorLog(VisitorLog visitorLog) {
        return visitorLogRepository.save(visitorLog);
    }

    @Override
    public VisitorLog getVisitorLogById(String id) {
        return visitorLogRepository.findById(id).orElseThrow(() -> new VisitorLogNotFoundException("VisitorLog with ID" + id + "not found"));
    }

    @Override
    public List<VisitorLog> getAllVisitorLogs() {
        return visitorLogRepository.findAll();
    }

    @Override
    public VisitorLog updateVisitorLog(String id, VisitorLog visitorLog) {
        VisitorLog existingVisitorLog = getVisitorLogById(id);
        existingVisitorLog.setVisitorId(visitorLog.getVisitorId());
        existingVisitorLog.setHostId(visitorLog.getHostId());
        existingVisitorLog.setCheckInTime(visitorLog.getCheckInTime());
        existingVisitorLog.setCheckOutTime(visitorLog.getCheckOutTime());
        existingVisitorLog.setVerificationStatus(visitorLog.isVerificationStatus());
        existingVisitorLog.setApprovedByHost(visitorLog.isApprovedByHost());
        existingVisitorLog.setNotes(visitorLog.getNotes());

        return visitorLogRepository.save(existingVisitorLog);
    }

    @Override
    public boolean deleteVisitorLog(String id) {
        return false;
    }
}

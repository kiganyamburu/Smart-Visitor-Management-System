package com.larrykin.services;

import com.larrykin.entity.AuditLog;
import com.larrykin.exceptions.AuditLogNotFoundException;
import com.larrykin.repositories.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuditLogServiceImplementation implements AuditLogService {
    @Autowired
    private AuditLogRepository auditLogRepository;


    @Override
    public AuditLog createAuditLog(AuditLog auditLog) {
        return auditLogRepository.save(auditLog);
    }

    @Override
    public AuditLog getAuditLogById(String auditLogId) {
        return auditLogRepository.findById(auditLogId).orElseThrow(() -> new AuditLogNotFoundException("AuditLog with ID" + auditLogId + "not found"));
    }

    @Override
    public List<AuditLog> getAllAuditLog() {
        return auditLogRepository.findAll();
    }

    @Override
    public AuditLog updateAuditLog(String auditLogId, AuditLog updatedAuditLog) {
        AuditLog existingAuditLog = getAuditLogById(auditLogId);
        existingAuditLog.setAction(updatedAuditLog.getAction());
        existingAuditLog.setTimestamp(updatedAuditLog.getTimestamp());
        existingAuditLog.setPerfomedBy(existingAuditLog.getPerfomedBy());
        existingAuditLog.setIpAddress(existingAuditLog.getIpAddress());
        return auditLogRepository.save(existingAuditLog);
    }

    @Override
    public boolean deleteAuditLog(String auditLogId) {
        AuditLog auditLog = getAuditLogById(auditLogId);
        if (auditLog != null) {
            auditLogRepository.deleteById(auditLogId);
            return true;
        }
        throw new AuditLogNotFoundException("AuditLog with ID" + auditLogId + "not found");
    }
}

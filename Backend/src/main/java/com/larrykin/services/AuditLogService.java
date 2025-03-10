package com.larrykin.services;

import com.larrykin.model.AuditLog;

import java.util.List;

public interface AuditLogService {
    AuditLog createAuditLog (AuditLog auditLog);
    AuditLog getAuditLogById(String auditLogId);
    List<AuditLog> getAllAuditLog();
    AuditLog updateAuditLog(String auditLogId, AuditLog updatedAuditLog);
    boolean deleteAuditLog(String auditLogId);
}

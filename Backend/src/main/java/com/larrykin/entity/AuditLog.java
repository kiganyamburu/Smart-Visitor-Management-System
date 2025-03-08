package com.larrykin.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@Document(collection = "audit_log")
public class AuditLog {
    @Id
    private String auditLogId;
    private String action;
    private String perfomedBy;
    private Date timestamp;
    private String ipAddress;

}

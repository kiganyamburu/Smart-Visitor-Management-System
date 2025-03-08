package com.larrykin.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@Document(collection = "visitors_logs")
public class VisitorLog {
    @Id
    private String visitorLogId;
    private String visitorId;
    private  String hostId;
    private Date checkInTime;
    private Date checkOutTime;
    private boolean verificationStatus; // true if ID is verified
    private boolean approvedByHost;
    private String notes;

}

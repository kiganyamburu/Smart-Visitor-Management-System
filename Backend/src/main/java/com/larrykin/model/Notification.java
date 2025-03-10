package com.larrykin.model;

import com.larrykin.enums.NotificationStatus;
import com.larrykin.enums.Type;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@Document(collection = "notifications")
public class Notification {
    @Id
    private String notificationId;
    private String recipientId;
    private String message;
    private Type type;
    private NotificationStatus status;
    private Date timestamp;
}

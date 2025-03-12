package com.larrykin.services;

import com.larrykin.model.Notification;

import java.util.List;

public interface NotificationService {
    Notification createNotification(Notification notification);

    Notification getNotificationById(String id);

    List<Notification> getAllNotifications();

    Notification updateNotification(String id, Notification notification);

    boolean deleteNotification(String id);
}

package com.larrykin.services;

import com.larrykin.model.Notification;
import com.larrykin.exceptions.NotificationNotFoundException;
import com.larrykin.repositories.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationServiceImplementation implements NotificationService {
    @Autowired
    private NotificationRepository notificationRepository;

    @Override
    public Notification createNotification(Notification notification) {
        return notificationRepository.save(notification);
    }

    @Override
    public Notification getNotificationById(String id) {
        return notificationRepository.findById(id).orElseThrow(() -> new NotificationNotFoundException("Notification with ID " + id + "not found"));
    }

    @Override
    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    @Override
    public Notification updateNotification(String id, Notification notification) {
        Notification existingNotification = getNotificationById(id);
        existingNotification.setRecipientId(notification.getRecipientId());
        existingNotification.setMessage(notification.getMessage());
        existingNotification.setType(notification.getType());
        existingNotification.setStatus(notification.getStatus());
        existingNotification.setTimestamp(notification.getTimestamp());

        return notificationRepository.save(existingNotification);
    }

    @Override
    public boolean deleteNotification(String id) {
        Notification existingNotification = getNotificationById(id);
        if (existingNotification != null) {
            notificationRepository.deleteById(id);
            return true;
        }
        throw new NotificationNotFoundException("Notification with ID" + id + "not found");
    }
}

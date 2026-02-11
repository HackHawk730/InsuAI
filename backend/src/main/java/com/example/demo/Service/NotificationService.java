package com.example.demo.Service;

import com.example.demo.Object.Notification;
import com.example.demo.Repo.NotificationRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepo notificationRepo;

    public void createNotification(String userId, String title, String message, String type) {
        Notification note = new Notification();
        note.setUserId(userId); // The recipient's ID
        note.setTitle(title);
        note.setMessage(message);
        note.setType(type); // "INFO", "SUCCESS", "ALERT"
        note.setCreatedAt(LocalDateTime.now());
        note.setRead(false);
        
        notificationRepo.save(note);
    }
}
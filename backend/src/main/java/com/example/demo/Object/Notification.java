package com.example.demo.Object;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonProperty;

@Document(collection = "notifications")
public class Notification {
    @Id
    private String id;
    private String userId; // Email or ID of the receiver
    private String title;
    private String message;
    private String type; // "INFO", "SUCCESS", "WARNING", "ERROR"

    private LocalDateTime createdAt = LocalDateTime.now();

    // Default Constructor (Required by Spring Data)
    public Notification() {}

    @JsonProperty("isRead") 
    private boolean isRead = false;

    // Custom Constructor
    public Notification(String userId, String title, String message, String type) {
        this.userId = userId;
        this.title = title;
        this.message = message;
        this.type = type;
        this.createdAt = LocalDateTime.now();
        this.isRead = false;
    }

    // --- GETTERS AND SETTERS ---
    
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public boolean isRead() { return isRead; }
    public void setRead(boolean read) { isRead = read; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

} // <--- YOU WERE MISSING THIS BRACE
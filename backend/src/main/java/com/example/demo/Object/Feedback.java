package com.example.demo.Object;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "feedbacks")
@Data
public class Feedback {
    @Id
    private String id;
    private String appointmentId;
    private String userEmail;
    private String agentEmail;
    private int rating; // 1 to 5
    private String comment;
    private LocalDateTime createdAt;

    public Feedback() {
        this.createdAt = LocalDateTime.now();
    }
}

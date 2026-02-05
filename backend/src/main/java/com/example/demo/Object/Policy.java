package com.example.demo.Object;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "policies")
@Data
public class Policy {
    @Id
    private String id;

    private String userEmail;
    private String typeId;
    private String policyTypeName;
    private String status; // PENDING, APPROVED, REJECTED, CHANGES_REQUESTED
    private String agentComments;
    private LocalDateTime appliedAt;
    private LocalDateTime updatedAt;
    private java.util.Map<String, Object> formData;

}

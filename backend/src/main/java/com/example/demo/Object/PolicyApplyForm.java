package com.example.demo.Object;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.Map;

@Document(collection = "policyApplyForm")
@Data
public class PolicyApplyForm {
    @Id
    private String id;
    private String userEmail;
    private String typeId;
    private String policyTypeName;
    private Map<String, Object> formData;
    private LocalDateTime submittedAt;
}

package com.example.demo.Object;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Document(collection = "Authentication")
public class SignupDTO {

    @Id
    private String id;
    private String name;

    @NotBlank(message = "Email is required ")
    @Email(message = "Invalid email")
    private String email;

    @NotBlank(message = "Role Required")
    private String role;

    private String company;
    private String specialization;
    private String activePolicyType;
    private Double rating;
    private Boolean isApproved; //Admin

    @org.springframework.data.annotation.Transient
    private List<Schedule> agentSchedule;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String confirmPassword;

}

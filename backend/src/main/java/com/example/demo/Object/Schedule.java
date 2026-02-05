package com.example.demo.Object;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Document(collection = "schedules")
public class Schedule {

    @Id
    private String id;
    private String agentEmail;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private String appointmentType;
    private String status;
    private String bookedByUserEmail;
    private String userNote;

}

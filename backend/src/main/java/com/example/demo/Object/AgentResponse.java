package com.example.demo.Object;

import lombok.Data;

import java.util.List;

@Data
public class AgentResponse {

    private String id;
    private String name;
    private String email;
    private String role; // As an "Agent"
    private String company;
    private String specialization;
    private List<Schedule> agentSchedule;
}

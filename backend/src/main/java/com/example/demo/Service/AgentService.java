package com.example.demo.Service;

import com.example.demo.Object.AgentResponse;
import com.example.demo.Object.Schedule;
import com.example.demo.Object.SignupDTO;
import com.example.demo.Repo.ScheduleRepo;
import com.example.demo.Repo.UserDTOREPO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AgentService {

    @Autowired
    private UserDTOREPO userDTOREPO;

    @Autowired
    private ScheduleRepo scheduleRepo;

    // Agent Scheduling Service ----------------
    public String agentScheduling(Schedule schedule, String email) {

        if (!userDTOREPO.existsByEmail(email)) {
            return "User Not Found";
        }

        Schedule s1 = new Schedule();
        s1.setAgentEmail(email);
        s1.setDate(schedule.getDate());
        s1.setStatus(schedule.getStatus());
        s1.setStartTime(schedule.getStartTime());
        s1.setEndTime(schedule.getEndTime());
        s1.setAppointmentType(schedule.getAppointmentType());
        s1.setBookedByUserEmail(null);

        scheduleRepo.save(s1);

        return "Successfully scheduled";
    }

    // Fetch all agents with their availability ------------------------
    public List<AgentResponse> getAllAgentsWithAvailability() {
        List<SignupDTO> agents = userDTOREPO.findByRole("Agent");

        return agents.stream().map(agent -> {
            AgentResponse res = new AgentResponse();
            res.setId(agent.getId());
            res.setName(agent.getName());
            res.setEmail(agent.getEmail());
            res.setRole(agent.getRole());
            res.setCompany(agent.getCompany());
            res.setSpecialization(agent.getSpecialization());

            List<Schedule> schedules = scheduleRepo.findByAgentEmail(agent.getEmail());
            res.setAgentSchedule(schedules);

            return res;
        }).collect(Collectors.toList());
    }

    // Slot Booking by User --------------------------
    public String bookSchedule(String agentEmail,
            String scheduleId,
            String userEmail,
            String userNote,
            String startTime,
            String endTime,
            String appointmentType) {

        Optional<Schedule> scheduleOpt = scheduleRepo.findById(scheduleId);
        if (!scheduleOpt.isPresent()) {
            return "Slot not found";
        }

        Schedule s = scheduleOpt.get();

        if (!"Available".equalsIgnoreCase(s.getStatus())) {
            return "Slot not available or already booked";
        }

        s.setStatus("Booked");
        s.setBookedByUserEmail(userEmail);
        s.setUserNote(userNote);

        scheduleRepo.save(s);

        return "Slot booked successfully";
    }

    // All Booked Appointment of Agent in Agent Dashboard(My Appointments)
    // ------------------------------------------
    public List<Schedule> getAgentBookedRequests(String agentEmail) {
        List<Schedule> allSchedules = scheduleRepo.findByAgentEmail(agentEmail);

        return allSchedules.stream()
                .filter(s -> s.getBookedByUserEmail() != null && !s.getBookedByUserEmail().isEmpty())
                // Return interactions
                .collect(Collectors.toList());
    }

    // Schedule Status Update ----------------------------------------------
    public String updateScheduleStatus(String agentEmail, String scheduleId, String newStatus) {

        Optional<Schedule> schedule = scheduleRepo.findById(scheduleId);
        if (!schedule.isPresent())
            return "Schedule not found";

        Schedule s = schedule.get();
        if (!agentEmail.equalsIgnoreCase(s.getAgentEmail())) {
            return "Unauthorized access to schedule";
        }

        s.setStatus(newStatus);
        scheduleRepo.save(s);
        return "Status updated to " + newStatus;
    }

    // For All Booked Schedule -----------------------------
    public List<Schedule> getAllBookedSchedules() {
        return scheduleRepo.findAll().stream()
                .filter(s -> s.getBookedByUserEmail() != null && !s.getBookedByUserEmail().isEmpty())
                .collect(Collectors.toList());
    }
}

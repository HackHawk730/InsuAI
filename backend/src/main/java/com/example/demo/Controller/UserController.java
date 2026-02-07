package com.example.demo.Controller;

import com.example.demo.Object.*;
import com.example.demo.Service.AgentService;
import com.example.demo.Service.AuthService;
import com.example.demo.Service.PolicyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.Arrays; // Added for sample data
import java.util.Map;    // Added for sample data

@RestController
@RequestMapping("/InsureAi")
public class UserController {

    @Autowired
    private AuthService AuthService;

    @Autowired
    private AgentService agentService;

    @Autowired
    private PolicyService policyService;

    // 0:SignUp Endpoint ------------------
    @PostMapping("/singup")
    public String singupUser(@Validated @RequestBody SignupDTO user) {

        String result = AuthService.registerUser(user);
        return result;
    }

    // 1:SignIn Endpoint----------------------------
    @PostMapping("/singin")
    public ResponseEntity<?> getUser(@Validated @RequestBody LoginDTO loginDTO) {

        LoginResponse result = AuthService.loginUser(loginDTO);
        if (result.isSuccess()) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.badRequest().body(result);
        }
    }

    // 2:Agent Schedule Endpoint --------------------------
    @PostMapping("/agentSchedule")
    public ResponseEntity<String> agentSchedule(@Validated @RequestBody Schedule schedule, @RequestParam String email) {
        String res = agentService.agentScheduling(schedule, email);
        return ResponseEntity.ok(res);
    }

    // 3:Fetch all Agent with Availabilities For User Dashboard-Booking Appointment
    // -------------------------
    @GetMapping("/agents/available")
    public ResponseEntity<List<AgentResponse>> getAllAgentsWithAvailability() {
        List<AgentResponse> agents = agentService.getAllAgentsWithAvailability();
        return ResponseEntity.ok(agents);
    }

    // 4.Book a schedule slot by User
    @PostMapping("/bookSchedule")
    public ResponseEntity<String> bookSchedule(@RequestBody BookRequest request) {
        String res = agentService.bookSchedule(
                request.agentEmail,
                request.scheduleId,
                request.userEmail,
                request.userNote,
                request.startTime,
                request.endTime,
                request.appointmentType);
        return ResponseEntity.ok(res);
    }

    // 5.Agent dashboard: show real booked requests for this agent
    @GetMapping("/agentRequests")
    public ResponseEntity<List<Schedule>> agentRequests(@RequestParam String email) {
        List<Schedule> res = agentService.getAgentBookedRequests(email);
        return ResponseEntity.ok(res);
    }

    // 6.Schedule Update Endpoint ----------------------
    @PostMapping("/updateScheduleStatus")
    public ResponseEntity<String> updateScheduleStatus(@RequestParam String email, @RequestParam String scheduleId,
            @RequestParam String status) {
        String res = agentService.updateScheduleStatus(email, scheduleId, status);
        return ResponseEntity.ok(res);
    }

    // 7.Apply for policies
    @PostMapping("/applyPolicy")
    public ResponseEntity<Policy> applyPolicy(@RequestBody PolicyRequest request) {
        Policy policy = policyService.applyForPolicy(request.userEmail, request.typeId, request.policyTypeName,
                request.formData);
        return ResponseEntity.ok(policy);
    }

    // 8:Fetch policy that associated With user
    @GetMapping("/myPolicies")
    public ResponseEntity<List<Policy>> getMyPolicies(@RequestParam String email) {
        return ResponseEntity.ok(policyService.getUserPolicies(email));
    }

    // 9:fetch all policies
    @GetMapping("/allPolicies")
    public ResponseEntity<List<Policy>> getAllPolicies(@RequestParam(required = false) String email) {
        if (email != null && !email.isEmpty()) {
            Optional<SignupDTO> userOpt = AuthService.getUserByEmail(email);
            if (userOpt.isPresent()) {
                SignupDTO user = userOpt.get();
                if ("Agent".equals(user.getRole()) && user.getSpecialization() != null) {
                    return ResponseEntity.ok(policyService.getPoliciesBySpecialization(user.getSpecialization()));
                }
            }
        }
        return ResponseEntity.ok(policyService.getAllPolicies());
    }

    // 10:Update Policy with Status
    @PostMapping("/updatePolicy")
    public ResponseEntity<Policy> updatePolicy(@RequestBody UpdatePolicyRequest request) {
        Policy policy = policyService.updatePolicyStatus(request.policyId, request.status, request.comments);
        if (policy != null)
            return ResponseEntity.ok(policy);
        return ResponseEntity.badRequest().build();
    }

    // 11:Fetch All Users
    @GetMapping("/allUsers")
    public ResponseEntity<List<SignupDTO>> getAllUsers() {
        return ResponseEntity.ok(AuthService.getByRole("User"));
    }

    // 12:All Agents ---------------------------------
    @GetMapping("/allAgents")
    public ResponseEntity<List<AgentResponse>> getAllAgents() {
        return ResponseEntity.ok(agentService.getAllAgentsWithAvailability());
    }

    // 13:All Schedule of Agent ----------------
    @GetMapping("/allSchedules")
    public ResponseEntity<List<Schedule>> getAllSchedules() {
        return ResponseEntity.ok(agentService.getAllBookedSchedules());
    }

    // 14:Stats Tracking Realtime By repo Queries-------------------
    @GetMapping("/landing-stats")
    public ResponseEntity<java.util.Map<String, Object>> getLandingStats() {
        java.util.Map<String, Object> stats = new java.util.HashMap<>();
        stats.put("users", AuthService.getByRole("User").size());
        stats.put("agents", AuthService.getByRole("Agent").size());
        stats.put("policies", policyService.getAllPolicies().size());
        return ResponseEntity.ok(stats);
    }

    // New: Agent Notifications Endpoint
    @GetMapping("/agent/notifications")
    public ResponseEntity<List<Map<String, Object>>> getAgentNotifications() {
        // Sample data (replace with real DB query, e.g., from a NotificationRepo)
        List<Map<String, Object>> notifications = Arrays.asList(
            Map.of("id", 1, "message", "New feedback received", "type", "Feedback"),
            Map.of("id", 2, "message", "Policy update available", "type", "Update")
        );
        return ResponseEntity.ok(notifications);
    }

    // New: Admin Notifications Endpoint
    @GetMapping("/admin/notifications")
    public ResponseEntity<List<Map<String, Object>>> getAdminNotifications() {
        // Sample data (replace with real DB query)
        List<Map<String, Object>> notifications = Arrays.asList(
            Map.of("id", 1, "type", "User", "message", "New user registered", "status", "Pending", "timestamp", "2023-10-01"),
            Map.of("id", 2, "type", "Agent", "message", "Agent request approved", "status", "Approved", "timestamp", "2023-10-02")
        );
        return ResponseEntity.ok(notifications);
    }

    // New: Agent Feedback Endpoint
    @GetMapping("/agent/feedback")
    public ResponseEntity<List<Map<String, Object>>> getAgentFeedback() {
        // Sample data (replace with real DB query)
        List<Map<String, Object>> feedback = Arrays.asList(
            Map.of("id", 1, "rating", 4.5, "comment", "Great service!"),
            Map.of("id", 2, "rating", 5.0, "comment", "Excellent support.")
        );
        return ResponseEntity.ok(feedback);
    }
}
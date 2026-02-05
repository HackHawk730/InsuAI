package com.example.demo.Service;

import com.example.demo.Object.Policy;
import com.example.demo.Repo.PolicyRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.demo.Object.PolicyApplyForm;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PolicyService {

    @Autowired
    private PolicyRepo policyRepo;

    @Autowired
    private com.example.demo.Repo.PolicyApplyFormRepo policyApplyFormRepo;

    public Policy applyForPolicy(String userEmail, String typeId, String policyTypeName,
            java.util.Map<String, Object> formData) {

        // Other Details Saving --------------------
        Policy policy = new Policy();
        policy.setUserEmail(userEmail);
        policy.setTypeId(typeId);
        policy.setPolicyTypeName(policyTypeName);
        policy.setFormData(formData);
        policy.setStatus("PENDING");
        policy.setAppliedAt(LocalDateTime.now());
        policy.setUpdatedAt(LocalDateTime.now());
        Policy savedPolicy = policyRepo.save(policy);

        // Form data saving for apply in policy
        PolicyApplyForm form = new PolicyApplyForm();
        form.setUserEmail(userEmail);
        form.setTypeId(typeId);
        form.setPolicyTypeName(policyTypeName);
        form.setFormData(formData);
        form.setSubmittedAt(LocalDateTime.now());
        policyApplyFormRepo.save(form);

        return savedPolicy;
    }

    // a list of policies associated with user
    public List<Policy> getUserPolicies(String userEmail) {
        return policyRepo.findByUserEmail(userEmail);
    }

    // get All policies
    public List<Policy> getAllPolicies() {
        return policyRepo.findAll();
    }

    // get policies by specialization
    public List<Policy> getPoliciesBySpecialization(String specialization) {
        return policyRepo.findByPolicyTypeNameStartingWithIgnoreCase(specialization);
    }

    // Update the policy status as per approval
    public Policy updatePolicyStatus(String policyId, String status, String comments) {
        Policy policy = policyRepo.findById(policyId).orElse(null);
        if (policy != null) {
            policy.setStatus(status);
            policy.setAgentComments(comments);
            policy.setUpdatedAt(LocalDateTime.now());
            return policyRepo.save(policy);
        }
        return null;
    }
}

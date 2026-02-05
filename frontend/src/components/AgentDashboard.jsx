import React, { useEffect, useCallback } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import AgentDashboardLayout from './agent-dashboard/AgentDashboardLayout';
import AgentHome from './agent-dashboard/AgentHome';
import AgentRequests from './agent-dashboard/AgentRequests';
import AgentAvailability from './agent-dashboard/AgentAvailability';
import AgentPolicies from './agent-dashboard/AgentPolicies';

import { getSession } from '../services/session';

const AgentDashboard = ({ onLogout }) => {
    const { email: userEmail, name: userName, specialization, company } = getSession('Agent');
    const navigate = useNavigate();

    useEffect(() => {
        if (!userEmail) {
            navigate('/signin');
        }
    }, [userEmail, navigate]);

    const handleNavigate = useCallback((view) => {
        if (view === 'home') {
            navigate('/agent-dashboard');
        } else {
            navigate(`/agent-dashboard/${view}`);
        }
    }, [navigate]);

    return (
        <AgentDashboardLayout
            userEmail={userEmail}
            userName={userName}
            onLogout={onLogout}
        >
            <Routes>
                <Route index element={<AgentHome userName={userName} specialization={specialization} company={company} onNavigate={handleNavigate} />} />
                <Route path="home" element={<AgentHome userName={userName} specialization={specialization} company={company} onNavigate={handleNavigate} />} />
                <Route path="requests" element={<AgentRequests />} />
                <Route path="availability" element={<AgentAvailability />} />
                <Route path="policies" element={<AgentPolicies userEmail={userEmail} />} />
                <Route path="*" element={<Navigate to="" replace />} />
            </Routes>
        </AgentDashboardLayout>
    );
};

export default AgentDashboard;

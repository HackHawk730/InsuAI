import React, { useState, useEffect } from 'react';  // Added useState and useEffect
import { HiClipboardList, HiCalendar, HiDocumentText } from 'react-icons/hi';
import axios from 'axios';  // Added for API calls
import StarRating from 'react-star-ratings';  // Added for star ratings
import './AgentDashboardLayout.css';

const AgentHome = ({ userName, specialization, company, onNavigate }) => {
    const [feedback, setFeedback] = useState([]);  // Added state for feedback

    useEffect(() => {
        // Fetch feedback on load
        axios.get('/InsureAi/agent/feedback')  // Updated: Changed from /api/ to /InsureAi/
            .then(response => setFeedback(response.data))
            .catch(err => console.log('Error fetching feedback:', err));
    }, []);

    return (
        <div className="dashboard-home">
            <h1 style={{ marginBottom: '0.75rem', color: 'white' }}>Welcome, {userName}</h1>
            <div className="agent-representation">
                {specialization && (
                    <div className="representation-capsule spec-capsule">
                        <span className="capsule-dot"></span>
                        <span className="capsule-text">{specialization} Expert</span>
                    </div>
                )}
                {company && (
                    <div className="representation-capsule company-capsule">
                        <span className="capsule-dot"></span>
                        <span className="capsule-text">{company}</span>
                    </div>
                )}
            </div>
            <div className="home-stats-grid" style={{ marginTop: '2rem' }}>
                <div
                    className="stat-card"
                    onClick={() => onNavigate('requests')}
                    style={{ cursor: 'pointer' }}
                >
                    <div className="stat-icon-wrapper">
                        <HiClipboardList />
                    </div>
                    <div className="stat-info">
                        <h3>Appointment Requests</h3>
                        <p>Manage pending appointments</p>
                    </div>
                </div>

                <div
                    className="stat-card"
                    onClick={() => onNavigate('availability')}
                    style={{ cursor: 'pointer' }}
                >
                    <div className="stat-icon-wrapper">
                        <HiCalendar />
                    </div>
                    <div className="stat-info">
                        <h3>My Availability</h3>
                        <p>Set or block time slots</p>
                    </div>
                </div>

                <div
                    className="stat-card"
                    onClick={() => onNavigate('policies')}
                    style={{ cursor: 'pointer' }}
                >
                    <div className="stat-icon-wrapper">
                        <HiDocumentText />
                    </div>
                    <div className="stat-info">
                        <h3>Policy Reviews</h3>
                        <p>Review submitted policies</p>
                    </div>
                </div>
            </div>

            {/* Added: Feedback Section */}
            <div style={{ marginTop: '2rem' }}>
                <h2 style={{ color: 'white' }}>My Feedback</h2>
                {feedback.length > 0 ? (
                    feedback.map(f => (
                        <div key={f.id} style={{ margin: '10px 0', border: '1px solid #ddd', padding: '10px', background: '#f9f9f9' }}>
                            <StarRating
                                rating={f.rating}
                                starRatedColor="gold"
                                numberOfStars={5}
                                starDimension="20px"
                                starSpacing="2px"
                            />
                            <p>{f.comment}</p>
                        </div>
                    ))
                ) : (
                    <p style={{ color: 'white' }}>No feedback available</p>
                )}
            </div>

            {/* Can add Recent Activity section here later */}
        </div>
    );
};

export default AgentHome;
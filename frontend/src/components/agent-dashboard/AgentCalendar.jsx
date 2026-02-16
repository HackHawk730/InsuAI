import React, { useState, useEffect, useMemo } from 'react';
import {
    HiChevronLeft,
    HiChevronRight,
    HiCalendar,
    HiClock,
    HiUser,
    HiBell,
    HiCheckCircle,
    HiInformationCircle
} from 'react-icons/hi';
import { fetchAgentRequests, fetchAllPolicies } from '../../services/api';
import { getSession } from '../../services/session';
import './AgentDashboardLayout.css';
import './AgentCalendar.css';

const AgentCalendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [appointments, setAppointments] = useState([]);
    const [policyDeadlines, setPolicyDeadlines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(null);

    const { email } = getSession('Agent');

    const loadData = async () => {
        if (!email) return;
        setLoading(true);
        try {
            const [reqResult, polResult] = await Promise.all([
                fetchAgentRequests(email),
                fetchAllPolicies(email)
            ]);

            if (reqResult.success) {
                setAppointments(reqResult.requests || []);
            }

            if (polResult.success) {
                // Filter policies that might have "deadlines" 
                // Using "Pending" policies as deadlines for review
                const pendingPolicies = (polResult.policies || []).filter(p => p.status === 'Pending');
                setPolicyDeadlines(pendingPolicies);
            }
        } catch (error) {
            console.error("Error loading calendar data", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, [email]);

    // Calendar Logic
    const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const startDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const monthName = currentDate.toLocaleString('default', { month: 'long' });
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    const calendarDays = useMemo(() => {
        const days = [];
        const totalDays = daysInMonth(year, month);
        const startOffset = startDayOfMonth(year, month);

        // Padding for previous month days
        for (let i = 0; i < startOffset; i++) {
            days.push({ type: 'prev', day: '', appointments: [] });
        }

        // Current month days
        for (let d = 1; d <= totalDays; d++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

            // Check for appointments on this date
            // Note: appointments usually have 'date' in format 'YYYY-MM-DD' or similar
            // In request item: req.date is likely YYYY-MM-DD
            const dayAppointments = appointments.filter(app => {
                const appDate = app.date; // Assuming YYYY-MM-DD
                return appDate === dateStr;
            });

            // For policy deadlines (simulation using applicationDate if available)
            const dayDeadlines = policyDeadlines.filter(p => {
                // If there's no specific deadline date, we might not show it on home calendar
                // or we could use applicationDate + 3 days as "Deadline"
                return false;
            });

            days.push({
                type: 'current',
                day: d,
                dateStr,
                appointments: dayAppointments,
                hasDeadline: dayDeadlines.length > 0,
                isToday: new Date().toDateString() === new Date(year, month, d).toDateString()
            });
        }

        // Padding for next month days to fill 6x7 grid
        const remainingCells = 42 - days.length;
        for (let i = 0; i < remainingCells; i++) {
            days.push({ type: 'next', day: '', appointments: [] });
        }

        return days;
    }, [year, month, appointments, policyDeadlines]);

    const activeEvents = useMemo(() => {
        if (!selectedDate) return [];
        return appointments.filter(app => app.date === selectedDate);
    }, [selectedDate, appointments]);

    return (
        <div className="agent-subpage">
            <div className="calendar-header-wrapper">
                <div>
                    <h2 className="subpage-title">Work Calendar</h2>
                    <p className="subpage-subtitle">Track your upcoming appointments and policy review deadlines.</p>
                </div>
                <div className="calendar-controls">
                    <button onClick={handlePrevMonth} className="cal-nav-btn"><HiChevronLeft /></button>
                    <span className="current-month-label">{monthName} {year}</span>
                    <button onClick={handleNextMonth} className="cal-nav-btn"><HiChevronRight /></button>
                </div>
            </div>

            <div className="calendar-main-grid">
                <div className="calendar-card">
                    <div className="calendar-weekdays">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                            <div key={d} className="weekday-label">{d}</div>
                        ))}
                    </div>
                    <div className="calendar-days">
                        {calendarDays.map((day, idx) => (
                            <div
                                key={idx}
                                className={`calendar-day-cell ${day.type} ${day.isToday ? 'today' : ''} ${selectedDate === day.dateStr ? 'selected' : ''} ${day.appointments.length > 0 ? 'has-events' : ''}`}
                                onClick={() => day.type === 'current' && setSelectedDate(day.dateStr)}
                            >
                                <span className="day-number">{day.day}</span>
                                {day.appointments.length > 0 && (
                                    <div className="event-indicators">
                                        {day.appointments.slice(0, 3).map((_, i) => (
                                            <div key={i} className="event-dot" />
                                        ))}
                                        {day.appointments.length > 3 && <span className="event-more">+{day.appointments.length - 3}</span>}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="calendar-sidebar">
                    <div className="event-panel-header">
                        <HiCalendar className="panel-icon" />
                        <h3>{selectedDate ? `Events for ${selectedDate}` : 'Upcoming Events'}</h3>
                    </div>

                    <div className="events-scroll">
                        {loading ? (
                            <div className="empty-state">Loading your schedule...</div>
                        ) : activeEvents.length > 0 ? (
                            activeEvents.map((ev, i) => (
                                <div key={i} className={`event-item-card ${ev.status.toLowerCase()}`}>
                                    <div className="event-time">
                                        <HiClock /> {ev.startTime} - {ev.endTime}
                                    </div>
                                    <h4 className="event-user">{ev.bookedByUserEmail}</h4>
                                    <p className="event-type">{ev.appointmentType}</p>
                                    <div className="event-status-tag">{ev.status}</div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-state">
                                <HiInformationCircle size={32} opacity={0.5} />
                                <p>{selectedDate ? 'No events scheduled for this day.' : 'Select a day to view details'}</p>
                            </div>
                        )}

                        {!selectedDate && appointments.filter(a => (a.status === 'Confirmed' || a.status === 'Booked')).length > 0 && (
                            <div className="upcoming-summary">
                                <h4>Next Pending Reviews</h4>
                                {policyDeadlines.slice(0, 3).map((p, i) => (
                                    <div key={i} className="deadline-item">
                                        <HiBell className="deadline-icon" />
                                        <div>
                                            <div className="deadline-title">{p.policyTypeName}</div>
                                            <div className="deadline-sub">{p.userEmail}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgentCalendar;

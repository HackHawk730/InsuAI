import React, { useState } from 'react';
import { HiChevronRight } from 'react-icons/hi';
import './shared.css';
import './MyAppointments.css';

const MyAppointments = ({ appointments, onReschedule }) => {
  const [detail, setDetail] = useState(null);

  return (
    <div className="ud-my-appointments">
      <h1 className="ud-page-title">My appointments</h1>
      <p className="ud-page-subtitle">
        View and manage your bookings. Click for details or to reschedule.
      </p>

      {!appointments || appointments.length === 0 ? (
        <div className="ud-empty">
          <strong>No appointments yet</strong>
          Book a slot with an agent from the &quot;Book Appointment&quot; section.
        </div>
      ) : (
        <div className="ud-appointment-list">
          {appointments.map(({ agent, slot }, idx) => {
            const status = (slot.status || 'Booked').toLowerCase();
            let statusLabel = slot.status || 'Booked';
            let statusClass = 'pending'; // Default

            if (status === 'confirmed' || status === 'approved') statusClass = 'confirmed';
            else if (status === 'completed') statusClass = 'completed';
            else if (status === 'rejected' || status === 'cancelled') statusClass = 'cancelled';
            else if (status === 'booked' || status === 'pending') {
              statusClass = 'pending';
              statusLabel = 'Booked';
            }

            return (
              <div
                key={slot.id || `${agent.email}-${slot.day}-${slot.startTime}-${idx}`}
                className="ud-appointment-item ud-card"
                role="button"
                tabIndex={0}
                onClick={() => setDetail({ agent, slot })}
                onKeyDown={(e) => e.key === 'Enter' && setDetail({ agent, slot })}
              >
                <div className="ud-appointment-item-header">
                  <div className="ud-appointment-avatar">
                    {(agent.name || agent.email || 'A').trim().charAt(0).toUpperCase()}
                  </div>
                  <div className="ud-appointment-info">
                    <h3>{agent.name || 'Agent'}</h3>
                    <p>{agent.email}</p>
                  </div>
                  <span className={`ud-status ${statusClass}`}>{statusLabel}</span>
                  <HiChevronRight className="ud-appointment-arrow" />
                </div>
                <div className="ud-appointment-details">
                  <span>{slot.day} {slot.date ? `(${slot.date})` : ''}</span>
                  <span>{slot.startTime} – {slot.endTime}</span>
                  <span>{slot.appointmentType}</span>
                </div>
                {slot.userNote && (
                  <p className="ud-appointment-note">Note: {slot.userNote}</p>
                )}
                <div className="ud-progress-wrap">
                  <div className="ud-progress-bar">
                    <div
                      className={`ud-progress-fill ${statusClass === 'confirmed' || statusClass === 'completed' ? 'green' : 'amber'}`}
                      style={{ width: statusClass === 'confirmed' || statusClass === 'completed' ? '100%' : '50%' }}
                    />
                  </div>
                </div>
                <div className="ud-appointment-actions">
                  <button
                    type="button"
                    className="ud-btn-secondary ud-btn-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onReschedule?.({ agent, slot });
                    }}
                  >
                    Reschedule
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {detail && (
        <div className="ud-modal-backdrop" onClick={() => setDetail(null)}>
          <div className="ud-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Appointment details</h3>
            <p><strong>{detail.agent.name || detail.agent.email}</strong> · {detail.agent.email}</p>
            <p>{detail.slot.day} {detail.slot.date ? `(${detail.slot.date})` : ''} · {detail.slot.startTime} – {detail.slot.endTime} · {detail.slot.appointmentType}</p>
            {detail.slot.userNote && <p className="ud-appointment-note">Note: {detail.slot.userNote}</p>}
            <div className="ud-modal-actions">
              <button type="button" className="ud-btn-secondary" onClick={() => setDetail(null)}>
                Close
              </button>
              <button
                type="button"
                className="ud-btn-primary"
                onClick={() => {
                  setDetail(null);
                  onReschedule?.(detail);
                }}
              >
                Reschedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAppointments;

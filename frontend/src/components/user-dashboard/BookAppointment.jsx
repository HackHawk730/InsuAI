import React, { useMemo, useState } from 'react';
import { HiBadgeCheck, HiStar } from 'react-icons/hi';
import { fetchAgentsWithAvailability, bookSchedule } from '../../services/api';
import './shared.css';
import './BookAppointment.css';

const SPECIALIZATIONS = ['Health', 'Life', 'Auto', 'General'];
const getSpecialization = (agent) => {
  const idx = Math.abs((agent?.email || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % SPECIALIZATIONS.length;
  return agent?.specialization || SPECIALIZATIONS[idx];
};

const BookAppointment = ({ userEmail, onBooked }) => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [query, setQuery] = useState('');
  const [specFilter, setSpecFilter] = useState('All');
  const [selected, setSelected] = useState(null);
  const [userNote, setUserNote] = useState('');
  const [modalOpen, setModalOpen] = useState(false);


  //This End is load theAgents with fetched Agents -- Fetch the Db Data
  const loadAgents = async () => {
    setLoading(true);
    const result = await fetchAgentsWithAvailability();
    //Here Set Agent is Work as the update UI state
    if (result.success) setAgents(result.agents || []);
    else setMessage(result.message || 'Failed to load agents');
    setLoading(false);
  };

  React.useEffect(() => {
    loadAgents();
  }, []);

  const enrichedAgents = useMemo(() => {
    return (agents || []).map((a) => ({
      ...a,
      specialization: getSpecialization(a),
      rating: a.rating || 0,
    }));
  }, [agents]);

  const filteredAgents = useMemo(() => {
    let list = enrichedAgents;
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (a) =>
          `${a.name || ''} ${a.email || ''} ${a.specialization || ''}`.toLowerCase().includes(q)
      );
    }
    if (specFilter !== 'All') {
      list = list.filter((a) => (a.specialization || '') === specFilter);
    }
    return list;
  }, [enrichedAgents, query, specFilter]);

  const openBooking = (agent, slot) => {
    setSelected({ agent, slot });
    setUserNote('');
    setModalOpen(true);
    setMessage('');
  };

  const closeBooking = () => {
    setSelected(null);
    setModalOpen(false);
    setUserNote('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userEmail || userEmail === 'User') {
      setMessage('Please sign in again to book.');
      return;
    }
    if (!selected) return;

    setBookingLoading(true);
    setMessage('');

    const res = await bookSchedule({
      agentEmail: selected.agent.email,
      scheduleId: selected.slot.id,
      userEmail,
      userNote: userNote?.trim() || '',
      date: selected.slot.date,
      startTime: selected.slot.startTime,
      endTime: selected.slot.endTime,
      appointmentType: selected.slot.appointmentType,
    });

    setBookingLoading(false);
    setMessage(res.message);

    if (res.success) {
      closeBooking();
      loadAgents();
      onBooked?.();
    }
  };

  return (
    <div className="ud-book">
      <h1 className="ud-page-title">Book an appointment</h1>
      <p className="ud-page-subtitle">
        Choose an agent by specialization and rating, then pick an available slot.
      </p>

      {message && (
        <div
          className={`ud-message ${message.toLowerCase().includes('fail') || message.toLowerCase().includes('error') ? 'error' : 'success'}`}
        >
          {message}
        </div>
      )}

      <div className="ud-book-controls">
        <div className="ud-control">
          <label className="ud-label">Search</label>
          <input
            type="text"
            className="ud-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Name, email, or specialization…"
          />
        </div>
        <div className="ud-control">
          <label className="ud-label">Specialization</label>
          <select
            className="ud-select"
            value={specFilter}
            onChange={(e) => setSpecFilter(e.target.value)}
          >
            <option value="All">All</option>
            {SPECIALIZATIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <button type="button" className="ud-btn-secondary" onClick={loadAgents} disabled={loading}>
          {loading ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>

      {loading ? (
        <p className="ud-loading">Loading agents…</p>
      ) : filteredAgents.length === 0 ? (
        <div className="ud-empty">
          <strong>No agents found</strong>
          Try changing your search or filters.
        </div>
      ) : (
        <div className="ud-agent-grid">
          {filteredAgents.map((agent) => (
            <div key={agent.id || agent.email} className="ud-agent-card">
              <div className="ud-agent-header">
                <div className="ud-agent-avatar">
                  {(agent.name || agent.email || 'A').trim().charAt(0).toUpperCase()}
                </div>
                <div className="ud-agent-meta">
                  <h3>{agent.name || 'Agent'}</h3>
                  <p>{agent.email}</p>
                  <span className="ud-agent-badge">{agent.specialization}</span>
                  {agent.rating > 0 ? (
                    <div className="ud-agent-rating">
                      <HiStar />
                      <span>{agent.rating?.toFixed(1)}</span>
                    </div>
                  ) : (
                    <span className="ud-new-badge">NEW</span>
                  )}
                  <span className="ud-agent-verified">
                    <HiBadgeCheck /> Verified by Authority
                  </span>
                </div>
              </div>

              <div className="ud-agent-slots">
                <h4>Availability</h4>
                {(!agent.agentSchedule || agent.agentSchedule.length === 0) && (
                  <p className="ud-no-slots">No slots available.</p>
                )}
                {agent.agentSchedule && agent.agentSchedule.length > 0 && (
                  <div className="ud-slot-grid">
                    {agent.agentSchedule.map((slot, index) => {
                      const available = (slot.status || '').toLowerCase() === 'available';
                      const isMine =
                        (slot.bookedByUserEmail || '').trim().toLowerCase() ===
                        (userEmail || '').trim().toLowerCase();

                      return (
                        <button
                          key={slot.id || `${agent.email}-${slot.date}-${slot.startTime}-${index}`}
                          type="button"
                          className={`ud-slot ${available ? 'available' : 'booked'}`}
                          disabled={!available || bookingLoading}
                          onClick={() => available && openBooking(agent, slot)}
                        >
                          <span className="ud-slot-day">{slot.date || 'Date not set'}</span>
                          <span className="ud-slot-time">
                            {slot.startTime}–{slot.endTime}
                          </span>
                          <span className="ud-slot-type">{slot.appointmentType}</span>
                          {!available && (
                            <span className="ud-slot-status">
                              {isMine ? 'Your booking' : 'Booked'}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && selected && (
        <div className="ud-modal-backdrop" onClick={closeBooking}>
          <div className="ud-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Confirm booking</h3>
            <p>
              Book with <strong>{selected.agent.name || selected.agent.email}</strong> on{' '}
              <strong>{selected.slot.date || 'Date not set'}</strong> ({selected.slot.startTime}–{selected.slot.endTime}) for{' '}
              <strong>{selected.slot.appointmentType}</strong>.
            </p>
            <form onSubmit={handleSubmit}>
              <div className="ud-control">
                <label className="ud-label">Note (optional)</label>
                <textarea
                  className="ud-textarea"
                  value={userNote}
                  onChange={(e) => setUserNote(e.target.value)}
                  placeholder="What do you need help with?"
                />
              </div>
              <div className="ud-modal-actions">
                <button type="button" className="ud-btn-secondary" onClick={closeBooking} disabled={bookingLoading}>
                  Cancel
                </button>
                <button type="submit" className="ud-btn-primary" disabled={bookingLoading}>
                  {bookingLoading ? 'Booking…' : 'Confirm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookAppointment;

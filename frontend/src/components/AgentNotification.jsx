import React, { useState, useEffect, useRef } from 'react';
import { FaBell, FaInfoCircle } from 'react-icons/fa';
import axios from 'axios';

const AgentNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [showList, setShowList] = useState(false);
  const notificationRef = useRef(null);

  useEffect(() => {
    // Fetch notifications on load and poll every 30s for real-time updates
    const fetchNotifications = () => {
      axios.get('/InsureAi/agent/notifications')
        .then(response => setNotifications(response.data))
        .catch(err => console.log('Error fetching notifications:', err));
    };
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Poll every 30s

    // Click outside listener
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowList(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      clearInterval(interval);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }} ref={notificationRef}>
      <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setShowList(!showList)}>
        <FaBell
          style={{ fontSize: '24px', color: 'white' }}
        />
        {notifications.length > 0 && (
          <span style={{
            backgroundColor: '#ef4444',
            color: 'white',
            fontSize: '10px',
            fontWeight: 'bold',
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 10px rgba(239, 68, 68, 0.5)',
            border: '2px solid #0f172a'
          }}>
            {notifications.length}
          </span>
        )}
      </div>

      {showList && (
        <div style={{
          position: 'absolute',
          top: '45px',
          right: '0',
          width: '380px',
          background: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
          borderRadius: '16px',
          zIndex: 10000,
          overflow: 'hidden',
          animation: 'adViewEnter 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}>
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'rgba(30, 41, 59, 0.5)'
          }}>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'white' }}>System Notifications</h3>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>{notifications.length} New</span>
          </div>

          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            maxHeight: '400px',
            overflowY: 'auto'
          }}>
            {notifications.length > 0 ? (
              notifications.map((note, index) => (
                <li
                  key={note.id || index}
                  style={{
                    padding: '16px 20px',
                    borderBottom: index !== notifications.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
                    transition: 'background 0.2s ease',
                    cursor: 'pointer',
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'flex-start'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'rgba(59, 130, 246, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#3b82f6',
                    flexShrink: 0
                  }}>
                    <FaInfoCircle size={14} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.5', color: '#e2e8f0' }}>
                      {note.message}
                    </p>
                    <span style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', display: 'block' }}>
                      {note.timestamp || 'Just now'}
                    </span>
                  </div>
                </li>
              ))
            ) : (
              <li style={{ padding: '40px 20px', textAlign: 'center', color: '#94a3b8' }}>
                <FaBell style={{ fontSize: '2rem', opacity: 0.2, marginBottom: '12px' }} />
                <p style={{ margin: 0 }}>No new notifications available</p>
              </li>
            )}
          </ul>

          {notifications.length > 0 && (
            <div style={{
              padding: '12px',
              textAlign: 'center',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              background: 'rgba(15, 23, 42, 0.5)'
            }}>
              <button style={{
                background: 'transparent',
                border: 'none',
                color: '#60a5fa',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}>
                Mark all as read
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AgentNotification;

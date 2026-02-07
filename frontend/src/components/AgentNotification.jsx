import React, { useState, useEffect } from 'react';
import { FaBell } from 'react-icons/fa';
import axios from 'axios';

const AgentNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    // Fetch notifications on load and poll every 30s for real-time updates
    const fetchNotifications = () => {
      axios.get('/InsureAi/agent/notifications')
        .then(response => setNotifications(response.data))
        .catch(err => console.log('Error fetching notifications:', err));
    };
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <FaBell
        onClick={() => setShowList(!showList)}
        style={{ cursor: 'pointer', fontSize: '24px', color: 'white' }}
      />
      {notifications.length > 0 && (
        <span style={{ color: 'red', fontSize: '12px', position: 'absolute', top: '-5px', right: '-5px' }}>
          {notifications.length}
        </span>
      )}
      {showList && (
        <ul style={{
          position: 'absolute',
          top: '30px',
          right: '0',
          background: '#004080',  // Changed to deep sea blue
          color: 'white',
          border: '1px solid #0066cc',  // Added blue border for definition
          listStyle: 'none',
          padding: '10px',
          zIndex: 1000,
          maxWidth: '300px',
          borderRadius: '10px'  // Increased for more rounded corners
        }}>
          {notifications.length > 0 ? (
            notifications.map(note => (
              <li key={note.id} style={{ margin: '5px 0', color: 'white' }}>
                {note.message} (e.g., New feedback received)
              </li>
            ))
          ) : (
            <li style={{ color: 'white' }}>No new notifications</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default AgentNotification;
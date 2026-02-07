import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminNotificationManagement = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Fetch notifications on load and poll every 30s
    const fetchNotifications = () => {
      axios.get('/InsureAi/admin/notifications')
        .then(response => {
          const data = response.data;
          setNotifications(Array.isArray(data) ? data : []);
        })
        .catch(err => console.log('Error fetching notifications:', err));
    };
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Poll for updates
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2>Notification Management</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ccc' }}>
            <th style={{ padding: '10px', textAlign: 'left' }}>Type</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Message</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Status</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(notifications) && notifications.length > 0 ? (
            notifications.map(note => (
              <tr key={note.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '10px' }}>{note.type} (e.g., User/Agent)</td>
                <td style={{ padding: '10px' }}>{note.message}</td>
                <td style={{ padding: '10px' }}>{note.status}</td>
                <td style={{ padding: '10px' }}>{note.timestamp || 'N/A'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ padding: '10px', textAlign: 'center' }}>No notifications available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminNotificationManagement;
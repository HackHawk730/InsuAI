import React, { useState, useRef, useEffect } from 'react';
import {
  HiHome,
  HiCalendar,
  HiDocumentText,
  HiClipboardList,
  HiLibrary,
  HiSupport,
  HiCog,
  HiMenu,
  HiX,
  HiUsers,
  HiShieldCheck,
  HiBell,
} from 'react-icons/hi';
import { NavLink, useLocation } from 'react-router-dom';
import './DashboardLayout.css';

const NAV_ITEMS = [
  { id: 'home', label: 'Dashboard', icon: HiHome, path: '/dashboard' },
  { id: 'book', label: 'Book Appointment', icon: HiCalendar, path: '/dashboard/book' },
  { id: 'apply', label: 'Apply for Policy', icon: HiDocumentText, path: '/dashboard/apply' },
  { id: 'appointments', label: 'My Appointments', icon: HiClipboardList, path: '/dashboard/appointments' },
  { id: 'policies', label: 'My Policies', icon: HiLibrary, path: '/dashboard/policies' },
  { id: 'support', label: 'Support / Help', icon: HiSupport, path: '/dashboard/support' },
  { id: 'settings', label: 'Settings', icon: HiCog, path: '/dashboard/settings' },
];

const DashboardLayout = ({ children, userEmail, userName, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const location = useLocation();
  const notificationRef = useRef(null);

  // Mock notifications - in real app, this would come from API
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'appointment',
      title: 'Appointment Confirmed',
      message: 'Your appointment with Agent John Doe has been confirmed for Jan 28, 2026',
      time: '2 hours ago',
      read: false,
    },
    {
      id: 2,
      type: 'policy',
      title: 'Policy Application Update',
      message: 'Your Health Insurance policy application is under review',
      time: '5 hours ago',
      read: false,
    },
    {
      id: 3,
      type: 'reminder',
      title: 'Upcoming Appointment',
      message: 'You have an appointment tomorrow at 10:00 AM',
      time: '1 day ago',
      read: true,
    },
  ]);

  // Close notification dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationOpen(false);
      }
    };

    if (notificationOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [notificationOpen]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = () => {
    setNotificationOpen(!notificationOpen);
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const clearNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <div className="ud-layout">
      <aside className={`ud-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="ud-sidebar-header">
          <div className="ud-sidebar-brand">
            <HiShieldCheck className="brand-icon" />
            <span>InsurAI</span>
          </div>
          <button
            type="button"
            className="ud-sidebar-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <HiX />
          </button>
        </div>
        <nav className="ud-sidebar-nav">
          {NAV_ITEMS.map(({ id, label, icon: Icon, path }) => (
            <NavLink
              key={id}
              to={path}
              end={id === 'home'}
              className={({ isActive }) => `ud-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => {
                setSidebarOpen(false);
              }}
            >
              <Icon className="ud-nav-icon" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="ud-main">
        <header className="ud-topbar">
          <button
            type="button"
            className="ud-menu-toggle"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <HiMenu />
          </button>
          <div className="ud-topbar-brand">
            <HiShieldCheck className="brand-icon" style={{ fontSize: '1.25rem' }} />
            InsurAI
          </div>
          <div className="ud-topbar-actions">
            {/* Notification Bell */}
            <div className="ud-notification-wrapper" ref={notificationRef}>
              <button
                type="button"
                className="ud-notification-btn"
                onClick={handleNotificationClick}
                aria-label="Notifications"
              >
                <HiBell />
                {unreadCount > 0 && (
                  <span className="ud-notification-badge">{unreadCount}</span>
                )}
              </button>

              {/* Notification Dropdown */}
              {notificationOpen && (
                <div className="ud-notification-dropdown">
                  <div className="ud-notification-header">
                    <h3>Notifications</h3>
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        className="ud-mark-all-read"
                        onClick={markAllAsRead}
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="ud-notification-list">
                    {notifications.length === 0 ? (
                      <div className="ud-notification-empty">
                        <HiBell />
                        <p>No notifications</p>
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`ud-notification-item ${!notification.read ? 'unread' : ''}`}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <div className="ud-notification-content">
                            <div className="ud-notification-title">
                              {notification.title}
                              {!notification.read && <span className="ud-unread-dot"></span>}
                            </div>
                            <div className="ud-notification-message">
                              {notification.message}
                            </div>
                            <div className="ud-notification-time">
                              {notification.time}
                            </div>
                          </div>
                          <button
                            type="button"
                            className="ud-notification-close"
                            onClick={(e) => {
                              e.stopPropagation();
                              clearNotification(notification.id);
                            }}
                            aria-label="Clear notification"
                          >
                            <HiX />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <span className="ud-user-name">{userName || userEmail || 'User'}</span>
            <button type="button" className="ud-logout-btn" onClick={onLogout}>
              Logout
            </button>
          </div>
        </header>

        <main className="ud-content" key={location.pathname}>{children}</main>
      </div>

      {sidebarOpen && (
        <div
          className="ud-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          onKeyDown={(e) => e.key === 'Escape' && setSidebarOpen(false)}
          role="button"
          tabIndex={0}
          aria-label="Close overlay"
        />
      )}
    </div>
  );
};

export default DashboardLayout;
export { NAV_ITEMS };

import React from 'react';
import { HiCog } from 'react-icons/hi';
import './shared.css';

const Settings = () => (
  <div className="ud-settings">
    <h1 className="ud-page-title">Settings</h1>
    <p className="ud-page-subtitle">
      Manage your account and preferences.
    </p>
    <div className="ud-card ud-settings-card">
      <div className="ud-metric-icon slate" style={{ marginBottom: 16 }}>
        <HiCog />
      </div>
      <h3 style={{ margin: '0 0 8px 0', fontSize: '1.125rem', fontWeight: 800, color: '#f1f5f9' }}>
        Coming soon
      </h3>
      <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9375rem', lineHeight: 1.6 }}>
        Profile, notifications, and security settings will be available here.
      </p>
    </div>
  </div>
);

export default Settings;

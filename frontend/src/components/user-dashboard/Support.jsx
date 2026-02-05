import React from 'react';
import { HiSupport } from 'react-icons/hi';
import './shared.css';

const Support = () => (
  <div className="ud-support">
    <h1 className="ud-page-title">Support / Help</h1>
    <p className="ud-page-subtitle">
      Get assistance with your policies, appointments, or account.
    </p>
    <div className="ud-card ud-support-card">
      <div className="ud-metric-icon blue" style={{ marginBottom: 16 }}>
        <HiSupport />
      </div>
      <h3 style={{ margin: '0 0 8px 0', fontSize: '1.125rem', fontWeight: 800, color: '#f1f5f9' }}>
        Contact us
      </h3>
      <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9375rem', lineHeight: 1.6 }}>
        Email: support@insurai.com<br />
        Phone: 1-800-INSURE-AI<br />
        Hours: Mon–Fri 9am–6pm
      </p>
    </div>
  </div>
);

export default Support;

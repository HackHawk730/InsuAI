import React, { useState } from 'react';
import { applyForPolicy } from '../../services/api';
import { POLICY_TYPES } from './policyTypes';
import PolicyApplicationForm from './PolicyApplicationForm';
import { getSession } from '../../services/session';
import './shared.css';
import './ApplyForPolicy.css';

const ApplyForPolicy = ({ onApply }) => {
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleApplyClick = (p) => {
    setError(null);
    setSelectedPolicy(p);
  }

  const handleFormSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    const { email: userEmail } = getSession('User');
    if (!userEmail) {
      setError("User email not found. Please log in again.");
      setLoading(false);
      return;
    }

    const result = await applyForPolicy(userEmail, selectedPolicy.id, selectedPolicy.name, formData);

    if (result.success) {
      onApply?.(result.policy);
      setSelectedPolicy(null);
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  const handleCancel = () => {
    setSelectedPolicy(null);
    setError(null);
  }

  if (selectedPolicy) {
    return (
      <div className="ud-apply">
        <h1 className="ud-page-title">Policy Application</h1>
        {error && <p className="ud-error-msg" style={{ maxWidth: '800px', margin: '0 auto 20px auto' }}>{error}</p>}
        <PolicyApplicationForm
          policy={selectedPolicy}
          onCancel={handleCancel}
          onSubmit={handleFormSubmit}
          loading={loading}
        />
      </div>
    );
  }

  return (
    <div className="ud-apply">
      <h1 className="ud-page-title">Apply for a policy</h1>
      <p className="ud-page-subtitle">
        Choose a policy type below and submit your application. Our team will review and get in touch.
      </p>

      <div className="ud-policy-grid">
        {POLICY_TYPES.map((p) => (
          <div
            key={p.id}
            className="ud-policy-card"
            onClick={() => handleApplyClick(p)}
            style={{ cursor: 'pointer' }}
          >
            <div className="ud-policy-icon">{p.icon}</div>
            <h3>{p.name}</h3>
            <p>{p.description}</p>

            <div className="ud-policy-meta">
              <div className="ud-policy-meta-item">
                <span className="ud-policy-meta-label">Coverage</span>
                <span className="ud-policy-meta-value">{p.coverage}</span>
              </div>
              <div className="ud-policy-meta-item" style={{ alignItems: 'flex-end' }}>
                <span className="ud-policy-meta-label">Premium</span>
                <span className="ud-policy-meta-value">{p.premium}</span>
              </div>
            </div>

            <ul className="ud-policy-features">
              {p.features?.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>

            <button
              type="button"
              className="ud-btn-primary ud-policy-apply-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleApplyClick(p);
              }}
            >
              Apply now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApplyForPolicy;

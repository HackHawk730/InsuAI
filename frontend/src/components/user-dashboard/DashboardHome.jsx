import React from 'react';
import {
  HiUserGroup,
  HiLibrary,
  HiClipboardList,
  HiCalendar,
  HiSparkles,
  HiBadgeCheck,
  HiStar,
  HiLockClosed,
  HiClock
} from 'react-icons/hi';
import './shared.css';

const DashboardHome = ({
  userName,
  totalAgents,
  totalPolicies,
  myPoliciesCount,
  myAppointmentsCount,
  onNavigate,
}) => {
  const metrics = [
    {
      label: 'Total Available Agents',
      value: totalAgents,
      icon: HiUserGroup,
      iconClass: 'blue',
      action: 'View agents',
      view: 'book',
    },
    {
      label: 'Total Policies',
      value: totalPolicies,
      icon: HiLibrary,
      iconClass: 'slate',
      action: 'Browse policies',
      view: 'apply',
    },
    {
      label: 'My Policies',
      value: myPoliciesCount,
      icon: HiClipboardList,
      iconClass: 'green',
      action: 'Track policies',
      view: 'policies',
    },
    {
      label: 'My Appointments',
      value: myAppointmentsCount,
      icon: HiCalendar,
      iconClass: 'amber',
      action: 'View appointments',
      view: 'appointments',
    },
  ];

  const features = [
    {
      title: 'Top Tier Authorized Agents',
      desc: 'Connect with verified and highly rated professionals ready to assist with your specific insurance needs.',
      icon: HiBadgeCheck,
    },
    {
      title: 'Best Policy Providers',
      desc: 'Access a curated selection of industry-leading policies tailored to your lifestyle and coverage requirements.',
      icon: HiStar,
    },
    {
      title: 'Secure System',
      desc: 'Your sensitive data is protected by enterprise-grade security protocols, ensuring complete privacy and safety.',
      icon: HiLockClosed,
    },
    {
      title: 'Appointment Scheduling',
      desc: 'Effortlessly book, reschedule, and manage meetings with agents using our integrated real-time calendar.',
      icon: HiClock,
    },
  ];

  return (
    <div className="ud-home">
      <h1 className="ud-page-title">
        Hi{userName ? `, ${userName}` : ''} — Welcome back
      </h1>
      <p className="ud-page-subtitle">
        Here’s an overview of your insurance dashboard. Use the cards below for quick access.
      </p>

      <div className="ud-summary-card">
        <div className="ud-summary-title">
          <HiSparkles style={{ color: '#60a5fa' }} />
          <span>InsurAI Enterprise System</span>
        </div>
        <div className="ud-summary-text">
          Welcome to the InsurAI Corporate Policy Automation and Intelligence System. This professional dashboard empowers you to seamlessly manage your insurance portfolio. Connect with top-tier agents, apply for comprehensive policies, and track your coverage status in real-time—all designed to provide a superior and intelligent insurance management experience.
        </div>
      </div>

      <section className="ud-metrics">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="ud-metric-card">
              <div className={`ud-metric-icon ${m.iconClass}`}>
                <Icon />
              </div>
              <span className="ud-metric-label">{m.label}</span>
              <span className="ud-metric-value">{m.value}</span>
              <button
                type="button"
                className="ud-metric-action"
                onClick={() => onNavigate(m.view)}
              >
                {m.action}
              </button>
            </div>
          );
        })}
      </section>

      <section className="ud-features">
        {features.map((f) => {
          const Icon = f.icon;
          return (
            <div key={f.title} className="ud-feature-card">
              <div className="ud-feature-icon">
                <Icon />
              </div>
              <h3 className="ud-feature-title">{f.title}</h3>
              <p className="ud-feature-desc">{f.desc}</p>
            </div>
          );
        })}
      </section>
    </div>
  );
};

export default DashboardHome;

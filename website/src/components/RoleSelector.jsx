import React from 'react';
import './RoleSelector.css';

const roles = [
  {
    value: 'owner',
    label: 'Owner',
    icon: '👑',
    desc: 'Full access – can lock and Unlock',
    color: '#3b82f6',
    bg: 'rgba(59,130,246,0.09)',
    border: 'rgba(59,130,246,0.25)',
  },
  {
    value: 'guest',
    label: 'Guest',
    icon: '🙋',
    desc: 'View-only – no lock/Unlock access',
    color: '#8b5cf6',
    bg: 'rgba(139,92,246,0.08)',
    border: 'rgba(139,92,246,0.2)',
  },
  {
    value: 'child',
    label: 'Child',
    icon: '🧒',
    desc: 'Restricted – no access controls',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.2)',
  },
];

export default function RoleSelector({ role, onRoleChange }) {
  return (
    <section className="role-section fade-in-up" id="role" style={{ animationDelay: '0.15s' }}>
      <div className="section-header">
        <h2 className="section-title">Role Selection</h2>
        <p className="section-sub">Your role determines what actions you can perform</p>
      </div>

      <div className="role-cards">
        {roles.map((r) => (
          <button
            id={`role-btn-${r.value}`}
            key={r.value}
            className={`role-card glass ${role === r.value ? 'role-active' : ''}`}
            style={role === r.value
              ? { borderColor: r.border, background: r.bg, boxShadow: `0 8px 24px ${r.bg}` }
              : {}}
            onClick={() => onRoleChange(r.value)}
          >
            <div className="role-icon" style={role === r.value ? { background: r.color } : {}}>
              {r.icon}
            </div>
            <div className="role-text">
              <p className="role-name" style={role === r.value ? { color: r.color } : {}}>{r.label}</p>
              <p className="role-desc">{r.desc}</p>
            </div>
            {role === r.value && (
              <div className="role-check" style={{ background: r.color }}>
                <svg viewBox="0 0 20 20" fill="white" width="12" height="12">
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="role-info glass">
        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" style={{ color: '#3b82f6', flexShrink: 0 }}>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
        </svg>
        <p>
          Currently signed in as: <strong style={{ textTransform: 'capitalize' }}>{role}</strong>.{' '}
          {role === 'owner'
            ? 'You have full access to control the door.'
            : 'Switch to Owner role to Unlock the door.'}
        </p>
      </div>
    </section>
  );
}

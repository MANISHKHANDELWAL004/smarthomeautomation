import React from 'react';
import './NavBar.css';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'control', label: 'Control', icon: '🔓' },
  { id: 'role', label: 'Role', icon: '👤' },
  { id: 'autolock', label: 'Auto-Lock', icon: '⏱️' },
  { id: 'logs', label: 'Logs', icon: '📋' },
  { id: 'device', label: 'Device', icon: '📡' },
];

export default function NavBar({ active, onNav }) {
  return (
    <nav className="navbar glass" aria-label="Section navigation">
      <div className="navbar-inner">
        {navItems.map((item) => (
          <button
            key={item.id}
            id={`nav-${item.id}`}
            className={`nav-btn ${active === item.id ? 'nav-active' : ''}`}
            onClick={() => {
              onNav(item.id);
              document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
            {active === item.id && <span className="nav-underline" />}
          </button>
        ))}
      </div>
    </nav>
  );
}

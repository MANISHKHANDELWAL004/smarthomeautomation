import React from 'react';
import './Dashboard.css';

export default function Dashboard({ doorStatus }) {
  // 'unlocking' and 'unlocked' both show the open/unlocked visuals
  // so the UI reacts IMMEDIATELY when the user clicks Unlock
  const isOpen = doorStatus === 'unlocked' || doorStatus === 'unlocking';
  const isUnlocking = doorStatus === 'unlocking';

  return (
    <section className="dashboard-section fade-in-up" id="dashboard">
      <div className="section-header">
        <h2 className="section-title">Dashboard</h2>
        <p className="section-sub">Real-time door status at a glance</p>
      </div>

      <div className="dashboard-grid">
        {/* Status Card */}
        <div className={`status-card glass ${isOpen ? 'status-unlocked' : 'status-locked'}`}>
          <div className="lock-animation-wrap">
            <div className={`lock-ring ${isOpen ? 'ring-open' : 'ring-closed'}`}>
            </div>
            <div className="lock-icon-container">
              {isOpen ? (
                <svg className="lock-svg unlock-svg" viewBox="0 0 64 64" fill="none">
                  <path className="lock-body" d="M14 32h36v22a3 3 0 01-3 3H17a3 3 0 01-3-3V32z" fill="currentColor" opacity="0.9" />
                  <path className="lock-shackle open-shackle" d="M20 32V22c0-6.627 5.373-12 12-12s12 5.373 12 12" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none" />
                  <circle cx="32" cy="44" r="4" fill="white" opacity="0.85"/>
                  <rect x="30" y="46" width="4" height="6" rx="2" fill="white" opacity="0.85"/>
                </svg>
              ) : (
                <svg className="lock-svg" viewBox="0 0 64 64" fill="none">
                  <path className="lock-body" d="M14 32h36v22a3 3 0 01-3 3H17a3 3 0 01-3-3V32z" fill="currentColor" opacity="0.9" />
                  <path className="lock-shackle" d="M20 32V22c0-6.627 5.373-12 12-12s12 5.373 12 12v10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none" />
                  <circle cx="32" cy="44" r="4" fill="white" opacity="0.85"/>
                  <rect x="30" y="46" width="4" height="6" rx="2" fill="white" opacity="0.85"/>
                </svg>
              )}
            </div>
          </div>

          <div className="status-info">
            <div className={`status-badge-large ${isOpen ? 'badge-unlocked' : 'badge-locked'}`}>
              {isUnlocking ? 'UNLOCKING…' : isOpen ? 'UNLOCKED' : 'LOCKED'}
            </div>
            <p className="status-desc">
              {isUnlocking
                ? 'Sending Unlock command to device…'
                : isOpen
                ? 'Door is currently open. Auto-lock in 7 seconds.'
                : 'Door is secured. Access control active.'}
            </p>
          </div>
        </div>

        {/* Info Cards */}
        <div className="info-cards-col">
          <div className="info-card glass">
            <div className="info-card-icon" style={{ background: 'linear-gradient(135deg,#3b82f6,#06b6d4)' }}>
              <svg viewBox="0 0 24 24" fill="white" width="20" height="20">
                <path d="M12 1C8.676 1 6 3.676 6 7v1H4a1 1 0 00-1 1v12a1 1 0 001 1h16a1 1 0 001-1V9a1 1 0 00-1-1h-2V7c0-3.324-2.676-6-6-6zm0 2c2.276 0 4 1.724 4 4v1H8V7c0-2.276 1.724-4 4-4zm0 9a2 2 0 110 4 2 2 0 010-4z"/>
              </svg>
            </div>
            <div>
              <p className="info-label">Door State</p>
              <p className="info-value">{isOpen ? (isUnlocking ? 'Opening…' : 'Open') : 'Closed'}</p>
            </div>
          </div>

          <div className="info-card glass">
            <div className="info-card-icon" style={{ background: 'linear-gradient(135deg,#8b5cf6,#c084fc)' }}>
              <svg viewBox="0 0 24 24" fill="white" width="20" height="20">
                <path d="M12 2a10 10 0 100 20A10 10 0 0012 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
              </svg>
            </div>
            <div>
              <p className="info-label">Security</p>
              <p className="info-value">{isOpen ? 'Moderate' : 'Maximum'}</p>
            </div>
          </div>

          <div className="info-card glass">
            <div className="info-card-icon" style={{ background: 'linear-gradient(135deg,#f59e0b,#fbbf24)' }}>
              <svg viewBox="0 0 24 24" fill="white" width="20" height="20">
                <path d="M12 2a10 10 0 100 20A10 10 0 0012 2zm0 18a8 8 0 110-16 8 8 0 010 16zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/>
              </svg>
            </div>
            <div>
              <p className="info-label">Auto-Lock</p>
              <p className="info-value">7 seconds</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

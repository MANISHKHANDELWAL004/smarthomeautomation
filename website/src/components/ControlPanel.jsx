import React from 'react';
import './ControlPanel.css';

export default function ControlPanel({ role, doorStatus, onUnlock, loading, btnDisabled, message }) {
  const isOwner = role === 'owner';
  // Both 'unlocking' and 'unlocked' show the open door visuals immediately
  const isOpen      = doorStatus === 'unlocked' || doorStatus === 'unlocking';
  const isUnlocking = doorStatus === 'unlocking';

  const handleButtonClick = (e) => {
    // UI-layer guard — primary guards live in App.jsx handleUnlock
    if (loading || btnDisabled || isOpen) return;

    // Ripple effect
    const btn = e.currentTarget;
    const ripple = document.createElement('span');
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    ripple.className = 'ripple';
    ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px;`;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
    onUnlock();
  };

  return (
    <section className="control-section fade-in-up" id="control" style={{ animationDelay: '0.1s' }}>
      <div className="section-header">
        <h2 className="section-title">Door Control Panel</h2>
        <p className="section-sub">Authorize and manage physical door access</p>
      </div>

      <div className="control-card glass">
        {/* Door Visual */}
        <div className="door-visual-wrap">
          <div className={`door-frame ${isOpen ? 'frame-open' : ''}`}>
            <div className={`door-panel ${isOpen ? 'door-open' : ''}`}>
              <div className="door-stripe"></div>
              <div className="door-stripe"></div>
              <div className="door-knob"></div>
              <div className="door-peephole"></div>
            </div>
            <div className="door-shadow-floor"></div>
          </div>
          <div className="door-label">
            {isOpen ? (isUnlocking ? '⏳ Unlocking…' : '🔓 Door Open') : '🔒 Door Closed'}
          </div>
        </div>

        {/* Controls */}
        <div className="control-right">
          <div className="control-status-indicator">
            <span className={`indicator-dot ${isOpen ? 'dot-open' : 'dot-closed'}`}></span>
            <span className="indicator-text">
              Status: <strong>{isUnlocking ? 'UNLOCKING…' : isOpen ? 'UNLOCKED' : 'LOCKED'}</strong>
            </span>
          </div>

          {isOwner ? (
            <button
              id="btn-unlock-door"
              className={`unlock-btn ripple-container ${loading || isUnlocking ? 'btn-loading' : ''} ${isOpen && !isUnlocking ? 'btn-already-open' : ''} ${btnDisabled && !isOpen && !loading ? 'btn-cooling' : ''}`}
              onClick={handleButtonClick}
              disabled={loading || btnDisabled || isOpen}
            >
              {loading || isUnlocking ? (
                <>
                  <span className="spinner"></span>
                  Connecting…
                </>
              ) : isOpen ? (
                <>
                  <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                    <path d="M12 1C8.676 1 6 3.676 6 7v1H4a1 1 0 00-1 1v12a1 1 0 001 1h16a1 1 0 001-1V9a1 1 0 00-1-1h-2V7c0-3.324-2.676-6-6-6zm4 8v10H8V9h8zm-4 2a2 2 0 110 4 2 2 0 010-4z"/>
                  </svg>
                  Door Open
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                  </svg>
                  Unlock Door
                </>
              )}
            </button>
          ) : (
            <div className="access-denied-box">
              <div className="denied-icon">
                <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
              </div>
              <p className="access-denied-title">Access Denied</p>
              <p className="access-denied-sub">Only <strong>Owner</strong> can Unlock the door. You are logged in as <strong style={{textTransform:'capitalize'}}>{role}</strong>.</p>
            </div>
          )}

          {message && (
            <div className={`action-message ${message.type}`}>
              <span className="msg-icon">
                {message.type === 'success' ? '✅' : message.type === 'error' ? '❌' : 'ℹ️'}
              </span>
              {message.text}
            </div>
          )}

          <div className="control-hints">
            <div className="hint-item">
              <span className="hint-dot" style={{background:'#3b82f6'}}></span>
              Request is sent to <code>192.168.4.1/Unlock</code>
            </div>
            <div className="hint-item">
              <span className="hint-dot" style={{background:'#10b981'}}></span>
              Auto-lock activates after 7 seconds
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

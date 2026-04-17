import React from 'react';
import './Header.css';
import pietLogo from '../assets/pietlogo.png';

export default function Header() {
  return (
    <header className="header glass">

      {/* ── AquaLock branding + PIET logo + Live System badge — all in one row ── */}
      <div className="header-inner">

        {/* Left: AquaLock lock icon + title */}
        <div className="header-logo">
          <div className="logo-icon">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="24" cy="24" r="23" fill="url(#logoGrad)" stroke="white" strokeWidth="1.5"/>
              <path d="M24 12C19.582 12 16 15.582 16 20v2h-2a2 2 0 00-2 2v12a2 2 0 002 2h20a2 2 0 002-2V24a2 2 0 00-2-2h-2v-2c0-4.418-3.582-8-8-8zm0 3c2.757 0 5 2.243 5 5v2H19v-2c0-2.757 2.243-5 5-5zm0 10a3 3 0 110 6 3 3 0 010-6z" fill="white"/>
              <defs>
                <linearGradient id="logoGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#3b82f6"/>
                  <stop offset="1" stopColor="#06b6d4"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="header-text">
            <h1 className="header-title">AquaLock</h1>
            <p className="header-brand">Smart Door System</p>
          </div>
        </div>

        {/* Center: PIET Institution Logo */}
        <div className="header-inst-logo-wrap">
          <img
            src={pietLogo}
            alt="Poornima Institute of Engineering and Technology"
            className="header-inst-logo"
          />
        </div>

        {/* Right: Live System badge */}
        <div className="header-subtitle-wrap">
          <span className="header-badge">
            <span className="badge-dot"></span>
            Live System
          </span>
        </div>

      </div>

      {/* ── Tagline ── */}
      <div className="header-tagline">
        <p>Smart, Secure &amp; Seamless Access</p>
      </div>

    </header>
  );
}

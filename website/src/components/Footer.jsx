import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer glass">
      <div className="footer-inner">
        <div className="footer-logo-group">
          <div className="footer-lock-icon">🔒</div>
          <div>
            <p className="footer-brand-name">AquaLock</p>
            <p className="footer-brand-sub">Smart Door Control System</p>
          </div>
        </div>

        <div className="footer-center">
          <p className="footer-inst">
            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" style={{ color: '#3b82f6' }}>
              <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
            </svg>
            Poornima Institute of Engineering and Technology
          </p>
          <p className="footer-dept">Department of Computer Science &amp; Engineering</p>
        </div>

        <div className="footer-right">
          <p className="footer-copy">&copy; {new Date().getFullYear()} AquaLock Project</p>
          <p className="footer-built">Built with ❤️ for Smart IoT</p>
        </div>
      </div>
      <div className="footer-divider" />
      <p className="footer-disclaimer">
        This application communicates directly with the ESP8266 device on <strong>192.168.4.1</strong> over your local WiFi network.
      </p>
    </footer>
  );
}

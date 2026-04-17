import React, { useState, useRef } from 'react';
import './DeviceInfo.css';

// ─────────────────────────────────────────────────────────────────────────────
// DeviceInfo — checks if the ESP8266 is reachable over local WiFi.
//
// IMPORTANT RULES:
//   • This component NEVER calls /unlock.
//   • It pings the device root URL (/) to check reachability only.
//   • No automatic checks on mount — user must click "Re-check".
//   • No retries on failure.
// ─────────────────────────────────────────────────────────────────────────────

export default function DeviceInfo({ statusUrl, wifiName }) {
  const [pingStatus, setPingStatus] = useState('unknown');
  const [latency, setLatency]       = useState(null);
  const [networkMsg, setNetworkMsg] = useState(null);
  const isCheckingRef               = useRef(false);

  /**
   * Ping the device root URL (/) to check if it is reachable.
   * This does NOT call /unlock and does NOT trigger the relay.
   * Called ONLY when user clicks the "Re-check" button.
   */
  const checkDevice = async () => {
    if (isCheckingRef.current) return; // prevent double-click during check
    isCheckingRef.current = true;
    setPingStatus('checking');
    setNetworkMsg(null);
    setLatency(null);

    const start = Date.now();
    try {
      const ctrl     = new AbortController();
      const timeoutId = setTimeout(() => ctrl.abort(), 3000);

      // Fetch device ROOT — completely separate from /unlock endpoint
      const response = await fetch(statusUrl, {
        method: 'GET',
        cache:  'no-store',
        signal: ctrl.signal,
      });
      clearTimeout(timeoutId);

      const elapsed = Date.now() - start;
      setLatency(elapsed);

      if (response.ok || response.status === 0) {
        setPingStatus('online');
        setNetworkMsg(`Connected to ${wifiName} Device Network`);
      } else {
        setPingStatus('offline');
        setNetworkMsg(`Please connect to ${wifiName} WiFi`);
      }
    } catch (err) {
      // AbortError = timeout; TypeError = network/CORS
      // In both cases the device may be unreachable — show offline.
      // TypeError from CORS means the device IS reachable (it responded),
      // so show online in that case.
      if (err.name === 'TypeError') {
        // CORS block — device responded, so it's reachable
        const elapsed = Date.now() - start;
        setLatency(elapsed);
        setPingStatus('online');
        setNetworkMsg(`Connected to ${wifiName} Device Network`);
      } else {
        // Timeout or other — device not reachable
        setPingStatus('offline');
        setNetworkMsg(`Please connect to ${wifiName} WiFi`);
      }
    } finally {
      isCheckingRef.current = false;
    }
  };

  const statusMap = {
    unknown:  { label: 'Not Checked',    color: '#64748b', bg: 'rgba(100,116,139,0.07)', border: 'rgba(100,116,139,0.2)',  dot: '#94a3b8' },
    checking: { label: 'Checking…',      color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',   border: 'rgba(245,158,11,0.25)', dot: '#f59e0b' },
    online:   { label: 'Device Online',  color: '#059669', bg: 'rgba(16,185,129,0.1)',   border: 'rgba(16,185,129,0.25)', dot: '#10b981' },
    offline:  { label: 'Device Offline', color: '#dc2626', bg: 'rgba(239,68,68,0.08)',   border: 'rgba(239,68,68,0.2)',   dot: '#ef4444' },
  };

  const st = statusMap[pingStatus] || statusMap.unknown;

  const deviceSpecs = [
    { label: 'Device IP',    value: '192.168.4.1',   icon: '🌐' },
    { label: 'Unlock URL',   value: '/Unlock',        icon: '🔗' },
    { label: 'Status URL',   value: '/ (root)',       icon: '📶' },
    { label: 'Protocol',     value: 'HTTP GET',       icon: '📡' },
    { label: 'Network',      value: wifiName,         icon: '📶' },
    { label: 'Hardware',     value: 'ESP8266',        icon: '🔧' },
  ];

  return (
    <section className="device-section fade-in-up" id="device" style={{ animationDelay: '0.3s' }}>
      <div className="section-header">
        <h2 className="section-title">Device Info</h2>
        <p className="section-sub">ESP8266 hardware connection status</p>
      </div>

      <div className="device-grid">
        {/* ── Status card ── */}
        <div className="device-status-card glass" style={{ borderColor: st.border, background: st.bg }}>
          <div className="device-icon-wrap">
            <div className="device-3d-icon">
              <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" width="70" height="70">
                <rect x="10" y="20" width="60" height="40" rx="6" fill="#1e3a5f" opacity="0.85"/>
                <rect x="14" y="24" width="52" height="32" rx="4" fill="#0f172a"/>
                <circle cx="40" cy="40" r="10" fill="url(#chipGrad)" opacity="0.9"/>
                <rect x="30" y="38" width="20" height="4" rx="2" fill="white" opacity="0.3"/>
                <rect x="38" y="30" width="4" height="20" rx="2" fill="white" opacity="0.3"/>
                {[22,30,38,46,54].map((x, i) => (
                  <rect key={`b${i}`} x={x} y="56" width="3" height="6" rx="1.5" fill="#3b82f6" opacity="0.7"/>
                ))}
                {[22,30,38,46,54].map((x, i) => (
                  <rect key={`t${i}`} x={x} y="18" width="3" height="6" rx="1.5" fill="#3b82f6" opacity="0.7"/>
                ))}
                <defs>
                  <linearGradient id="chipGrad" x1="30" y1="30" x2="50" y2="50" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#60a5fa"/>
                    <stop offset="1" stopColor="#2563eb"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="device-chip-label">ESP8266</div>
          </div>

          <div className="device-status-info">
            <div className="device-status-badge" style={{ color: st.color, borderColor: st.border }}>
              <span className="device-dot" style={{ background: st.dot, boxShadow: `0 0 0 4px ${st.border}` }}></span>
              {st.label}
            </div>

            {/* Network message — shown after a check */}
            {networkMsg && (
              <div
                className="device-network-msg"
                style={{
                  color:      pingStatus === 'online' ? '#059669' : '#dc2626',
                  background: pingStatus === 'online' ? 'rgba(16,185,129,0.07)' : 'rgba(239,68,68,0.06)',
                  border:     `1px solid ${pingStatus === 'online' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.15)'}`,
                }}
              >
                {pingStatus === 'online' ? '📶' : '⚠️'} {networkMsg}
              </div>
            )}

            {latency !== null && (
              <div className="device-latency">⚡ {latency}ms response time</div>
            )}

            <button
              id="btn-recheck-device"
              className="recheck-btn"
              onClick={checkDevice}
              disabled={isCheckingRef.current}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                <path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8A5.87 5.87 0 016 12c0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z"/>
              </svg>
              {pingStatus === 'checking' ? 'Checking…' : 'Re-check'}
            </button>
          </div>
        </div>

        {/* ── Specs card ── */}
        <div className="device-specs-card glass">
          {deviceSpecs.map((spec, i) => (
            <div key={i} className="spec-row">
              <span className="spec-icon">{spec.icon}</span>
              <span className="spec-label">{spec.label}</span>
              <span className="spec-value">{spec.value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

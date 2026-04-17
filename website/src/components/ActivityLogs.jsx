import React from 'react';
import './ActivityLogs.css';

const statusConfig = {
  granted: { label: 'Granted', icon: '✅', cls: 'log-granted' },
  denied: { label: 'Denied', icon: '🚫', cls: 'log-denied' },
  error: { label: 'Error', icon: '⚠️', cls: 'log-error' },
};

const roleIcons = { owner: '👑', guest: '🙋', child: '🧒' };

export default function ActivityLogs({ logs }) {
  return (
    <section className="logs-section fade-in-up" id="logs" style={{ animationDelay: '0.25s' }}>
      <div className="logs-header-row">
        <div className="section-header" style={{ marginBottom: 0 }}>
          <h2 className="section-title">Activity Logs</h2>
          <p className="section-sub">History of all access attempts</p>
        </div>
        <div className="log-count-badge">{logs.length} event{logs.length !== 1 ? 's' : ''}</div>
      </div>

      <div className="logs-card glass">
        {/* Table Header */}
        <div className="log-table-head">
          <span>Role</span>
          <span>Action</span>
          <span>Status</span>
          <span>Time</span>
        </div>

        {/* Log Rows */}
        <div className="log-rows">
          {logs.length === 0 ? (
            <div className="log-empty">
              <div className="log-empty-icon">📋</div>
              <p>No activity yet. Try Unlocking the door.</p>
            </div>
          ) : (
            [...logs].reverse().map((log, i) => {
              const sc = statusConfig[log.status] || statusConfig.granted;
              return (
                <div key={log.id} className={`log-row ${sc.cls}`} style={{ animationDelay: `${i * 0.04}s` }}>
                  <span className="log-role">
                    <span className="log-role-icon">{roleIcons[log.role] || '👤'}</span>
                    <span style={{ textTransform: 'capitalize' }}>{log.role}</span>
                  </span>
                  <span className="log-action">{log.action}</span>
                  <span className={`log-status-chip ${sc.cls}-chip`}>
                    {sc.icon} {sc.label}
                  </span>
                  <span className="log-time">{log.time}</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}

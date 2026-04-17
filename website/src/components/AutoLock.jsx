import React from 'react';
import './AutoLock.css';

export default function AutoLock({ doorStatus, countdown }) {
  // Show countdown as soon as door starts unlocking (optimistic state)
  const isActive = (doorStatus === 'unlocked' || doorStatus === 'unlocking') && countdown !== null;
  const progress = isActive ? ((7 - countdown) / 7) * 100 : 0;

  return (
    <section className="autolock-section fade-in-up" id="autolock" style={{ animationDelay: '0.2s' }}>
      <div className="section-header">
        <h2 className="section-title">Auto-Lock Simulation</h2>
        <p className="section-sub">Door locks automatically after 7 seconds</p>
      </div>

      <div className="autolock-card glass">
        <div className="autolock-left">
          <div className={`timer-ring-wrap ${isActive ? 'timer-active' : ''}`}>
            <svg className="timer-svg" viewBox="0 0 120 120">
              <circle
                cx="60" cy="60" r="50"
                fill="none"
                stroke="#e0f2fe"
                strokeWidth="10"
              />
              <circle
                cx="60" cy="60" r="50"
                fill="none"
                stroke={countdown !== null && countdown <= 3 ? '#ef4444' : '#3b82f6'}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 50}`}
                strokeDashoffset={`${2 * Math.PI * 50 * (1 - progress / 100)}`}
                transform="rotate(-90 60 60)"
                style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.5s' }}
              />
            </svg>
            <div className="timer-center">
              {isActive ? (
                <>
                  <span className={`timer-num ${countdown <= 3 ? 'timer-urgent' : ''}`}>{countdown}</span>
                  <span className="timer-unit">sec</span>
                </>
              ) : (
                <span className="timer-idle">—</span>
              )}
            </div>
          </div>
        </div>

        <div className="autolock-right">
          <div className="autolock-status">
            {isActive ? (
              <>
                <div className="al-badge al-badge-active">🔓 Auto-Lock Active</div>
                <p className="al-desc">
                  Door will automatically lock in <strong>{countdown} second{countdown !== 1 ? 's' : ''}</strong>.
                  {countdown <= 3 && ' ⚠️ Locking soon!'}
                </p>
                <div className="al-progress-bar">
                  <div
                    className="al-progress-fill"
                    style={{
                      width: `${progress}%`,
                      background: countdown <= 3
                        ? 'linear-gradient(90deg,#ef4444,#f97316)'
                        : 'linear-gradient(90deg,#3b82f6,#06b6d4)'
                    }}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="al-badge al-badge-idle">🔒 Auto-Lock Idle</div>
                <p className="al-desc">
                  Auto-lock timer will start once the door is Unlocked. The countdown will appear here.
                </p>
              </>
            )}
          </div>

          <div className="al-steps">
            <div className={`al-step ${doorStatus === 'unlocked' || doorStatus === 'unlocking' ? 'step-done' : 'step-pending'}`}>
              <div className="al-step-icon">{doorStatus === 'unlocked' || doorStatus === 'unlocking' ? '✓' : '1'}</div>
              <span>Door Unlocked</span>
            </div>
            <div className="al-step-connector"></div>
            <div className={`al-step ${isActive ? 'step-active' : 'step-pending'}`}>
              <div className="al-step-icon">{isActive ? '⏳' : '2'}</div>
              <span>Counting Down</span>
            </div>
            <div className="al-step-connector"></div>
            <div className={`al-step ${doorStatus === 'locked' && countdown === null ? 'step-done' : 'step-pending'}`}>
              <div className="al-step-icon">🔒</div>
              <span>Auto-Locked</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

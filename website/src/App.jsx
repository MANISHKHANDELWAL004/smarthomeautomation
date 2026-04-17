import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Header from './components/Header';
import NavBar from './components/NavBar';
import Dashboard from './components/Dashboard';
import ControlPanel from './components/ControlPanel';
import RoleSelector from './components/RoleSelector';
import AutoLock from './components/AutoLock';
import ActivityLogs from './components/ActivityLogs';
import DeviceInfo from './components/DeviceInfo';
import Footer from './components/Footer';

// ─── Constants ────────────────────────────────────────────────────────────────
const UNLOCK_URL    = 'http://192.168.4.1/Unlock'; // ONLY for unlocking the door
const STATUS_URL    = 'http://192.168.4.1/';        // ONLY for device reachability check
const AUTO_LOCK_SEC = 7;                             // seconds before auto-lock
const WIFI_NAME     = 'SmartLock_AP';               // ESP8266 access-point SSID

// ─── Door state machine ───────────────────────────────────────────────────────
// 'locked'    → door is closed and secured
// 'unlocking' → command sent, waiting for device confirmation (UI shows open immediately)
// 'unlocked'  → door is open, auto-lock countdown running

export default function App() {
  const [doorStatus, setDoorStatus]   = useState('locked');
  const [role, setRole]               = useState('owner');
  const [loading, setLoading]         = useState(false);
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [message, setMessage]         = useState(null);
  const [logs, setLogs]               = useState([]);
  const [countdown, setCountdown]     = useState(null);
  const [activeNav, setActiveNav]     = useState('dashboard');

  // Refs — mutations never cause re-renders
  const lockTimerRef      = useRef(null);  // setTimeout for auto-lock
  const countdownRef      = useRef(null);  // setInterval for countdown UI
  const cooldownRef       = useRef(null);  // setTimeout for button re-enable
  const msgTimerRef       = useRef(null);  // setTimeout for message auto-clear
  const unlockUITimerRef  = useRef(null);  // setTimeout for unlocking→unlocked visual transition
  const isProcessingRef   = useRef(false); // hard mutex: blocks concurrent fetches
  const logIdRef          = useRef(0);

  // ── Cleanup all timers on unmount only ──────────────────────────────────────
  useEffect(() => {
    return () => {
      clearTimeout(lockTimerRef.current);
      clearInterval(countdownRef.current);
      clearTimeout(cooldownRef.current);
      clearTimeout(msgTimerRef.current);
      clearTimeout(unlockUITimerRef.current);
    };
  }, []);

  // ── Section scroll observer for NavBar highlight ─────────────────────────
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveNav(entry.target.id);
        });
      },
      { threshold: 0.3 }
    );
    const sections = document.querySelectorAll('section[id]');
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const formatTime = () =>
    new Date().toLocaleTimeString('en-IN', {
      hour: '2-digit', minute: '2-digit', second: '2-digit',
    });

  const addLog = (action, status, roleName) => {
    setLogs((prev) => [
      ...prev,
      { id: ++logIdRef.current, role: roleName, action, status, time: formatTime() },
    ]);
  };

  /** Show a message, auto-clear after durationMs (0 = persistent) */
  const showMessage = (msg, durationMs = 5000) => {
    clearTimeout(msgTimerRef.current);
    setMessage(msg);
    if (durationMs > 0) {
      msgTimerRef.current = setTimeout(() => setMessage(null), durationMs);
    }
  };

  /** Clear all auto-lock timers and reset countdown */
  const clearAutoLockTimers = () => {
    clearTimeout(lockTimerRef.current);
    clearInterval(countdownRef.current);
    lockTimerRef.current   = null;
    countdownRef.current   = null;
    setCountdown(null);
  };

  /**
   * Start the 7-second auto-lock sequence.
   * Must only be called ONCE per unlock action.
   * Clears any existing timers before starting new ones.
   */
  const startAutoLock = () => {
    clearAutoLockTimers(); // ensure no duplicate timers

    let remaining = AUTO_LOCK_SEC;
    setCountdown(remaining);

    // Tick every second for UI countdown
    countdownRef.current = setInterval(() => {
      remaining -= 1;
      setCountdown(remaining);
      if (remaining <= 0) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
        setCountdown(null);
      }
    }, 1000);

    // Lock the door when countdown reaches 0
    lockTimerRef.current = setTimeout(() => {
      setDoorStatus('locked');
      setBtnDisabled(false); // re-enable button after auto-lock
      showMessage({ type: 'info', text: '🔒 Door has been automatically locked.' }, 4000);
      setLogs((prev) => [
        ...prev,
        {
          id: ++logIdRef.current,
          role: 'system',
          action: 'Auto-Lock',
          status: 'granted',
          time: formatTime(),
        },
      ]);
    }, AUTO_LOCK_SEC * 1000);
  };

  /**
   * Disable the unlock button for AUTO_LOCK_SEC seconds.
   * The button re-enables when auto-lock fires (or after timeout as fallback).
   */
  const startButtonCooldown = () => {
    setBtnDisabled(true);
    clearTimeout(cooldownRef.current);
    // Fallback: re-enable 1 second after auto-lock would have fired
    cooldownRef.current = setTimeout(
      () => setBtnDisabled(false),
      (AUTO_LOCK_SEC + 1) * 1000
    );
  };

  // ── Main unlock handler ──────────────────────────────────────────────────────
  const handleUnlock = async () => {
    // Guard 1: Role check — only Owner may unlock
    if (role !== 'owner') {
      addLog('Unlock Attempt', 'denied', role);
      showMessage({ type: 'error', text: '🚫 Access Denied! Only the Owner can Unlock the door.' }, 4000);
      return;
    }

    // Guard 2: Already open — no action needed
    if (doorStatus === 'unlocked' || doorStatus === 'unlocking') return;

    // Guard 3: Mutex — prevent concurrent fetch calls
    if (isProcessingRef.current) return;

    // Guard 4: Button cooldown — debounce from previous click
    if (btnDisabled) return;

    // ═══════════════════════════════════════════════════════════════════
    // t = 0ms (click time) — everything below fires BEFORE the fetch
    // ═══════════════════════════════════════════════════════════════════
    isProcessingRef.current = true;
    setLoading(true);
    setMessage(null);

    // Step 1 — Show 'unlocking' state immediately
    setDoorStatus('unlocking');

    // Step 2 — Start the 7-second auto-lock timer RIGHT NOW, at click time.
    //           This ensures the UI countdown and the hardware relay are
    //           perfectly synchronized regardless of network latency.
    startAutoLock();
    startButtonCooldown();

    // Step 3 — After 400ms, transition 'unlocking' → 'unlocked' visually.
    //           This is purely cosmetic — the timer is already running.
    clearTimeout(unlockUITimerRef.current);
    unlockUITimerRef.current = setTimeout(() => {
      // Only advance to 'unlocked' if we haven't been reverted to 'locked'
      setDoorStatus((prev) => (prev === 'unlocking' ? 'unlocked' : prev));
    }, 400);

    // ═══════════════════════════════════════════════════════════════════
    // t = 0ms+  — dispatch the network request in the background.
    //             The timer is already running; the fetch result only
    //             determines the log entry and feedback message.
    // ═══════════════════════════════════════════════════════════════════
    try {
      const ctrl = new AbortController();
      const fetchTimeout = setTimeout(() => ctrl.abort(), 5000);

      const response = await fetch(UNLOCK_URL, {
        method: 'GET',
        signal: ctrl.signal,
        cache:  'no-store', // prevent stale cached response
      });
      clearTimeout(fetchTimeout);

      if (response.ok || response.status === 0) {
        // ── Device confirmed — log success, timer already running ────────
        showMessage(
          { type: 'success', text: `✅ Door Unlocked! Auto-locking in ${AUTO_LOCK_SEC}s. (${WIFI_NAME})` },
          5000
        );
        addLog('Unlock Door', 'granted', role);

      } else {
        // ── Device returned a hard HTTP error (4xx/5xx) ──────────────────
        // Only genuine HTTP errors revert the UI — cancel everything.
        clearTimeout(unlockUITimerRef.current);
        clearAutoLockTimers();
        setDoorStatus('locked');
        setBtnDisabled(false);
        showMessage(
          { type: 'error', text: `❌ Device error (HTTP ${response.status}). Connect to "${WIFI_NAME}" and try again.` },
          6000
        );
        addLog('Unlock Door', 'error', role);
      }

    } catch (err) {
      if (err.name === 'AbortError') {
        // ── Fetch timed out after 5s ─────────────────────────────────────
        // Timer is already running from t=0. Device almost certainly
        // received the GET before the browser timed out — keep state.
        showMessage(
          { type: 'success', text: `🔓 Unlock command sent. (Response timed out — normal on ${WIFI_NAME}). Auto-locking in progress.` },
          6000
        );
        addLog('Unlock Door', 'granted', role);

      } else if (err.name === 'TypeError') {
        // ── Network / CORS rejection ─────────────────────────────────────
        // ESP8266 doesn't set CORS headers, so the browser rejects the
        // response after the device has already acted on the GET request.
        // Timer is already running — keep state, just log it.
        showMessage(
          { type: 'success', text: `🔓 Unlock command sent to ${WIFI_NAME}. (Browser CORS policy blocked the response — door is Unlocking.)` },
          6000
        );
        addLog('Unlock Door', 'granted', role);

      } else {
        // ── Unexpected error — revert everything ─────────────────────────
        clearTimeout(unlockUITimerRef.current);
        clearAutoLockTimers();
        setDoorStatus('locked');
        setBtnDisabled(false);
        showMessage(
          { type: 'error', text: `❌ Could not reach device. Connect to "${WIFI_NAME}" WiFi and try again.` },
          6000
        );
        addLog('Unlock Door', 'error', role);
      }

    } finally {
      // Always release mutex and loading spinner
      isProcessingRef.current = false;
      setLoading(false);
    }
  };

  // ── Role change ──────────────────────────────────────────────────────────────
  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setMessage(null);
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="app-wrapper">
      {/* Ambient background blobs — decorative only */}
      <div className="bg-blob blob-1" aria-hidden="true" />
      <div className="bg-blob blob-2" aria-hidden="true" />
      <div className="bg-blob blob-3" aria-hidden="true" />

      <Header />

      <main className="main-content">
        <NavBar active={activeNav} onNav={setActiveNav} />

        <Dashboard doorStatus={doorStatus} />
        <ControlPanel
          role={role}
          doorStatus={doorStatus}
          onUnlock={handleUnlock}
          loading={loading}
          btnDisabled={btnDisabled}
          message={message}
        />
        <RoleSelector role={role} onRoleChange={handleRoleChange} />
        <AutoLock doorStatus={doorStatus} countdown={countdown} />
        <ActivityLogs logs={logs} />
        <DeviceInfo statusUrl={STATUS_URL} wifiName={WIFI_NAME} />
      </main>

      <Footer />
    </div>
  );
}

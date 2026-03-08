'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Shield, Crosshair, CircleCheck } from 'lucide-react';

const presets = ['Austin, TX', 'Seattle, WA', 'Miami, FL'];

export default function Setup() {
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Placeholder flow until profile persistence + geocoding is wired.
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 900);
    }, 900);
  };

  return (
    <div className="portal-shell">
      <nav className="portal-nav">
        <Link href="/" className="portal-brand"><Shield size={18} /> SENTINEL OPS</Link>
        <div className="portal-links">
          <Link href="/" className="portal-link">Home</Link>
          <Link href="/dashboard" className="portal-link">Dashboard</Link>
        </div>
      </nav>

      <main className="portal-grid setup-grid">
        <section className="portal-panel">
          <span className="portal-chip"><Crosshair size={14} /> Area Configuration</span>
          <h1 className="portal-title">Set Monitoring Coordinates</h1>
          <p className="portal-subtitle">Choose the location Sentinel should prioritize for hazard scans and alerts.</p>

          <form onSubmit={handleSave} style={{ marginTop: '1rem' }}>
            <label className="input-label">City / Region</label>
            <input
              type="text"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="portal-input"
              placeholder="Example: Austin, TX"
            />
            <div className="portal-actions">
              <button type="submit" className="portal-btn" disabled={loading || success}>
                {loading ? 'Syncing...' : success ? 'Location Synced' : 'Save and Continue'}
              </button>
              <Link href="/dashboard" className="portal-btn secondary">Skip to Dashboard</Link>
            </div>
          </form>
        </section>

        <aside className="portal-panel">
          <h2 style={{ marginBottom: '0.8rem' }}>Quick Presets</h2>
          <div className="card-grid">
            {presets.map((preset) => (
              <button
                key={preset}
                className="setup-option"
                onClick={() => setCity(preset)}
                type="button"
              >
                <span>{preset}</span>
                <CircleCheck size={16} className="status-active" />
              </button>
            ))}
          </div>
          <p className="small-muted" style={{ marginTop: '0.9rem' }}>
            Current setup page stores location locally in this demo flow and forwards you to the live dashboard.
          </p>
        </aside>
      </main>
    </div>
  );
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Shield, Activity, LocateFixed } from 'lucide-react';
import AlertCard from '@/components/AlertCard';
import MapView from '@/components/MapView';
import ChatPanel from '@/components/ChatPanel';

const MOCK_USER_ID = '8732a39a-7622-4a0b-932b-3443a29777f9';

export default function Dashboard() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scanRunning, setScanRunning] = useState(false);
  const [scanMessage, setScanMessage] = useState('');
  const [userLocation] = useState({ lat: 30.2672, lng: -97.7431, name: 'Austin, TX' });

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/alerts?userId=${MOCK_USER_ID}`);
      const data = await res.json();
      setAlerts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch alerts:', err);
      setScanMessage('Could not load alerts. Check API and Firebase connection.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  async function runHazardScan() {
    setScanRunning(true);
    setScanMessage('Running hazard sweep...');

    try {
      const res = await fetch('/api/check-hazards');
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || 'Scan failed.');
      }

      setScanMessage(`Sweep complete: ${data.hazardsProcessed || 0} new hazards processed.`);
      await fetchAlerts();
    } catch (err) {
      console.error('Hazard scan failed:', err);
      setScanMessage(err.message || 'Hazard scan failed.');
    } finally {
      setScanRunning(false);
    }
  }

  return (
    <div className="portal-shell">
      <nav className="portal-nav">
        <Link href="/" className="portal-brand"><Shield size={18} /> SENTINEL OPS</Link>
        <div className="portal-links">
          <Link href="/" className="portal-link">Home</Link>
          <Link href="/setup" className="portal-link">Location Setup</Link>
          <a href="#alerts" className="portal-link">Alert Feed</a>
          <a href="#map" className="portal-link">Live Map</a>
          <a href="#chat" className="portal-link">AI Chat</a>
        </div>
      </nav>

      <main className="portal-grid">
        <section className="portal-panel">
          <span className="portal-chip"><Activity size={14} /> Operations Console</span>
          <h1 className="portal-title">Live Response Dashboard</h1>
          <p className="portal-subtitle">
            View active risks, run manual sweeps, monitor mapped hazard proximity, and chat with Sentinel AI.
          </p>
          <div className="portal-actions">
            <button className="portal-btn" onClick={runHazardScan} disabled={scanRunning}>
              {scanRunning ? 'Scanning...' : 'Run Hazard Sweep'}
            </button>
            <button className="portal-btn secondary" onClick={fetchAlerts}>Refresh Feed</button>
            <Link href="/setup" className="portal-btn warning">Change Location</Link>
          </div>
          <p className="small-muted" style={{ marginTop: '0.7rem' }}>{scanMessage || 'System idle. Awaiting command.'}</p>
        </section>

        <section className="portal-panel">
          <div className="metric-grid">
            <article className="metric-card">
              <p className="metric-label">Active Alerts</p>
              <p className="metric-value">{alerts.length}</p>
            </article>
            <article className="metric-card">
              <p className="metric-label">Tracked Location</p>
              <p className="metric-value"><LocateFixed size={16} style={{ verticalAlign: 'text-bottom' }} /> {userLocation.name}</p>
            </article>
            <article className="metric-card">
              <p className="metric-label">Data Backend</p>
              <p className="metric-value status-active">Firebase</p>
            </article>
          </div>
        </section>

        <section className="dashboard-grid">
          <div className="portal-panel" id="alerts">
            <h2 style={{ marginBottom: '0.7rem' }}>Alert Feed</h2>
            <div className="alert-list">
              {loading ? (
                <p className="small-muted">Loading alerts...</p>
              ) : alerts.length > 0 ? (
                alerts.map((alert) => <AlertCard key={alert.id} alert={alert} />)
              ) : (
                <p className="small-muted">No active alerts in this feed yet.</p>
              )}
            </div>
          </div>

          <div className="dashboard-side">
            <div className="portal-panel" id="map">
              <h2 style={{ marginBottom: '0.7rem' }}>Hazard Map</h2>
              <div className="map-shell">
                <MapView userLocation={userLocation} alerts={alerts} />
              </div>
            </div>
            <ChatPanel userId={MOCK_USER_ID} location={userLocation} alerts={alerts} />
          </div>
        </section>
      </main>
    </div>
  );
}

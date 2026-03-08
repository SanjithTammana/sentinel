import Link from "next/link";
import { Shield, Radar, Route, Satellite, Cpu } from "lucide-react";

const quickStats = [
  { label: "Feeds Online", value: "03/03", status: "status-active" },
  { label: "Scan Cycle", value: "5 min", status: "" },
  { label: "Response SLA", value: "<30 sec", status: "" },
  { label: "Risk Protocol", value: "Armed", status: "status-warning" },
];

const features = [
  {
    title: "Real-Time Hazard Intel",
    text: "Weather, seismic, and fire feeds converge into a single live operations surface.",
    action: "/dashboard",
    actionLabel: "Open Dashboard",
    icon: Radar,
  },
  {
    title: "AI Triage + Action Plan",
    text: "Each signal is translated into calm, ranked, plain-language response steps.",
    action: "/api/check-hazards",
    actionLabel: "Trigger Scan Endpoint",
    icon: Cpu,
  },
  {
    title: "Navigation and Safe Routes",
    text: "Map overlays prioritize evacuation direction and safer movement corridors.",
    action: "/setup",
    actionLabel: "Configure Location",
    icon: Route,
  },
];

export default function Home() {
  return (
    <div className="portal-shell">
      <nav className="portal-nav">
        <Link href="/" className="portal-brand">
          <Shield size={18} /> SENTINEL OPS
        </Link>
        <div className="portal-links">
          <Link href="/setup" className="portal-link">Setup</Link>
          <Link href="/dashboard" className="portal-link">Dashboard</Link>
          <a href="#intel" className="portal-link">Intel Feeds</a>
          <a href="#actions" className="portal-link">Quick Actions</a>
        </div>
      </nav>

      <main className="portal-grid">
        <section className="portal-panel">
          <span className="portal-chip"><Satellite size={14} /> Disaster Command Portal</span>
          <h1 className="portal-title">Sentinel Emergency Operations Network</h1>
          <p className="portal-subtitle">
            One interface for detection, triage, and response. Move from incoming hazard signal to immediate action without switching tools.
          </p>
          <div className="portal-actions" id="actions">
            <Link href="/setup" className="portal-btn">Start Setup</Link>
            <Link href="/dashboard" className="portal-btn secondary">Launch Dashboard</Link>
            <a href="/api/check-hazards" className="portal-btn warning">Run Hazard Sweep</a>
          </div>
        </section>

        <section className="portal-panel" id="intel">
          <div className="metric-grid">
            {quickStats.map((item) => (
              <article className="metric-card" key={item.label}>
                <p className="metric-label">{item.label}</p>
                <p className={`metric-value ${item.status}`}>{item.value}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="portal-panel">
          <div className="card-grid">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <article className="feature-card" key={feature.title}>
                  <p className="portal-chip"><Icon size={14} /> Module</p>
                  <h2 style={{ marginTop: "0.6rem", fontSize: "1.2rem" }}>{feature.title}</h2>
                  <p className="portal-subtitle" style={{ marginTop: "0.4rem", fontSize: "0.98rem" }}>{feature.text}</p>
                  <div className="portal-actions">
                    <Link href={feature.action} className="portal-btn">{feature.actionLabel}</Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="portal-panel">
          <p className="small-muted">
            Portal status: Pre-release build v0.2. Primary navigation now routes to live pages and actionable endpoints.
          </p>
        </section>
      </main>
    </div>
  );
}

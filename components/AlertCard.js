import { AlertTriangle, MapPin, Clock3 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

function severityClass(severity) {
  const value = String(severity || '').toLowerCase();
  if (value === 'critical') return 'critical';
  if (value === 'high') return 'high';
  if (value === 'moderate') return 'moderate';
  return 'low';
}

export default function AlertCard({ alert }) {
  const { title, severity, created_at, ai_advice, description, type } = alert;
  const headClass = severityClass(severity);

  return (
    <article className="alert-card">
      <header className={`alert-head ${headClass}`}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
          <AlertTriangle size={14} /> {type || 'hazard'} alert
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
          <Clock3 size={13} />
          {created_at ? formatDistanceToNow(new Date(created_at), { addSuffix: true }) : 'new'}
        </span>
      </header>

      <div className="alert-body">
        <h3 className="alert-title">{title || 'Unnamed alert'}</h3>
        <p className="small-muted">Risk level: {severity || 'Unknown'}</p>

        {description ? <p className="alert-text">{description}</p> : null}

        {ai_advice ? (
          <div className="alert-actions">
            <p className="small-muted">AI guidance:</p>
            {ai_advice.advice ? <p className="alert-text">{ai_advice.advice}</p> : null}
            {ai_advice.actions?.map((action, idx) => (
              <p className="alert-step" key={`${action}-${idx}`}>{idx + 1}. {action}</p>
            ))}
            {ai_advice.safeRoute ? (
              <p className="alert-step"><MapPin size={13} style={{ marginRight: '0.35rem' }} />Safe route: {ai_advice.safeRoute}</p>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}

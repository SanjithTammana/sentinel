import { AlertTriangle, Info, MapPin, CheckCircle, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function AlertCard({ alert }) {
  const { title, severity, created_at, ai_advice, description, type } = alert;
  
  const getSeverityColor = (sev) => {
    switch (sev?.toLowerCase()) {
      case 'critical': return 'bg-red-600 border-red-700 text-white';
      case 'high': return 'bg-orange-600 border-orange-700 text-white';
      case 'moderate': return 'bg-yellow-500 border-yellow-600 text-black';
      default: return 'bg-blue-500 border-blue-600 text-white';
    }
  };

  const getSeverityBadge = (sev) => {
    switch (sev?.toLowerCase()) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-200 mb-6 transition-all hover:shadow-lg">
      <div className={`px-4 py-2 flex justify-between items-center ${getSeverityColor(severity)}`}>
        <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-sm">
          <AlertTriangle size={18} />
          {type} Alert
        </div>
        <div className="flex items-center gap-1 text-xs opacity-90">
          <Clock size={14} />
          {formatDistanceToNow(new Date(created_at), { addSuffix: true })}
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
        <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold mb-4 border ${getSeverityBadge(severity)}`}>
          Risk Level: {severity}
        </span>
        
        {description && (
          <p className="text-slate-600 text-sm mb-6 line-clamp-3">
            {description}
          </p>
        )}

        {ai_advice && (
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
            <div className="flex items-center gap-2 mb-3 text-indigo-600 font-bold text-sm uppercase tracking-tight">
              <Info size={16} />
              AI Action Plan
            </div>
            
            <div className="space-y-3">
              <p className="text-slate-800 font-medium text-sm leading-relaxed">
                {ai_advice.advice}
              </p>
              
              <div className="space-y-2">
                {ai_advice.actions?.map((action, idx) => (
                  <div key={idx} className="flex gap-3 items-start">
                    <div className="mt-1 h-5 w-5 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-[10px] font-bold shrink-0">
                      {idx + 1}
                    </div>
                    <span className="text-slate-700 text-sm">{action}</span>
                  </div>
                ))}
              </div>

              {ai_advice.safeRoute && (
                <div className="mt-4 pt-3 border-t border-slate-200 flex items-start gap-3">
                  <MapPin className="text-green-600 shrink-0 mt-0.5" size={16} />
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-0.5">Recommended Safe Route</span>
                    <span className="text-sm text-slate-800 font-semibold">{ai_advice.safeRoute}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

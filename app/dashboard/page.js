'use client';
import { useState, useEffect } from 'react';
import AlertCard from '@/components/AlertCard';
import MapView from '@/components/MapView';
import { Shield, AlertCircle, LayoutDashboard, Settings } from 'lucide-react';

export default function Dashboard() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState({ lat: 30.2672, lng: -97.7431, name: 'Austin, TX' });

  // In a real app, we'd get the current user from Supabase Auth
  const mockUserId = '8732a39a-7622-4a0b-932b-3443a29777f9';

  useEffect(() => {
    async function fetchAlerts() {
      try {
        const res = await fetch(`/api/alerts?userId=${mockUserId}`);
        const data = await res.json();
        setAlerts(data);
      } catch (err) {
        console.error('Failed to fetch alerts:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchAlerts();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col gap-8">
        <div className="flex items-center gap-2 text-indigo-600 font-black text-2xl tracking-tighter">
          <Shield fill="currentColor" size={32} />
          SENTINEL
        </div>
        
        <nav className="flex flex-col gap-1">
          <a href="#" className="flex items-center gap-3 px-4 py-3 bg-indigo-50 text-indigo-700 rounded-lg font-bold">
            <LayoutDashboard size={20} />
            Dashboard
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors font-medium">
            <AlertCircle size={20} />
            Active Alerts
          </a>
          <a href="/setup" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors font-medium">
            <Settings size={20} />
            Settings
          </a>
        </nav>

        <div className="mt-auto p-4 bg-slate-900 rounded-xl text-white">
          <p className="text-xs text-slate-400 mb-1 uppercase tracking-widest font-bold">Location Monitoring</p>
          <p className="font-bold">{userLocation.name}</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900">Safety Dashboard</h1>
            <p className="text-slate-500 font-medium">Monitoring hazards in your immediate vicinity.</p>
          </div>
          
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-lg shadow-indigo-200 transition-all flex items-center gap-2"
          >
            Check for Hazards
          </button>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Feed */}
          <div className="xl:col-span-5 h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-800">Alert Feed</h2>
              <span className="text-sm font-bold bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
                {alerts.length} Active
              </span>
            </div>
            
            <div className="flex-1 overflow-auto pr-2 custom-scrollbar">
              {loading ? (
                <div className="flex flex-col gap-4 animate-pulse">
                  {[1, 2, 3].map(i => <div key={i} className="h-64 bg-white rounded-xl border border-slate-200" />)}
                </div>
              ) : alerts.length > 0 ? (
                alerts.map(alert => <AlertCard key={alert.id} alert={alert} />)
              ) : (
                <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 text-slate-300 mb-4">
                    <Shield size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-700 mb-1">No hazards detected</h3>
                  <p className="text-slate-500">You're currently in a safe zone. We'll alert you if anything changes.</p>
                </div>
              )}
            </div>
          </div>

          {/* Map */}
          <div className="xl:col-span-7 h-[calc(100vh-200px)] min-h-[500px]">
            <MapView userLocation={userLocation} alerts={alerts} />
          </div>
        </div>
      </main>
    </div>
  );
}

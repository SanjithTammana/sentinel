'use client';
import { useState } from 'react';
import { MapPin, CheckCircle, Navigation } from 'lucide-react';

export default function Setup() {
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call to save location
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => window.location.href = '/dashboard', 1500);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-indigo-600 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-indigo-50 text-indigo-600 mb-6">
            <Navigation size={40} fill="currentColor" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Configure Sentinel</h1>
          <p className="text-slate-500 font-medium">Where should we monitor for hazards?</p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Your City / Region</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text"
                placeholder="e.g. Austin, TX"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-indigo-500 focus:outline-none transition-all font-medium"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading || success}
            className={`w-full py-4 rounded-xl font-black text-lg transition-all flex items-center justify-center gap-3 ${
              success 
              ? 'bg-green-500 text-white' 
              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-200'
            }`}
          >
            {loading ? 'Verifying Location...' : success ? (
              <>
                <CheckCircle size={24} />
                Location Saved
              </>
            ) : 'Start Monitoring'}
          </button>
        </form>

        <p className="mt-8 text-center text-slate-400 text-sm font-medium">
          We'll use your location to poll official disaster APIs within a 50km-200km radius.
        </p>
      </div>
    </div>
  );
}

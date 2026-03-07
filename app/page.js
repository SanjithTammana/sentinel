import { Shield, Navigation, AlertTriangle, Cpu, Map as MapIcon, Database } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <header className="bg-indigo-600 text-white pt-24 pb-32 px-6 relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 mb-10 px-4 py-2 bg-indigo-500 rounded-full text-indigo-100 font-bold tracking-tighter shadow-inner">
            <Shield size={20} fill="currentColor" />
            SENTINEL PRE-RELEASE v0.1
          </div>
          <h1 className="text-6xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tight">
            AI DISASTER <br />
            <span className="text-indigo-300">PREPAREDNESS</span> <br />
            COPILOT.
          </h1>
          <p className="text-xl md:text-2xl text-indigo-100 max-w-2xl mb-12 font-medium leading-relaxed">
            Real-time hazard monitoring meets intelligent guidance. We translate raw emergency data into clear, actionable safety plans.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="/setup" className="px-8 py-5 bg-white text-indigo-600 font-black text-xl rounded-2xl shadow-2xl shadow-indigo-800/40 hover:-translate-y-1 transition-all">
              Launch Sentinel
            </a>
            <a href="/dashboard" className="px-8 py-5 bg-indigo-500 text-white font-black text-xl rounded-2xl border-2 border-indigo-400 hover:bg-indigo-400 transition-all">
              View Demo Dashboard
            </a>
          </div>
        </div>

        {/* Abstract background elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
          <div className="absolute top-1/4 right-0 w-96 h-96 bg-white rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-indigo-200 rounded-full blur-[100px]" />
        </div>
      </header>

      {/* Features Grid */}
      <section className="py-24 px-6 -mt-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100 group hover:border-indigo-200 transition-all">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 text-indigo-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Navigation size={32} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-4">Location Aware</h3>
            <p className="text-slate-500 font-medium leading-relaxed">
              Set your location once. We continuously monitor NWS, USGS, and NASA FIRMS APIs within your specific safety radius.
            </p>
          </div>

          <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100 group hover:border-indigo-200 transition-all">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 text-orange-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Cpu size={32} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-4">AI Interpretation</h3>
            <p className="text-slate-500 font-medium leading-relaxed">
              Raw alerts are complex. Our AI layer translates technical data into prioritized action steps and clear risk levels.
            </p>
          </div>

          <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100 group hover:border-indigo-200 transition-all">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <MapIcon size={32} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-4">Evacuation Map</h3>
            <p className="text-slate-500 font-medium leading-relaxed">
              Visualize hazards and safety routes on an interactive Mapbox interface, personalized to your exact location.
            </p>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-24 px-6 bg-slate-50 border-y border-slate-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-black text-slate-900 mb-16 text-center uppercase tracking-tighter">Verified Integrations</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 opacity-50 grayscale hover:grayscale-0 transition-all">
            <div className="flex flex-col items-center gap-4">
              <div className="h-12 w-32 bg-slate-300 rounded-lg animate-pulse" />
              <span className="font-bold text-slate-600">NWS WEATHER</span>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="h-12 w-32 bg-slate-300 rounded-lg animate-pulse" />
              <span className="font-bold text-slate-600">USGS QUAKES</span>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="h-12 w-32 bg-slate-300 rounded-lg animate-pulse" />
              <span className="font-bold text-slate-600">NASA FIRMS</span>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="h-12 w-32 bg-slate-300 rounded-lg animate-pulse" />
              <span className="font-bold text-slate-600">MAPBOX GL</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-2 text-indigo-600 font-black text-2xl tracking-tighter">
            <Shield fill="currentColor" size={32} />
            SENTINEL
          </div>
          <div className="text-slate-400 font-medium text-sm">
            © 2026 Sentinel Project. All disaster APIs verified March 2026.
          </div>
        </div>
      </footer>
    </div>
  );
}

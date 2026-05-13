// src/pages/WellnessCornerPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, HeartPulse, Wind, BookOpen, Activity, AlertTriangle, Phone, CheckCircle2 } from 'lucide-react';

const WellnessCornerPage = () => {
  const [logs, setLogs] = useState([]);
  const [mood, setMood] = useState(null);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [breathePhase, setBreathePhase] = useState('Idle'); // Idle, Inhale, Hold, Exhale

  const navigate = useNavigate();

  const fetchLogs = async () => {
    try {
      const response = await fetch('https://bizferbine-backend.onrender.com/api/wellness/logs', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) setLogs(await response.json());
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleLogMood = async () => {
    if (!mood) return;
    setIsSubmitting(true);
    try {
      const response = await fetch('https://bizferbine-backend.onrender.com/api/wellness/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ mood, note })
      });
      if (response.ok) {
        setMood(null);
        setNote('');
        fetchLogs();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const startBreathingExercise = () => {
    setBreathePhase('Inhale');
    setTimeout(() => setBreathePhase('Hold'), 4000);
    setTimeout(() => setBreathePhase('Exhale'), 11000);
    setTimeout(() => setBreathePhase('Idle'), 19000);
  };

  const moods = [
    { label: 'Excellent', emoji: '🌟', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
    { label: 'Good', emoji: '😊', color: 'bg-teal-500/20 text-teal-300 border-teal-500/30' },
    { label: 'Neutral', emoji: '☁️', color: 'bg-slate-500/20 text-slate-300 border-slate-500/30' },
    { label: 'Stressed', emoji: '🌧️', color: 'bg-orange-500/20 text-orange-300 border-orange-500/30' },
    { label: 'Overwhelmed', emoji: '🌩️', color: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
  ];

  // Specific calm color palette override for this page
  return (
    <div className="min-h-screen bg-[#061014] text-slate-200 font-sans selection:bg-teal-500/30 pb-20 relative overflow-hidden">
      
      {/* Soft, calming gradients instead of aggressive neon */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-teal-800/10 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-sky-800/10 rounded-full blur-[150px] pointer-events-none"></div>

      {/* INLINE STYLE FOR BREATHING ANIMATION */}
      <style>{`
        .breathe-inhale { transform: scale(1.5); transition: transform 4s ease-in-out; }
        .breathe-hold { transform: scale(1.5); transition: transform 7s linear; }
        .breathe-exhale { transform: scale(1); transition: transform 8s ease-in-out; }
      `}</style>

      {/* TOP NAV */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#061014]/80 border-b border-white/5 p-4 flex justify-between items-center px-6 md:px-12">
        <Link to="/dashboard" className="flex items-center gap-2 text-slate-400 hover:text-teal-300 transition group">
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium text-sm tracking-wide">Back to Network</span>
        </Link>
        
        {/* PERSISTENT CRISIS BUTTON */}
        <a href="tel:988" className="bg-rose-900/30 hover:bg-rose-800/40 text-rose-300 px-5 py-2.5 rounded-full text-xs font-bold transition flex items-center gap-2 border border-rose-800/50">
          <Phone size={14} /> Crisis Support (988)
        </a>
      </nav>

      <main className="max-w-4xl mx-auto mt-12 px-6 relative z-10">
        
        {/* HEADER */}
        <div className="text-center mb-16">
          <div className="w-16 h-16 mx-auto bg-teal-900/30 border border-teal-500/20 rounded-3xl flex items-center justify-center mb-6 shadow-inner">
            <HeartPulse className="text-teal-400" size={32} />
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold text-slate-100 tracking-tight mb-4">
            Mental Health & Wellness
          </h1>
          <p className="text-slate-400 text-sm max-w-lg mx-auto leading-relaxed">
            A quiet space to recalibrate. Track your emotional trends, practice guided breathing, and access professional support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* LEFT COL: MOOD TRACKER */}
          <div className="bg-[#0A141A] border border-white/5 rounded-[2rem] p-8 shadow-xl">
            <h2 className="text-lg font-medium text-slate-200 mb-6 flex items-center gap-3">
              <Activity size={18} className="text-teal-400" /> How are you feeling right now?
            </h2>
            
            <div className="flex flex-wrap gap-3 mb-6">
              {moods.map(m => (
                <button 
                  key={m.label}
                  onClick={() => setMood(m.label)}
                  className={`flex-1 min-w-[100px] py-4 rounded-2xl flex flex-col items-center gap-2 transition-all duration-300 border ${mood === m.label ? m.color + ' scale-105 shadow-lg' : 'bg-white/5 border-transparent text-slate-400 hover:bg-white/10'}`}
                >
                  <span className="text-2xl">{m.emoji}</span>
                  <span className="text-xs font-medium">{m.label}</span>
                </button>
              ))}
            </div>

            {mood && (
              <div className="animate-in fade-in slide-in-from-bottom-4">
                <textarea 
                  placeholder="Would you like to log what's on your mind? (Optional, strictly private)"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full bg-black/20 border border-white/5 rounded-2xl p-4 text-sm text-slate-300 focus:outline-none focus:border-teal-500/50 transition mb-4 resize-none h-24"
                />
                <button 
                  onClick={handleLogMood}
                  disabled={isSubmitting}
                  className="w-full bg-teal-600 hover:bg-teal-500 text-[#061014] py-3.5 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2"
                >
                  {isSubmitting ? 'Logging...' : 'Save to Private Journal'}
                </button>
              </div>
            )}

            {/* RECENT LOGS SUMMARY */}
            {logs.length > 0 && (
              <div className="mt-8 pt-6 border-t border-white/5">
                <p className="text-xs font-medium text-slate-500 mb-4 uppercase tracking-widest">Recent Check-ins</p>
                <div className="space-y-3">
                  {logs.slice(0, 3).map(log => (
                    <div key={log._id} className="flex justify-between items-center bg-black/20 px-4 py-3 rounded-xl border border-white/5">
                      <span className="text-sm font-medium text-slate-300">{log.mood}</span>
                      <span className="text-xs text-slate-500">{new Date(log.createdAt).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COL: TOOLS & EXERCISES */}
          <div className="space-y-8">
            
            {/* ONE-TAP BREATHING TOOL */}
            <div className="bg-[#0A141A] border border-white/5 rounded-[2rem] p-8 shadow-xl text-center flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden">
              <h2 className="text-lg font-medium text-slate-200 mb-2 flex items-center gap-3 relative z-10">
                <Wind size={18} className="text-sky-400" /> 4-7-8 Breathing
              </h2>
              <p className="text-xs text-slate-400 mb-10 relative z-10">Lowers heart rate and reduces anxiety instantly.</p>

              {/* Breathing Visualizer */}
              <div className="relative w-32 h-32 flex items-center justify-center mb-8 z-10">
                <div className={`absolute inset-0 bg-sky-500/20 rounded-full ${breathePhase !== 'Idle' ? `breathe-${breathePhase.toLowerCase()}` : ''}`}></div>
                <div className="relative z-10 w-24 h-24 bg-[#0A141A] rounded-full border border-sky-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(14,165,233,0.1)]">
                  <span className="text-sky-300 font-medium tracking-wide">
                    {breathePhase}
                  </span>
                </div>
              </div>

              <button 
                onClick={startBreathingExercise}
                disabled={breathePhase !== 'Idle'}
                className="relative z-10 bg-sky-900/30 hover:bg-sky-800/40 text-sky-300 border border-sky-800/50 px-6 py-2.5 rounded-full text-xs font-bold transition disabled:opacity-50"
              >
                {breathePhase === 'Idle' ? 'Begin Exercise' : 'Focus on the circle...'}
              </button>
            </div>

            {/* CURATED RESOURCES (UI Only for now) */}
            <div className="bg-[#0A141A] border border-white/5 rounded-[2rem] p-8 shadow-xl">
              <h2 className="text-lg font-medium text-slate-200 mb-6 flex items-center gap-3">
                <BookOpen size={18} className="text-indigo-400" /> Founder Wellness Library
              </h2>
              
              <div className="space-y-4">
                <a href="#" className="block bg-black/20 hover:bg-white/5 border border-white/5 rounded-xl p-4 transition group">
                  <h3 className="text-sm font-medium text-slate-200 group-hover:text-indigo-300 transition mb-1">Decompression Post-Fundraising</h3>
                  <p className="text-xs text-slate-500">A 5-minute audio guide to releasing adrenaline after high-stress pitch meetings.</p>
                </a>
                <a href="#" className="block bg-black/20 hover:bg-white/5 border border-white/5 rounded-xl p-4 transition group">
                  <h3 className="text-sm font-medium text-slate-200 group-hover:text-indigo-300 transition mb-1">Imposter Syndrome in Tech</h3>
                  <p className="text-xs text-slate-500">Read the community discussion on overcoming feelings of inadequacy.</p>
                </a>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default WellnessCornerPage;
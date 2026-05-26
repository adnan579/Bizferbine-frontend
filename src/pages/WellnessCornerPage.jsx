// src/pages/WellnessCornerPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, HeartPulse, Wind, BookOpen, Activity, AlertTriangle, Phone } from 'lucide-react';
import { encryptData, decryptData } from '../utils/cryptoShield';
import apiClient from '../utils/apiClient';

const WellnessCornerPage = () => {
  const [logs, setLogs] = useState([]);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [compilerFeedback, setCompilerFeedback] = useState(null);
  const [restructuredNote, setRestructuredNote] = useState('');
  const [isCompiling, setIsCompiling] = useState(false);
  
  // FEATURE 1: Ecological Momentary Assessment (Aegis Protocol)
  const [exhaustion, setExhaustion] = useState(50);
  const [cynicism, setCynicism] = useState(50);
  const [inefficacy, setInefficacy] = useState(50);

  // FEATURE 2: EMDR-Lite Bilateral Protocol
  const [isEmdrActive, setIsEmdrActive] = useState(false);

  const navigate = useNavigate();

  const fetchLogs = async () => {
    try {
      const response = await apiClient.get('/wellness/logs');
      if (response.ok) {
        const data = await response.json();
        const decryptedLogs = data.map(log => ({
          ...log,
          note: decryptData(log.note)
        }));
        setLogs(decryptedLogs);
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // Calculate System Stability (100 - Average of Negative Metrics)
  const avg = (Number(exhaustion) + Number(cynicism) + Number(inefficacy)) / 3;
  const systemStabilityScore = Math.round(100 - avg);

  // Dynamic Indicator Logic
  let scoreColor = 'text-emerald-400';
  let strokeColor = 'text-emerald-500';
  let statusText = 'Status: Optimal. Full platform access granted.';

  if (systemStabilityScore < 40) {
    scoreColor = 'text-rose-500';
    strokeColor = 'text-rose-500';
    statusText = 'Status: Critical Burnout Detected. Autonomic Lockout imminent.';
  } else if (systemStabilityScore <= 70) {
    scoreColor = 'text-yellow-400';
    strokeColor = 'text-yellow-500';
    statusText = 'Status: Warning. Suggest initiating Bilateral Stimulation.';
  }

  const executeFinalSave = async () => {
    setIsSubmitting(true);
    try {
      const finalNote = compilerFeedback 
        ? `Original: ${note} | AI Diagnosis: ${compilerFeedback.distortionsDetected.join(', ')} | Reframed: ${restructuredNote}` 
        : note;

      const response = await apiClient.post('/wellness/log', {
        body: JSON.stringify({ mood: systemStabilityScore, note: encryptData(finalNote) }) // Strictly matching protocol requirement
      });
      
      if (response.ok) {
        setExhaustion(50);
        setCynicism(50);
        setInefficacy(50);
        setNote('');
        setCompilerFeedback(null);
        setRestructuredNote('');
        fetchLogs();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogMood = async () => {
    if (!note || note.trim().length < 10) return executeFinalSave();

    setIsCompiling(true);
    try {
      const response = await apiClient.post('/wellness/analyze-thought', {
        body: JSON.stringify({ note })
      });

      if (!response.ok) return executeFinalSave();

      const data = await response.json();
      if (data.bypass || !data.hasDistortion) {
        executeFinalSave();
      } else {
        setCompilerFeedback(data);
      }
    } catch (err) {
      console.error(err);
      executeFinalSave();
    } finally {
      setIsCompiling(false);
    }
  };

  // Helper to parse older legacy string logs vs new number-based metrics safely
  const getLogDisplay = (moodVal) => {
    const num = Number(moodVal);
    if (!isNaN(num)) {
      return { text: `Score: ${num}`, color: num > 70 ? 'text-emerald-400' : num >= 40 ? 'text-yellow-400' : 'text-rose-500' };
    }
    if (['Excellent', 'Good'].includes(moodVal)) return { text: moodVal, color: 'text-emerald-400' };
    if (moodVal === 'Neutral') return { text: moodVal, color: 'text-yellow-400' };
    return { text: moodVal, color: 'text-rose-500' };
  };

  return (
    <div className="min-h-screen bg-[#030509] text-gray-200 font-sans selection:bg-cyan-500/30 pb-20 relative overflow-hidden">
      
      {/* Clinical Medical Cyberpunk Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-cyan-900/10 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-rose-900/10 rounded-full blur-[150px] pointer-events-none"></div>

      {/* INLINE CSS FOR BILATERAL ORB */}
      <style>{`
        @keyframes emdr-oscillate {
          0% { left: 1rem; }
          50% { left: calc(100% - 3rem); }
          100% { left: 1rem; }
        }
      `}</style>

      {/* TOP NAV */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#030509]/80 border-b border-white/5 p-4 flex justify-between items-center px-6 md:px-12">
        <Link to="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition group">
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-mono text-xs tracking-widest uppercase">Command Center</span>
        </Link>
        
        {/* PERSISTENT CRISIS BUTTON */}
        <a href="tel:988" className="bg-rose-900/20 hover:bg-rose-900/40 text-rose-400 px-5 py-2.5 rounded-full text-xs font-bold transition flex items-center gap-2 border border-rose-800/30 shadow-[0_0_15px_rgba(225,29,72,0.1)]">
          <Phone size={14} /> Crisis Support (988)
        </a>
      </nav>

      <main className="max-w-4xl mx-auto mt-12 px-6 relative z-10">
        
        {/* HEADER */}
        <div className="text-center mb-12 relative z-10">
          <div className="w-16 h-16 mx-auto bg-cyan-900/20 border border-cyan-500/30 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
            <HeartPulse className="text-cyan-400" size={32} />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-4 uppercase">
            Aegis Protocol
          </h1>
          <p className="text-gray-400 text-sm max-w-lg mx-auto font-mono tracking-wide leading-relaxed">
            Clinical-grade autonomic nervous system regulation. Track neuro-fatigue and execute bilateral desensitization.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* FEATURE 1: ECOLOGICAL MOMENTARY ASSESSMENT */}
          <div className="bg-[#050810] border border-white/5 rounded-3xl p-8 shadow-2xl flex flex-col">
            <h2 className="text-lg font-black text-white mb-6 flex items-center gap-3">
              <Activity size={20} className="text-cyan-400" /> Aegis System Assessment
            </h2>
            
            <div className="flex flex-col md:flex-row gap-8 items-center mb-8">
              {/* Circular Indicator */}
              <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="72" cy="72" r="64" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                  <circle cx="72" cy="72" r="64" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="402" strokeDashoffset={402 - (402 * systemStabilityScore) / 100} className={`${strokeColor} transition-all duration-700 ease-out`} />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className={`text-4xl font-black ${scoreColor}`}>{systemStabilityScore}</span>
                  <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest mt-1">Stability</span>
                </div>
              </div>

              {/* Status Text Box */}
              <div className="flex-1 w-full bg-black/50 border border-white/5 rounded-xl p-4 flex flex-col justify-center">
                <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-2">Current System State:</p>
                <p className={`text-sm font-bold ${scoreColor} leading-relaxed`}>{statusText}</p>
              </div>
            </div>

            {/* Sliders */}
            <div className="space-y-6 mb-8 border-t border-white/5 pt-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest text-gray-400">
                  <label>Nervous System Exhaustion</label>
                  <span className="text-white">{exhaustion}%</span>
                </div>
                <input type="range" min="0" max="100" value={exhaustion} onChange={(e) => setExhaustion(e.target.value)} className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-rose-500" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest text-gray-400">
                  <label>Cognitive Cynicism</label>
                  <span className="text-white">{cynicism}%</span>
                </div>
                <input type="range" min="0" max="100" value={cynicism} onChange={(e) => setCynicism(e.target.value)} className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-yellow-500" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest text-gray-400">
                  <label>Professional Inefficacy</label>
                  <span className="text-white">{inefficacy}%</span>
                </div>
                <input type="range" min="0" max="100" value={inefficacy} onChange={(e) => setInefficacy(e.target.value)} className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-cyan-500" />
              </div>
            </div>

            {/* Private Journal */}
            <div className="animate-in fade-in mt-auto">
              {!compilerFeedback ? (
                <>
                  <textarea 
                    placeholder="Log encrypted clinical notes here... (Strictly Private)"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm text-gray-300 focus:outline-none focus:border-cyan-500/50 transition mb-4 resize-none h-24 font-mono"
                  />
                  <button 
                    onClick={handleLogMood}
                    disabled={isSubmitting || isCompiling}
                    className="w-full bg-cyan-600 hover:bg-cyan-500 text-black py-3.5 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(34,211,238,0.3)] disabled:opacity-50"
                  >
                    {isCompiling ? 'Compiling Analysis...' : isSubmitting ? 'Encrypting Log...' : 'Save to Private Journal'}
                  </button>
                </>
              ) : (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-4 mb-4">
                  <p className="text-sm text-gray-300 mb-3 font-mono">
                    System detects: <span className="text-yellow-400">{compilerFeedback.distortionsDetected.join(', ')}</span>
                  </p>
                  <p className="text-sm font-bold text-cyan-400 mb-4 leading-relaxed">
                    {compilerFeedback.socraticQuestion}
                  </p>
                  <textarea 
                    placeholder="Provide objective evidence to restructure this thought..."
                    value={restructuredNote}
                    onChange={(e) => setRestructuredNote(e.target.value)}
                    className="w-full bg-black/60 border border-cyan-500/30 rounded-xl p-3 text-sm text-gray-200 focus:outline-none focus:border-cyan-400 transition mb-4 resize-none h-20 font-mono"
                  />
                  <button 
                    onClick={executeFinalSave}
                    disabled={isSubmitting || !restructuredNote.trim()}
                    className="w-full bg-cyan-600 hover:bg-cyan-500 text-black py-3 rounded-xl text-sm font-bold transition flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.3)] disabled:opacity-50"
                  >
                    {isSubmitting ? 'Encrypting Log...' : 'Acknowledge & Save Restructured Log'}
                  </button>
                </div>
              )}
            </div>

            {/* RECENT LOGS SUMMARY */}
            {logs.length > 0 && (
              <div className="mt-8 pt-6 border-t border-white/5">
                <p className="text-[10px] font-bold text-gray-500 mb-4 uppercase tracking-widest font-mono">Recent Telemetry</p>
                <div className="space-y-3">
                  {logs.slice(0, 3).map(log => {
                    const display = getLogDisplay(log.mood);
                    return (
                      <div key={log._id} className="flex justify-between items-center bg-black/40 px-4 py-3 rounded-xl border border-white/5">
                        <span className={`text-sm font-bold ${display.color}`}>{display.text}</span>
                        <span className="text-[10px] text-gray-500 font-mono">{new Date(log.createdAt).toLocaleDateString()}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COL: TOOLS & EXERCISES */}
          <div className="space-y-8">
            
            {/* FEATURE 2: EMDR-LITE BILATERAL PROTOCOL */}
            <div className="bg-[#050810] border border-white/5 rounded-3xl p-8 shadow-2xl text-center flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden">
              <h2 className="text-lg font-black text-white mb-2 flex items-center justify-center gap-3 relative z-10 tracking-tight">
                <Wind size={20} className="text-cyan-400" /> Bilateral Desensitization
              </h2>
              <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest mb-10 relative z-10">EMDR-Lite Protocol: Follow the orb to recalibrate neural processing.</p>

              {/* Glowing Orb Container */}
              <div className="relative w-full h-20 bg-[#020408] border border-cyan-500/20 rounded-full overflow-hidden shadow-inner mb-8 z-10 flex items-center">
                <div 
                  className={`absolute w-8 h-8 rounded-full bg-cyan-400 shadow-[0_0_30px_rgba(34,211,238,1)] transition-all ease-out`}
                  style={
                    isEmdrActive 
                      ? { top: '50%', transform: 'translateY(-50%)', animation: 'emdr-oscillate 3s ease-in-out infinite' } 
                      : { top: '50%', left: '50%', transform: 'translate(-50%, -50%)', transition: 'all 0.5s ease' }
                  }
                ></div>
              </div>

              <button 
                onClick={() => setIsEmdrActive(!isEmdrActive)}
                className={`relative z-10 px-8 py-3 rounded-full text-xs font-bold transition flex items-center justify-center gap-2 w-full max-w-xs mx-auto ${isEmdrActive ? 'bg-rose-600/20 hover:bg-rose-600/40 text-rose-400 border border-rose-500/30' : 'bg-cyan-600 hover:bg-cyan-500 text-black shadow-[0_0_20px_rgba(34,211,238,0.4)]'}`}
              >
                {isEmdrActive ? <><AlertTriangle size={16}/> Halt Protocol</> : <><Activity size={16}/> Initiate Protocol</>}
              </button>
            </div>

            {/* CURATED RESOURCES */}
            <div className="bg-[#050810] border border-white/5 rounded-3xl p-8 shadow-2xl">
              <h2 className="text-lg font-black text-white mb-6 flex items-center gap-3">
                <BookOpen size={20} className="text-indigo-400" /> Clinical Data Library
              </h2>
              
              <div className="space-y-4">
                <a href="#" className="block bg-black/40 hover:bg-white/5 border border-white/5 rounded-2xl p-4 transition group">
                  <h3 className="text-sm font-bold text-gray-200 group-hover:text-indigo-400 transition mb-1">Decompression Protocol</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">Regulate autonomic nervous system spikes after high-stakes negotiations.</p>
                </a>
                <a href="#" className="block bg-black/40 hover:bg-white/5 border border-white/5 rounded-2xl p-4 transition group">
                  <h3 className="text-sm font-bold text-gray-200 group-hover:text-indigo-400 transition mb-1">Imposter Syndrome Matrix</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">Cognitive reframing techniques for founders experiencing severe self-doubt.</p>
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
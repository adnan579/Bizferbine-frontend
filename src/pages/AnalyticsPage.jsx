// src/pages/AnalyticsPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Activity, Eye, MousePointerClick, Users, TrendingUp, ShieldCheck, Zap, Target, Lock } from 'lucide-react';

const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [reputation, setReputation] = useState({ score: 50, badges: [] });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (!token || !userStr) {
      navigate('/login');
      return;
    }

    const userId = JSON.parse(userStr).id;

    Promise.all([
      fetch('https://bizferbine-backend.onrender.com/api/analytics/summary', {
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(res => res.json()),
      fetch(`https://bizferbine-backend.onrender.com/api/profile/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(res => res.json())
    ])
    .then(([analyticsData, profileData]) => {
      setAnalytics(analyticsData.summary || { weeklyProfileViews: 0, projectClicks: 0, mentorshipRequests: 0 });
      if (profileData.reputation) setReputation(profileData.reputation);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [navigate]);

  if (loading) return <div className="min-h-screen bg-[#050810] text-blue-400 flex items-center justify-center font-mono animate-pulse uppercase tracking-widest">Compiling_Intelligence...</div>;

  const views = analytics?.weeklyProfileViews || 0;
  const clicks = analytics?.projectClicks || 0;
  const mentors = analytics?.mentorshipRequests || 0;

  return (
    <div className="min-h-screen bg-[#050810] text-gray-200 font-sans selection:bg-blue-500/30 relative overflow-hidden pb-20">
      
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none"></div>

      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#050810]/70 border-b border-white/5 p-4 flex justify-between items-center">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition group">
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-mono text-xs tracking-widest uppercase">Back to Profile</span>
        </button>
        <div className="flex items-center gap-2 text-emerald-400 font-mono text-[10px] tracking-widest uppercase">
          <Lock size={12} /> Encrypted Private View
        </div>
      </nav>

      <main className="max-w-6xl mx-auto mt-8 md:mt-12 px-6 relative z-10">
        
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight flex items-center justify-center md:justify-start gap-4 mb-3">
            <Activity className="text-blue-500" size={36} /> Professional <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Intelligence</span>
          </h1>
          <p className="text-gray-400 text-sm max-w-xl mx-auto md:mx-0">Track your network gravity, portfolio impact, and professional reputation score in real-time.</p>
        </div>

        {/* SECTION 1: HERO METRICS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#0a0f1c] border border-white/10 rounded-3xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 blur-[30px] group-hover:bg-blue-500/20 transition duration-500"></div>
            <div className="flex items-center gap-3 mb-4 text-blue-400">
              <Eye size={20} /> <span className="font-mono text-xs uppercase tracking-widest">Network Reach</span>
            </div>
            <div className="text-5xl font-black text-white mb-2">{views}</div>
            <p className="text-xs text-gray-500">Unique profile views in the last 7 days.</p>
          </div>

          <div className="bg-[#0a0f1c] border border-white/10 rounded-3xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 blur-[30px] group-hover:bg-purple-500/20 transition duration-500"></div>
            <div className="flex items-center gap-3 mb-4 text-purple-400">
              <MousePointerClick size={20} /> <span className="font-mono text-xs uppercase tracking-widest">Portfolio Impact</span>
            </div>
            <div className="text-5xl font-black text-white mb-2">{clicks}</div>
            <p className="text-xs text-gray-500">Clicks to your Live Demos, GitHub, and Website.</p>
          </div>

          <div className="bg-[#0a0f1c] border border-white/10 rounded-3xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 blur-[30px] group-hover:bg-emerald-500/20 transition duration-500"></div>
            <div className="flex items-center gap-3 mb-4 text-emerald-400">
              <Users size={20} /> <span className="font-mono text-xs uppercase tracking-widest">Mentorship Gravity</span>
            </div>
            <div className="text-5xl font-black text-white mb-2">{mentors}</div>
            <p className="text-xs text-gray-500">Inbound requests from the ecosystem.</p>
          </div>
        </div>

        {/* SECTION 2: REPUTATION ENGINE VISUALIZATION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          <div className="bg-gradient-to-br from-[#0a0f1c] to-[#050810] border border-white/10 rounded-3xl p-8 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><ShieldCheck className="text-blue-400" /> The Reputation Engine</h2>
            
            <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
              <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90">
                     <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                     <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="351" strokeDashoffset={351 - (351 * reputation.score) / 100} className="text-blue-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.8)] transition-all duration-1000" />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-3xl font-black text-white">{reputation.score}</span>
                    <span className="text-[8px] font-mono text-gray-400 uppercase tracking-widest">Score</span>
                  </div>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-300 mb-4 leading-relaxed">Your Trust Score evaluates your reliability, mentorship completion, peer endorsements, and trade review sentiment. Scores above 80 unlock elite network visibility.</p>
                <div className="flex flex-wrap gap-2">
                  {reputation.badges.length > 0 ? reputation.badges.map(badge => (
                    <span key={badge} className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] font-bold uppercase tracking-widest rounded-lg">{badge}</span>
                  )) : <span className="text-xs text-gray-600 font-mono">No elite badges unlocked yet.</span>}
                </div>
              </div>
            </div>

            {/* Visual Breakdown Bars */}
            <div className="space-y-5 border-t border-white/5 pt-6">
              <div>
                <div className="flex justify-between text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider"><span>Execution Proof</span> <span className="text-white">High</span></div>
                <div className="w-full bg-white/5 rounded-full h-1.5"><div className="bg-emerald-500 h-1.5 rounded-full w-[85%]"></div></div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider"><span>Network Trust</span> <span className="text-white">Growing</span></div>
                <div className="w-full bg-white/5 rounded-full h-1.5"><div className="bg-blue-500 h-1.5 rounded-full w-[60%]"></div></div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-[#0a0f1c] border border-white/10 rounded-3xl p-6">
              <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2"><Zap className="text-yellow-400" size={16} /> AI Growth Intelligence</h3>
              <p className="text-xs text-gray-400 leading-relaxed mb-4">Our systems have analyzed your recent activity. Here is what is driving your network gravity:</p>
              
              <ul className="space-y-3">
                <li className="flex gap-3 text-sm text-gray-300 bg-white/5 p-4 rounded-xl border border-white/5">
                  <span className="text-emerald-400">●</span> Profiles with 2+ Case Studies see a 40% increase in outbound portfolio clicks. You are highly optimized.
                </li>
                <li className="flex gap-3 text-sm text-gray-300 bg-white/5 p-4 rounded-xl border border-white/5">
                  <span className="text-blue-400">●</span> Responding to Mentorship requests within 24 hours heavily impacts your Reputation Index.
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-indigo-900/40 to-blue-900/20 border border-indigo-500/30 rounded-3xl p-6 flex items-center justify-between group cursor-pointer hover:border-indigo-500/60 transition">
              <div>
                <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2"><Target size={16} className="text-indigo-400" /> Next Milestone</h3>
                <p className="text-xs text-indigo-200/70">Reach 5 Peer Endorsements to unlock the "Highly Endorsed" badge.</p>
              </div>
              <ChevronLeft size={20} className="text-indigo-400 rotate-180 group-hover:translate-x-1 transition" />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default AnalyticsPage;
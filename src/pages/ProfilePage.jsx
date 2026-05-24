// src/pages/ProfilePage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { MapPin, Link as LinkIcon, Code, Users, Briefcase, Award, Zap, ChevronLeft, ExternalLink, Trash2, ThumbsUp, MessageSquare, UserPlus, Handshake, Star, Settings, Network, ShieldCheck, Activity, Download, CheckCircle2, ArrowRightLeft, Play, X, Terminal, ArrowRight, Bot, Send, Loader2 } from 'lucide-react';
import EditProfileModal from './EditProfileModal';
import AddPortfolioModal from './AddPortfolioModal';
import ForceGraph3D from 'react-force-graph-3d';

// --- SAFE IMAGE LOADER FOR CLOUDINARY ---
const getImageUrl = (path) => {
  if (!path) return '';
  return path.startsWith('http') ? path : `https://bizferbine-backend.onrender.com/${path}`;
};

const ProfilePage = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(''); 
  
  const [heatmapData, setHeatmapData] = useState([]);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false); // NEW: Cmd+K Engine
  const [commandInput, setCommandInput] = useState(''); // NEW: Cmd

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPortfolioOpen, setIsPortfolioOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false); // NEW: Video Node State
  
  // NEW: Synthetic Node State
  const [isSyntheticChatOpen, setIsSyntheticChatOpen] = useState(false);
  const [syntheticInput, setSyntheticInput] = useState('');
  const [syntheticChatLog, setSyntheticChatLog] = useState([]);
  const [isSyntheticLoading, setIsSyntheticLoading] = useState(false);

  const navigate = useNavigate();
  const { userId } = useParams(); 
  
  let loggedInUser = null;
  try {
    const userStr = localStorage.getItem('user');
    if (userStr && userStr !== "undefined") loggedInUser = JSON.parse(userStr);
  } catch (err) { console.error(err); }

  const targetProfileId = userId || loggedInUser?.id;
  const isOwnProfile = targetProfileId === loggedInUser?.id;

  const fetchProfile = async () => {
    try {
      const response = await fetch(`https://bizferbine-backend.onrender.com/api/profile/${targetProfileId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      if (response.ok) setProfileData(data);
      else setError(data.message || 'Failed to load profile.');
      
      // Phase 2: Fetch Telemetry Heatmap Data
      const hmRes = await fetch(`https://bizferbine-backend.onrender.com/api/profile/${targetProfileId}/heatmap`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }});
      if (hmRes.ok) setHeatmapData(await hmRes.json());
      
    } catch (err) { setError('Server connection error.'); } 
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (!loggedInUser?.id) navigate('/login');
    else fetchProfile();
  }, [targetProfileId, navigate]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleFollowToggle = async () => {
    try {
      const res = await fetch(`https://bizferbine-backend.onrender.com/api/network/follow/${targetProfileId}`, {
        method: 'POST', headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) fetchProfile(); 
    } catch (err) { console.error('Follow error', err); }
  };

  const handleConnectRequest = async () => {
    try {
      const res = await fetch(`https://bizferbine-backend.onrender.com/api/network/connect/${targetProfileId}`, {
        method: 'POST', headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      alert(data.message); 
    } catch (err) { console.error('Connect error', err); }
  };

  const trackOutboundClick = (eventType, metadata = {}) => {
    if (isOwnProfile) return; 
    fetch('https://bizferbine-backend.onrender.com/api/analytics/track', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` 
      },
      body: JSON.stringify({ targetUser: targetProfileId, eventType, metadata })
    }).catch(err => console.error('Analytics ping failed', err)); 
  };

  const handleSyntheticSubmit = async (e) => {
    e.preventDefault();
    if(!syntheticInput.trim()) return;

    const newLog = [...syntheticChatLog, { sender: 'user', text: syntheticInput }];
    setSyntheticChatLog(newLog);
    setSyntheticInput('');
    setIsSyntheticLoading(true);

    try {
      const res = await fetch(`https://bizferbine-backend.onrender.com/api/profile/${targetProfileId}/synthetic-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ prompt: syntheticInput })
      });
      const data = await res.json();
      setSyntheticChatLog([...newLog, { sender: 'bot', text: data.reply || data.message }]);
    } catch(err) {
      setSyntheticChatLog([...newLog, { sender: 'bot', text: "Connection to Synthetic Node severed." }]);
    } finally {
      setIsSyntheticLoading(false);
    }
  };

  const handleDeletePortfolio = async (portfolioId) => {
    if (!window.confirm('Are you sure you want to delete this case study?')) return;
    try {
      const response = await fetch(`https://bizferbine-backend.onrender.com/api/profile/portfolio/${portfolioId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setProfileData(prev => ({ ...prev, profile: { ...prev.profile, portfolio: data.portfolio } }));
      }
    } catch (err) { console.error(err); }
  };

  const handleDeleteInsight = async (insightId) => {
    if (!window.confirm('Are you sure you want to delete this insight?')) return;
    try {
      const response = await fetch(`https://bizferbine-backend.onrender.com/api/insights/${insightId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const updatedFeed = profileData.thoughtLeadershipFeed.filter(insight => insight._id !== insightId);
        setProfileData(prev => ({ ...prev, thoughtLeadershipFeed: updatedFeed }));
      }
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="min-h-screen bg-[#050810] text-blue-400 flex items-center justify-center font-mono animate-pulse uppercase tracking-widest">Fetching_Network_Node...</div>;

  const profile = profileData?.profile || {};
  const networkPulse = profileData?.networkPulse || { followersCount: 0, followingCount: 0 };
  const reputation = profileData?.reputation || { score: 50, badges: [] };
  const thoughtLeadershipFeed = profileData?.thoughtLeadershipFeed || [];
  const verifiedExecution = profileData?.verifiedExecution || { eventsHosted: 0, bartersCompleted: 0, mentorshipsCompleted: 0 };
  const mutualConnections = profileData?.mutualConnections || [];
  const isFollowing = profile.followers?.some(id => id === loggedInUser.id);
  const staminaStatus = profileData?.staminaStatus || 'Stable';
  const escrowTVL = profileData?.escrowTVL || 0;

  // PHASE 1: PROOF-OF-WORK SKILL VERIFICATION
  const verifiedSkills = new Set(profileData?.verifiedSkills || []);

  // PHASE 2: TELEMETRY HEATMAP (NATIVE GENERATION)
  // Creates a clean 90-day array to render the exact GitHub style squares safely
  const last90Days = Array.from({length: 90}, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (89 - i));
    return d.toISOString().split('T')[0];
  });

  // PHASE 4: PDF EXPORT TRIGGER
  const handleExportPDF = () => {
    window.print();
  };

  // PHASE 3: 3D CONSTELLATION MAP DATA
  const constellationData = {
    nodes: [
      { id: profile?._id || 'target', name: profile?.name || 'Unknown User' },
      ...mutualConnections.map(user => ({ id: user._id, name: user.name }))
    ],
    links: mutualConnections.map(user => ({ source: profile?._id || 'target', target: user._id }))
  };

  return (
    <div className="min-h-screen bg-[#050810] text-gray-200 font-sans selection:bg-blue-500/30 pb-20 print:bg-white print:text-black print:pb-0">

      {/* PHASE 3: THE ASYNCHRONOUS ELEVATOR PITCH MODAL */}
      {isVideoOpen && profile?.pitchVideoUrl && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-[#0a0f1c] border border-purple-500/30 rounded-3xl overflow-hidden relative shadow-[0_0_50px_rgba(147,51,234,0.3)] animate-in zoom-in-95">
            <button onClick={() => setIsVideoOpen(false)} className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black p-2 rounded-full text-white transition"><X size={20}/></button>
            <video src={getImageUrl(profile.pitchVideoUrl)} controls autoPlay muted playsInline className="w-full h-full object-cover max-h-[70vh] block" />
            <div className="p-4 bg-[#0a0f1c] text-center border-t border-purple-500/20"><p className="text-xs font-bold text-purple-400 uppercase tracking-widest">Asynchronous Protocol Active</p></div>
          </div>
        </div>
      )}
      
      {/* PHASE 5: SYNTHETIC NODE CHAT MODAL */}
      {isSyntheticChatOpen && (
        <div className="fixed inset-0 z-[150] flex justify-center items-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in">
          <div className="w-full max-w-lg bg-[#0a0f1c] border border-cyan-500/30 rounded-3xl shadow-[0_0_50px_rgba(6,182,212,0.2)] p-6 md:p-8 flex flex-col h-[60vh] max-h-[80vh] animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-4 shrink-0">
              <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                <Bot className="text-cyan-400" /> Synthetic Node: {profile?.name?.split(' ')[0] || 'Unknown'}
              </h2>
              <button onClick={() => setIsSyntheticChatOpen(false)} className="text-gray-400 hover:text-white"><X size={20}/></button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
              {syntheticChatLog.length === 0 ? (
                <div className="text-center text-gray-500 text-xs font-mono uppercase tracking-widest mt-10">
                  Connection established.<br/>Ask about my experience, skills, or portfolio.
                </div>
              ) : (
                syntheticChatLog.map((msg, i) => (
                  <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.sender === 'user' ? 'bg-cyan-600 text-black rounded-br-sm' : 'bg-white/10 text-gray-200 border border-white/5 rounded-bl-sm'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))
              )}
              {isSyntheticLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] p-3 rounded-2xl text-sm bg-white/10 text-gray-200 border border-white/5 rounded-bl-sm flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin" /> Processing...
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSyntheticSubmit} className="flex gap-2 shrink-0 border-t border-white/5 pt-4">
              <input type="text" required placeholder="Query this node..." value={syntheticInput} onChange={(e) => setSyntheticInput(e.target.value)} disabled={isSyntheticLoading} className="flex-1 bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition disabled:opacity-50" />
              <button disabled={isSyntheticLoading} type="submit" className="bg-cyan-600 hover:bg-cyan-500 text-black p-3 rounded-xl flex items-center justify-center transition shadow-[0_0_15px_rgba(6,182,212,0.4)] disabled:opacity-50">
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* PHASE 4: CMD+K COMMAND PALETTE */}
      {isCommandPaletteOpen && (
        <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[20vh] bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-2xl bg-[#050810] border border-cyan-500/30 rounded-2xl shadow-[0_0_50px_rgba(34,211,238,0.15)] overflow-hidden">
            <div className="flex items-center px-4 py-3 border-b border-white/10 bg-black/50">
              <Terminal size={18} className="text-cyan-400 mr-3" />
              <input 
                autoFocus
                type="text" 
                placeholder="Type a command... (e.g., /propose-deal, /request-barter, /ping)" 
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                className="flex-1 bg-transparent border-none text-white focus:outline-none font-mono text-sm placeholder-gray-600"
              />
              <button onClick={() => setIsCommandPaletteOpen(false)} className="text-[10px] font-mono bg-white/10 px-2 py-1 rounded text-gray-400">ESC</button>
            </div>
            {commandInput && (
              <div className="p-2 bg-black/80">
                <button 
                  onClick={() => {
                    const cmd = commandInput.toLowerCase();
                    if (cmd.includes('/propose-deal')) navigate('/deals');
                    else if (cmd.includes('/request-barter')) navigate('/skill-exchange');
                    else if (cmd.includes('/ping')) navigate('/messages');
                    setIsCommandPaletteOpen(false);
                    setCommandInput('');
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-cyan-900/30 text-sm text-cyan-300 font-mono rounded-xl transition flex items-center gap-2"
                >
                  <ArrowRight size={14}/> Execute: <span className="text-white">{commandInput}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {isOwnProfile && (
        <>
          <EditProfileModal profile={profile} isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} onUpdate={(upd) => setProfileData({ ...profileData, profile: upd })} />
          <AddPortfolioModal isOpen={isPortfolioOpen} onClose={() => setIsPortfolioOpen(false)} onUpdate={(upd) => setProfileData({ ...profileData, profile: { ...profile, portfolio: upd } })} />
        </>
      )}

      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#050810]/70 border-b border-white/5 p-4 flex justify-between items-center print:hidden">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition group">
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-mono text-xs tracking-widest uppercase">Go Back</span>
        </button>
      </nav>

      <header className="relative max-w-5xl mx-auto mt-4 md:mt-6 rounded-3xl overflow-visible border border-white/10 bg-[#0a0f1c] shadow-[0_0_40px_rgba(37,99,235,0.1)] mx-4 md:mx-auto print:border-black/10 print:shadow-none print:bg-white">
        
        {isOwnProfile && (
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2 md:gap-3 print:hidden">
            {/* PDF EXPORT BUTTON */}
            <button onClick={handleExportPDF} className="p-2 md:p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-full transition shadow-[0_0_15px_rgba(37,99,235,0.4)]" title="Export PDF Pitch Deck">
              <Download size={20} />
            </button>

            {/* SYNTHETIC NODE TRIGGER */}
            <button onClick={() => setIsSyntheticChatOpen(true)} className="p-2 md:p-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-full transition shadow-[0_0_15px_rgba(6,182,212,0.4)]" title="Chat with Synthetic Node">
              <Bot size={20} />
            </button>

            <Link to="/network" className="p-2 md:p-2.5 bg-black/50 hover:bg-black/80 text-white rounded-full backdrop-blur-md transition border border-white/10 shadow-lg" title="Network Core">
              <Network size={20} />
            </Link>

            <div className="relative">
              <button onClick={() => setIsSettingsOpen(!isSettingsOpen)} className={`p-2 md:p-2.5 rounded-full backdrop-blur-md transition border shadow-lg ${isSettingsOpen ? 'bg-blue-600 border-blue-500 text-white' : 'bg-black/50 hover:bg-black/80 border-white/10 text-white'}`}>
                <Settings size={20} className={isSettingsOpen ? 'animate-spin-slow' : ''} />
              </button>
              {isSettingsOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-[#0a0f1c]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in z-50">
                  <button onClick={() => { setIsEditOpen(true); setIsSettingsOpen(false); }} className="w-full text-left px-5 py-3 text-sm font-bold text-gray-300 hover:bg-white/5 hover:text-white transition">Edit Parameters</button>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="h-40 md:h-64 w-full bg-gradient-to-r from-blue-900 to-indigo-900 relative rounded-t-3xl overflow-hidden print:h-32">
          {/* IMPLEMENTED CLOUDINARY SAFE LOADER */}
          {profile?.profileBannerUrl && <img src={getImageUrl(profile.profileBannerUrl)} alt="Banner" className="w-full h-full object-cover opacity-60" />}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1c] to-transparent print:hidden"></div>
        </div>

        <div className="px-5 md:px-8 pb-6 md:pb-8 relative -mt-16 md:-mt-20 flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 text-center md:text-left">
          
          <div className={`w-28 h-28 md:w-32 md:h-32 rounded-2xl bg-[#050810] p-1 z-10 shrink-0 relative overflow-hidden transition-all duration-500 ${staminaStatus === 'Peak' ? 'border-4 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.6)]' : staminaStatus === 'Burnout' ? 'border-4 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.6)]' : 'border-2 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)]'}`}>
             {/* IMPLEMENTED CLOUDINARY SAFE LOADER */}
             {profile?.profilePictureUrl ? (
               <img src={getImageUrl(profile.profilePictureUrl)} alt="Profile" className="w-full h-full object-cover rounded-xl" />
             ) : (
               <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-3xl md:text-4xl font-black text-white">
                 {profile?.name ? profile.name.charAt(0).toUpperCase() : 'U'}
               </div>
             )}

             {/* THE VIDEO NODE TRIGGER ORB */}
             {profile?.pitchVideoUrl && (
               <button onClick={() => setIsVideoOpen(true)} className="absolute bottom-[-10px] right-[-10px] w-10 h-10 bg-purple-600 hover:bg-purple-500 rounded-full border-2 border-[#0a0f1c] flex items-center justify-center animate-pulse shadow-[0_0_20px_rgba(147,51,234,0.8)] z-20 print:hidden transition">
                 <Play size={16} className="text-white fill-white ml-0.5" />
               </button>
             )}
          </div>

          <div className="flex-1 mb-2 z-10 mt-2 w-full print:text-black">
            
            {/* PHASE 1: ACTIVE DIRECTIVE BEACON */}
            {profile?.activeDirective && profile.activeDirective.intent !== 'None' && (
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-500/10 border border-yellow-500/40 text-yellow-400 rounded-full text-[10px] font-bold uppercase tracking-widest mb-3 shadow-[0_0_15px_rgba(234,179,8,0.2)] print:bg-yellow-100 print:text-yellow-800 print:border-yellow-300">
                <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse print:animate-none"></span>
                {profile.activeDirective.intent}{profile.activeDirective.text ? `: ${profile.activeDirective.text}` : ''}
              </div>
            )}

            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
               <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight print:text-black">{profile?.name || 'Unknown User'}</h1>
               <div className="flex flex-wrap justify-center md:justify-start gap-2">
                 {reputation.badges.map(badge => (
                   <span key={badge} className="px-2 py-1 md:px-2.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[9px] md:text-[10px] font-bold uppercase tracking-widest rounded-lg flex items-center gap-1">
                     <ShieldCheck size={12} /> {badge}
                   </span>
                 ))}
               </div>
            </div>

            {profile?.username && <p className="text-blue-500 font-mono text-sm tracking-widest mb-1 mt-1 print:text-blue-700">@{profile.username}</p>}
            <p className="text-gray-400 font-mono text-[9px] md:text-[10px] tracking-widest uppercase mt-2 mb-2 print:text-gray-600">{profile?.role || 'Network User'} • {profile?.industry || 'General'}</p>
            <p className="text-gray-300 text-sm md:text-lg max-w-2xl px-2 md:px-0 print:text-gray-800">{profile?.headline || 'Establishing system branding...'}</p>
            
            {/* PHASE 3: THE MUTUAL TRUST GRAPH (3D CONSTELLATION MAP) */}
            {!isOwnProfile && mutualConnections.length > 0 && (
              <div className="w-full md:w-80 h-64 mt-5 mb-2 print:hidden rounded-2xl border border-cyan-500/20 bg-[#050810] overflow-hidden relative shadow-[0_0_20px_rgba(34,211,238,0.15)] cursor-move">
                <div className="absolute top-3 left-3 z-10 text-[9px] font-mono text-cyan-400 uppercase tracking-widest bg-cyan-900/30 border border-cyan-500/30 px-2 py-1 rounded shadow-lg pointer-events-none flex items-center gap-1">
                  <Network size={10} className="text-cyan-400" /> Constellation ({mutualConnections.length} Mutual)
                </div>
                <ForceGraph3D
                  graphData={constellationData}
                  backgroundColor="#050810"
                  nodeLabel="name"
                  nodeColor={() => '#22d3ee'}
                  linkColor={() => '#60a5fa'}
                  linkOpacity={0.6}
                  linkWidth={1.5}
                  nodeRelSize={5}
                  showNavInfo={false}
                  width={320}
                  height={256}
                />
              </div>
            )}

            {!isOwnProfile && (
              <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-2 md:gap-3 mt-5 w-full print:hidden">
                
                {/* PHASE 1: DIRECT MODULE GATEWAYS */}
                {profile?.role === 'Mentor' && (
                  <Link to={`/mentorship`} className="w-full md:w-auto flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition shadow-[0_0_15px_rgba(147,51,234,0.4)]">
                    <Award size={16} /> Request Mentorship
                  </Link>
                )}
                {profile?.role === 'Entrepreneur' && (
                  <Link to={`/deals`} className="w-full md:w-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                    <Handshake size={16} /> Propose Deal
                  </Link>
                )}
                
                <button onClick={handleFollowToggle} className={`w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition ${isFollowing ? 'bg-white/10 text-white hover:bg-red-500/20 hover:text-red-400 border border-white/10' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]'}`}>
                  <UserPlus size={16} /> {isFollowing ? 'Unfollow' : 'Follow Node'}
                </button>
                <button onClick={handleConnectRequest} className="w-full md:w-auto flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition">
                  <Handshake size={16} /> Connect
                </button>
                <Link to={`/messages`} className="w-full md:w-auto flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white p-2.5 rounded-xl transition">
                  <MessageSquare size={16} /> <span className="md:hidden text-xs font-bold">Message</span>
                </Link>
              </div>
            )}
          </div>

          <div className="mt-4 md:mt-0 z-10 shrink-0 flex flex-wrap justify-center gap-4 w-full md:w-auto">
            
            <div className="bg-black/50 border border-emerald-500/30 p-4 rounded-2xl flex flex-col items-center justify-center min-w-[120px] shadow-[0_0_15px_rgba(16,185,129,0.1)]">
               <div className="text-[10px] font-mono text-emerald-500/70 uppercase tracking-widest mb-2">Escrow TVL</div>
               <div className="text-xl font-black text-emerald-400 font-mono tracking-wider">${escrowTVL.toLocaleString()}</div>
               <div className="text-[9px] text-emerald-500/50 uppercase tracking-widest mt-2 flex items-center gap-1"><ShieldCheck size={10} className="text-emerald-400" /> Secured</div>
            </div>

            <div className="bg-black/50 border border-white/10 p-4 rounded-2xl flex flex-col items-center min-w-[120px]">
               <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2">Reputation Index</div>
               <div className="relative w-16 h-16 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                     <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/5 print:text-gray-200" />
                     <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray="175" strokeDashoffset={175 - (175 * reputation.score) / 100} className="text-blue-500 transition-all duration-1000" />
                  </svg>
                  <span className="absolute text-xl font-black text-white print:text-black">{reputation.score}</span>
               </div>
               <div className="text-[9px] text-blue-400 uppercase tracking-widest mt-2">Global Standing</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 border-t border-white/5 bg-[#050810]/50 divide-x divide-white/5 rounded-b-3xl print:border-black/10 print:divide-black/10 print:bg-gray-50">
          <div className="p-3 md:p-4 text-center">
            <div className="text-xl md:text-2xl font-black text-white print:text-black">{networkPulse?.followersCount || 0}</div>
            <div className="text-[9px] md:text-[10px] text-gray-500 font-mono uppercase tracking-widest mt-1">Followers</div>
          </div>
          <div className="p-3 md:p-4 text-center">
            <div className="text-xl md:text-2xl font-black text-white print:text-black">{networkPulse?.followingCount || 0}</div>
            <div className="text-[9px] md:text-[10px] text-gray-500 font-mono uppercase tracking-widest mt-1">Following</div>
          </div>
          <div className="p-3 md:p-4 text-center">
            <div className="text-xl md:text-2xl font-black text-white print:text-black">{profile?.testimonials?.length || 0}</div>
            <div className="text-[9px] md:text-[10px] text-gray-500 font-mono uppercase tracking-widest mt-1">Endorsements</div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto mt-6 md:mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 px-4 md:px-0">
        <div className="space-y-6 md:space-y-8">
          
          <section className="bg-[#0a0f1c] border border-white/10 rounded-3xl p-5 md:p-6 flex flex-col">
            <h2 className="text-white font-bold mb-4 flex items-center gap-2 uppercase tracking-widest text-[10px] font-mono text-gray-500">
              <Briefcase size={14} className="text-blue-400" /> Identity Bio
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed">{profile?.bio || 'Initializing bio vector...'}</p>
            {profile?.location && (
              <div className="flex items-center gap-2 mt-4 text-sm text-gray-400 font-mono">
                <MapPin size={14} className="text-purple-400 shrink-0" /> {profile.location}
              </div>
            )}
            
            {isOwnProfile && (
              <div className="mt-6 pt-6 border-t border-white/5">
                <Link to="/analytics" className="w-full bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 text-blue-400 py-3 rounded-xl text-xs font-bold transition flex justify-center items-center gap-2 shadow-[0_0_15px_rgba(37,99,235,0.1)] hover:shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                  <Activity size={16} /> View Performance Analytics
                </Link>
              </div>
            )}
          </section>

          {/* PHASE 2: IMMUTABLE PROOF OF ECOSYSTEM */}
          <section className="bg-[#0a0f1c] border border-white/10 rounded-3xl p-5 md:p-6 print:border-black/10 print:bg-white">
            <h2 className="text-white font-bold mb-4 flex items-center gap-2 uppercase tracking-widest text-[10px] font-mono text-gray-500 print:text-black">
              <ShieldCheck size={14} className="text-emerald-400" /> Verified Network Telemetry
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400 flex items-center gap-2"><ArrowRightLeft size={14} className="text-cyan-400"/> Barters Completed</span>
                <span className="font-bold text-white print:text-black">{verifiedExecution.bartersCompleted}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400 flex items-center gap-2"><Award size={14} className="text-purple-400"/> Mentorships Completed</span>
                <span className="font-bold text-white print:text-black">{verifiedExecution.mentorshipsCompleted}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400 flex items-center gap-2"><MapPin size={14} className="text-yellow-400"/> Events Hosted</span>
                <span className="font-bold text-white print:text-black">{verifiedExecution.eventsHosted}</span>
              </div>
            </div>
          </section>

          {/* PHASE 2: ECOSYSTEM TELEMETRY HEATMAP */}
          <section className="bg-[#0a0f1c] border border-white/10 rounded-3xl p-5 md:p-6 print:hidden">
            <h2 className="text-white font-bold mb-4 flex items-center gap-2 uppercase tracking-widest text-[10px] font-mono text-gray-500">
              <Activity size={14} className="text-cyan-400" /> Platform Telemetry (90 Days)
            </h2>
            <div className="flex gap-1 flex-wrap justify-start">
              {last90Days.map((date, i) => {
                 const count = heatmapData.find(d => d.date === date)?.count || 0;
                 const color = count > 3 ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]' : 
                               count > 1 ? 'bg-cyan-600' : 
                               count > 0 ? 'bg-cyan-900/50 border border-cyan-700/50' : 
                               'bg-white/5 border border-white/5';
                 return (
                   <div 
                     key={date} 
                     title={`${count} executions on ${date}`} 
                     className={`w-3.5 h-3.5 md:w-4 md:h-4 rounded-sm transition-colors hover:border-white ${color}`}
                   ></div>
                 );
              })}
            </div>
          </section>

          <section className="bg-[#0a0f1c] border border-white/10 rounded-3xl p-5 md:p-6 print:border-black/10 print:bg-white">
            <h2 className="text-white font-bold mb-4 flex items-center gap-2 uppercase tracking-widest text-[10px] font-mono text-gray-500 print:text-black">
              <Zap size={14} className="text-yellow-400" /> Skill Matrix
            </h2>
            <div className="flex flex-wrap gap-2">
              {profile?.skills?.length > 0 ? profile.skills.map((skill, index) => {
                const isVerified = verifiedSkills.has(skill); // Phase 1 Check
                return (
                  <span key={index} className={`px-3 py-1.5 border rounded-lg text-[10px] font-mono uppercase tracking-tighter flex items-center gap-1.5 ${isVerified ? 'bg-yellow-500/10 border-yellow-500/40 text-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.2)]' : 'bg-black border-white/10 text-gray-300'}`}>
                    {isVerified && <ShieldCheck size={12} className="text-yellow-400" />}
                    {skill}
                  </span>
                );
              }) : <span className="text-xs text-gray-600">No skills identified.</span>}
            </div>
          </section>

          <section className="bg-[#0a0f1c] border border-white/10 rounded-3xl p-5 md:p-6 print:border-black/10 print:bg-white">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-white font-bold flex items-center gap-2 uppercase tracking-widest text-[10px] font-mono text-gray-500 print:text-black">
                <Star size={14} className="text-yellow-400 fill-yellow-400/20" /> Trade Reviews
              </h2>
              {profile?.barterReviews?.length > 0 && (
                <div className="flex items-center gap-1 text-sm font-bold text-yellow-400 bg-yellow-500/10 px-2 py-1 rounded-lg border border-yellow-500/20">
                  <Star size={14} className="fill-yellow-400" />
                  {(profile.barterReviews.reduce((acc, curr) => acc + curr.rating, 0) / profile.barterReviews.length).toFixed(1)}
                </div>
              )}
            </div>

            {profile?.barterReviews?.length > 0 ? (
              <div className="space-y-4">
                {profile.barterReviews.map((review, index) => (
                  <div key={index} className="bg-black border border-white/5 p-4 rounded-2xl print:border-black/10 print:bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#050810] border border-white/10 overflow-hidden flex items-center justify-center font-bold text-white text-xs">
                          {review.reviewer?.name?.charAt(0)}
                        </div>
                        <span className="text-xs text-gray-300 font-bold truncate max-w-[100px] print:text-gray-800">{review.reviewer?.name}</span>
                      </div>
                      <div className="flex gap-0.5 shrink-0">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star key={star} size={10} className={review.rating >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-700"} />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed italic print:text-gray-700">"{review.text}"</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-600 font-mono uppercase tracking-widest text-center py-4">No trade reviews yet.</p>
            )}
          </section>

          {(profile?.socialLinks?.linkedIn || profile?.socialLinks?.github || profile?.socialLinks?.website) && (
            <section className="bg-[#0a0f1c] border border-white/10 rounded-3xl p-5 md:p-6 print:border-black/10 print:bg-white">
              <h2 className="text-white font-bold mb-4 flex items-center gap-2 uppercase tracking-widest text-[10px] font-mono text-gray-500 print:text-black">
                <LinkIcon size={14} className="text-emerald-400" /> External Nodes
              </h2>
              <div className="space-y-4 mt-2">
                {profile.socialLinks.website && (
                  <a href={profile.socialLinks.website} target="_blank" rel="noreferrer" 
                     onClick={() => trackOutboundClick('WEBSITE_CLICK', { url: profile.socialLinks.website })}
                     className="flex items-center gap-3 text-sm text-gray-300 hover:text-emerald-400 transition group break-all print:text-blue-600">
                    <LinkIcon size={16} className="text-gray-500 group-hover:text-emerald-400 transition shrink-0" /> Personal Website
                  </a>
                )}
                {profile.socialLinks.linkedIn && (
                  <a href={profile.socialLinks.linkedIn} target="_blank" rel="noreferrer" 
                     onClick={() => trackOutboundClick('LINKEDIN_CLICK', { url: profile.socialLinks.linkedIn })}
                     className="flex items-center gap-3 text-sm text-gray-300 hover:text-blue-400 transition group break-all print:text-blue-600">
                    <Users size={16} className="text-gray-500 group-hover:text-blue-400 transition shrink-0" /> LinkedIn Profile
                  </a>
                )}
                {profile.socialLinks.github && (
                  <a href={profile.socialLinks.github} target="_blank" rel="noreferrer" 
                     onClick={() => trackOutboundClick('GITHUB_CLICK', { url: profile.socialLinks.github })}
                     className="flex items-center gap-3 text-sm text-gray-300 hover:text-purple-400 transition group break-all print:text-blue-600">
                    <Code size={16} className="text-gray-500 group-hover:text-purple-400 transition shrink-0" /> GitHub Repository
                  </a>
                )}
              </div>
            </section>
          )}

        </div>

        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          <section className="bg-[#0a0f1c] border border-white/10 rounded-3xl p-5 md:p-8 relative overflow-hidden print:border-black/10 print:bg-white print:shadow-none">
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-[50px] pointer-events-none"></div>
             <div className="flex justify-between items-center mb-6 md:mb-8 relative z-10">
               <h2 className="text-white font-bold flex items-center gap-2 uppercase tracking-widest text-[10px] font-mono text-gray-500 print:text-black"><Award size={14} className="text-blue-400" /> High-Impact Portfolio</h2>
               {isOwnProfile && <button onClick={() => setIsPortfolioOpen(true)} className="text-[9px] md:text-[10px] font-mono text-blue-400 hover:text-blue-300 uppercase tracking-widest border border-blue-500/30 px-3 py-1.5 rounded-full hover:bg-blue-500/10 transition">+ Deploy</button>}
             </div>
            
            {profile?.portfolio && profile.portfolio.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {profile.portfolio.map((item, index) => (
                  <div key={item._id || index} className="bg-black border border-white/5 rounded-2xl overflow-hidden group flex flex-col relative hover:border-blue-500/30 transition-colors print:border-black/10 print:bg-gray-50">
                    {isOwnProfile && <button onClick={() => handleDeletePortfolio(item._id)} className="absolute top-2 right-2 p-2 bg-black/60 text-gray-400 hover:text-red-400 rounded-full transition z-20 md:opacity-0 md:group-hover:opacity-100"><Trash2 size={16} /></button>}
                    
                    {/* IMPLEMENTED CLOUDINARY SAFE LOADER */}
                    {item.imageUrl ? <div className="h-32 w-full overflow-hidden border-b border-white/5"><img src={getImageUrl(item.imageUrl)} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" /></div> : <div className="h-2 w-full bg-gradient-to-r from-blue-600 to-indigo-600"></div>}
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="text-lg font-bold text-white mb-2 print:text-black">{item.title}</h3>
                      <p className="text-sm text-gray-400 mb-4 print:text-gray-700">{item.solution}</p>
                      
                      {item.result && <div className="mt-auto mb-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs p-3 rounded-lg font-mono">🚀 Impact: {item.result}</div>}
                      
                      <div className="flex gap-3 text-xs mt-auto print:hidden">
                        {item.projectUrl && (
                          <a href={item.projectUrl} target="_blank" rel="noreferrer" 
                             onClick={() => trackOutboundClick('PORTFOLIO_CLICK', { portfolioId: item._id, url: item.projectUrl })}
                             className="flex items-center gap-1 text-blue-400 hover:underline">
                            <ExternalLink size={12}/> Live Link
                          </a>
                        )}
                        {item.githubUrl && (
                          <a href={item.githubUrl} target="_blank" rel="noreferrer" 
                             onClick={() => trackOutboundClick('GITHUB_CLICK', { portfolioId: item._id, url: item.githubUrl })}
                             className="flex items-center gap-1 text-purple-400 hover:underline">
                            <Code size={12}/> Source Code
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : <div className="text-center py-10 border border-dashed border-white/5 rounded-2xl"><p className="text-gray-600 text-xs font-mono uppercase tracking-widest">No project vectors deployed</p></div>}
          </section>

          <section className="bg-[#0a0f1c] border border-white/10 rounded-3xl p-5 md:p-8 print:border-black/10 print:bg-white">
             <h2 className="text-white font-bold mb-6 flex items-center gap-2 uppercase tracking-widest text-[10px] font-mono text-gray-500 print:text-black"><Zap size={14} className="text-yellow-400" /> Thought Leadership</h2>
            
            {thoughtLeadershipFeed.length > 0 ? (
              <div className="space-y-6">
                {thoughtLeadershipFeed.map((insight) => {
                  return (
                    <div key={insight._id} className="bg-black border border-white/5 rounded-2xl p-5 relative group print:border-black/10 print:bg-gray-50">
                      {isOwnProfile && <button onClick={() => handleDeleteInsight(insight._id)} className="absolute top-4 right-4 p-2 text-gray-500 hover:text-red-400 md:opacity-0 md:group-hover:opacity-100 transition z-20 bg-black/40 rounded-full"><Trash2 size={16} /></button>}
                      
                      {/* IMPLEMENTED CLOUDINARY SAFE LOADER */}
                      {insight.imageUrl && <img src={getImageUrl(insight.imageUrl)} alt="Insight" className="w-full h-40 object-cover rounded-xl mb-4" />}
                      <h3 className="text-md font-bold text-white mb-2 pr-10 print:text-black">{insight.title}</h3>
                      <p className="text-sm text-gray-400 mb-4 print:text-gray-700">{insight.content}</p>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {insight.tags?.map(tag => <span key={tag} className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-2 py-1 rounded print:bg-blue-50 print:border print:border-blue-200">#{tag}</span>)}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : <div className="text-center py-6"><p className="text-gray-600 text-xs font-mono uppercase tracking-widest">No insights published yet</p></div>}
          </section>

        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
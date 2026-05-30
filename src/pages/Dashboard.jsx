// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Briefcase, BrainCircuit, Zap, Ticket, RefreshCcw, HeartPulse,
  Bell, Search, MessageSquareLock, ArrowRight, Activity, Clock,
  CheckCircle2, TrendingUp, ShieldCheck, X, Home, Users, MessageSquare,
  User, Eye, MousePointerClick, Code, ExternalLink, Star, UserPlus, Target
} from 'lucide-react';
import NotificationCenter from './NotificationCenter';
import apiClient from '../utils/apiClient';

// --- HELPER FUNCTIONS FOR LIVE ACTIVITY ---
const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  let interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hrs ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " mins ago";
  return "Just now";
};

const getEventDisplay = (event) => {
  const actorName = event.actor ? event.actor.name.split(' ')[0] : "Someone";
  const actorRole = event.actor ? event.actor.role : "A user";

  switch (event.eventType) {
    case 'PROFILE_VIEW':
      return { icon: <Eye size={14} className="text-blue-400" />, text: `${actorRole} viewed your profile.` };
    case 'PORTFOLIO_CLICK':
      return { icon: <MousePointerClick size={14} className="text-purple-400" />, text: `${actorName} clicked your portfolio.` };
    case 'GITHUB_CLICK':
      return { icon: <Code size={14} className="text-gray-400" />, text: `${actorName} viewed your GitHub.` };
    case 'LINKEDIN_CLICK':
      return { icon: <Users size={14} className="text-blue-500" />, text: `${actorName} checked your LinkedIn.` };
    case 'WEBSITE_CLICK':
      return { icon: <ExternalLink size={14} className="text-emerald-400" />, text: `${actorName} visited your website.` };
    case 'MENTORSHIP_REQUEST':
      return { icon: <BrainCircuit size={14} className="text-indigo-400" />, text: `${actorName} requested mentorship!` };
    case 'MENTORSHIP_ACCEPTED':
      return { icon: <CheckCircle2 size={14} className="text-emerald-400" />, text: `${actorName} accepted your request.` };
    case 'REVIEW_RECEIVED':
      return { icon: <Star size={14} className="text-yellow-400" />, text: `${actorName} left you a review.` };
    case 'FOLLOW':
      return { icon: <UserPlus size={14} className="text-blue-400" />, text: `${actorName} started following you.` };
    default:
      return { icon: <Activity size={14} className="text-gray-400" />, text: `${actorName} interacted with your profile.` };
  }
};

// --- SAFE IMAGE LOADER FOR CLOUDINARY ---
const getImageUrl = (path) => {
  if (!path) return '';
  return path.startsWith('http') ? path : `https://bizferbine-backend.onrender.com/${path}`;
};

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const [analytics, setAnalytics] = useState({ weeklyProfileViews: 0, projectClicks: 0, mentorshipRequests: 0 });
  const [recentPulse, setRecentPulse] = useState([]);
  const [momentum, setMomentum] = useState({ aggregateScore: 0, data: { responsiveness: 50, followThrough: 50, execution: 0, participation: 0, trend: 'Stable' } });
  const [isMomentumLoading, setIsMomentumLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token) {
      navigate('/login');
    } else if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setUnreadCount(2);

      apiClient.get('/analytics/summary')
        .then(res => res.json())
        .then(data => {
          setAnalytics(data.summary || { weeklyProfileViews: 0, projectClicks: 0, mentorshipRequests: 0 });
          setRecentPulse(data.recentPulse || []);
        })
        .catch(err => console.error("Analytics fetch error:", err));

      // Fetch Phase 5 Momentum Data
      apiClient.get(`/analytics/momentum/${parsedUser.id}`)
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data) setMomentum(data);
          setIsMomentumLoading(false);
        })
        .catch(() => setIsMomentumLoading(false));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return <div className="min-h-screen bg-[#050810] text-blue-400 flex items-center justify-center font-mono animate-pulse tracking-widest uppercase text-sm text-center px-4">Initializing Systems...</div>;

  const systemModules = [
    { title: "Secure Deal Rooms", path: "/deals", icon: <Briefcase size={20} className="text-blue-400" />, desc: "Manage financial proposals in a private environment.", badge: "2 Active", highlight: true },
    { title: "Skill Exchange", path: "/skill-exchange", icon: <RefreshCcw size={20} className="text-cyan-400" />, desc: "Trade professional skills directly with other founders.", badge: "1 Pending" },
    { title: "AI Mentorship", path: "/mentorship", icon: <BrainCircuit size={20} className="text-purple-400" />, desc: "Review AI-matched mentee applications or find a mentor." },
    { title: "Events Hub", path: "/events", icon: <Ticket size={20} className="text-emerald-400" />, desc: "Deploy new events, manage capacities, or sponsor." },
    { title: "Industry Insights", path: "/insights", icon: <Zap size={20} className="text-yellow-400" />, desc: "Read and publish micro-blogs to your professional network.", badge: "New" },
    { title: "Mental Wellness", path: "/wellness-corner", icon: <HeartPulse size={20} className="text-rose-400" />, desc: "Recalibrate, track moods, and access decompression tools." }
  ];

  return (
    <div className="min-h-screen bg-[#050810] text-gray-200 font-sans selection:bg-blue-500/30 relative overflow-hidden pb-24 md:pb-10">

      <NotificationCenter isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} onUnreadUpdate={setUnreadCount} />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/5 via-[#050810] to-[#050810] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-50"></div>

      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#050810]/90 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center gap-4">

          <div className="flex items-center shrink-0">
            <Link to="/" className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:scale-105 transition-transform">
              <span className="text-white text-xl font-black">B</span>
            </Link>
          </div>

          <div className="flex-1 max-w-xl relative group hidden md:block mx-6">
            <input
              type="text" placeholder="Search people, deals, skills, events..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && searchQuery.trim() && navigate(`/search?q=${encodeURIComponent(searchQuery)}`)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-full px-12 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition placeholder-gray-500"
            />
            <Search size={16} className="absolute left-5 top-3.5 text-gray-500" />
          </div>

          <div className="flex items-center gap-1 sm:gap-4 shrink-0">
            <button
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="md:hidden p-2.5 text-gray-400 hover:text-white transition rounded-full hover:bg-white/5"
            >
              {isMobileSearchOpen ? <X size={20} /> : <Search size={20} />}
            </button>

            <div className="flex items-center gap-1 sm:gap-2 border-r border-white/10 pr-2 sm:pr-4">
              <Link to="/messages" className="hidden md:flex p-2.5 text-gray-400 hover:text-rose-400 transition rounded-full hover:bg-white/5" title="Encrypted Messages">
                <MessageSquareLock size={20} />
              </Link>
              <button onClick={() => setIsNotifOpen(true)} className="relative p-2.5 text-gray-400 hover:text-blue-400 transition rounded-full hover:bg-white/5" title="System Alerts">
                <Bell size={20} />
                {unreadCount > 0 && <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border border-[#050810]"></span>}
              </button>
            </div>

            <div className="relative pl-2 sm:pl-2">
              <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-3 focus:outline-none">
                <div className="text-right hidden lg:block">
                  <div className="text-sm font-bold text-white tracking-wide">{user.name}</div>
                </div>
                <div className="w-9 h-9 rounded-full bg-blue-500/20 p-0.5 shrink-0 hover:scale-105 transition-transform">
                  <div className="w-full h-full rounded-full bg-blue-900 flex items-center justify-center text-sm font-bold text-white overflow-hidden">
                    {/* IMPLEMENTED CLOUDINARY SAFE LOADER */}
                    {user.profilePictureUrl ? <img src={getImageUrl(user.profilePictureUrl)} className="w-full h-full object-cover" alt="Avatar" /> : user.name.charAt(0)}
                  </div>
                </div>
              </button>

              {isProfileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>
                  <div className="absolute top-14 right-0 w-48 bg-[#0a0f1c]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <Link to="/profile" className="block px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition">My Profile</Link>
                    <div className="border-t border-white/10"></div>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition">Sign Out</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {isMobileSearchOpen && (
          <div className="md:hidden px-4 pb-4 animate-in slide-in-from-top-2">
            <div className="relative">
              <input
                type="text" placeholder="Search people, deals, events..." autoFocus value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchQuery.trim() && navigate(`/search?q=${encodeURIComponent(searchQuery)}`)}
                className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-10 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50"
              />
              <Search size={16} className="absolute left-4 top-3.5 text-gray-400" />
            </div>
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8 relative z-10">

        <div className="mb-6 md:mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-[#0a0f1c] border border-white/5 p-6 md:p-10 rounded-2xl md:rounded-[2rem] relative overflow-hidden">
          <div className="relative z-10 w-full md:w-auto">
            <div className="text-emerald-400 font-mono text-[10px] tracking-[0.2em] mb-2 uppercase flex items-center gap-2">
              <ShieldCheck size={14} /> System Online
            </div>
            <h1 className="text-2xl md:text-4xl font-bold text-white tracking-tight mb-2">
              Welcome back, {user.name.split(' ')[0]}.
            </h1>
            <p className="text-gray-400 text-sm md:text-base">You have <span className="text-white font-medium">3 pending proposals</span> awaiting review.</p>
          </div>
          <Link to="/skill-exchange" className="relative z-10 w-full md:w-auto bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-xl text-sm font-bold transition flex justify-center items-center gap-2 shadow-lg">
            Resume Workspace <ArrowRight size={16} />
          </Link>
        </div>

        {/* --- PHASE 5: THE MOMENTUM HUD --- */}
        <div className="bg-gradient-to-br from-[#0a0f1c] to-black border border-white/10 rounded-3xl p-8 mb-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/5 rounded-full blur-[80px] pointer-events-none"></div>

          <div className="flex flex-col lg:flex-row gap-8 items-center relative z-10">
            {/* The Aggregate Score Ring */}
            <div className="flex flex-col items-center shrink-0">
              <div className="relative w-36 h-36 flex items-center justify-center mb-2">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="72" cy="72" r="64" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                  <circle cx="72" cy="72" r="64" stroke="currentColor" strokeWidth="8" fill="transparent"
                    strokeDasharray="402"
                    strokeDashoffset={402 - (402 * momentum.aggregateScore) / 100}
                    className="text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)] transition-all duration-1000" />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  {isMomentumLoading ? <Activity className="text-emerald-500 animate-pulse" /> : (
                    <>
                      <span className="text-4xl font-black text-white">{Math.round(momentum.aggregateScore)}</span>
                      <span className="text-[9px] font-mono text-emerald-500 uppercase tracking-widest mt-1">Momentum</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                <TrendingUp size={12} className={momentum.data.trend === 'Accelerating' ? 'text-emerald-400' : 'text-gray-400'} />
                <span className="text-[10px] font-mono text-gray-300 uppercase tracking-wider">{momentum.data.trend}</span>
              </div>
            </div>

            {/* The Metric Breakdown */}
            <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              {[
                { label: 'Responsiveness', value: momentum.data.responsiveness, icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-400' },
                { label: 'Follow-Through', value: momentum.data.followThrough, icon: ShieldCheck, color: 'text-blue-400', bg: 'bg-blue-400' },
                { label: 'Execution Volume', value: momentum.data.execution, icon: Target, color: 'text-emerald-400', bg: 'bg-emerald-400' },
                { label: 'Network Participation', value: momentum.data.participation, icon: Activity, color: 'text-purple-400', bg: 'bg-purple-400' }
              ].map((stat, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-gray-400 flex items-center gap-2"><stat.icon size={14} className={stat.color} /> {stat.label}</span>
                    <span className="text-white font-mono">{stat.value}<span className="text-gray-600">/100</span></span>
                  </div>
                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                    <div className={`h-full ${stat.bg} rounded-full transition-all duration-1000 relative`} style={{ width: `${Math.min(stat.value, 100)}%` }}>
                      <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8">
          {[
            { label: "Profile Views", value: analytics.weeklyProfileViews || "0", icon: <Eye size={16} className="text-blue-400" />, trend: "Last 7 days", trendUp: true },
            { label: "Project Traction", value: analytics.projectClicks || "0", icon: <MousePointerClick size={16} className="text-purple-400" />, trend: "External Clicks", trendUp: true },
            { label: "Mentor Interest", value: analytics.mentorshipRequests || "0", icon: <Users size={16} className="text-emerald-400" />, trend: "Inbound Requests", trendUp: analytics.mentorshipRequests > 0 },
            { label: "Active Deals", value: "2", icon: <Briefcase size={16} className="text-yellow-400" />, trend: "In Negotiation", trendUp: true }
          ].map((stat, i) => (
            <div key={i} className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl flex flex-col justify-between hover:bg-white/[0.04] transition">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider truncate mr-2">{stat.label}</span>
                <div className="p-1.5 bg-white/5 rounded-lg shrink-0">{stat.icon}</div>
              </div>
              <div>
                <div className="text-xl md:text-2xl font-black text-white">{stat.value}</div>
                <div className={`text-[10px] mt-1 font-medium truncate ${stat.trendUp ? 'text-emerald-400' : 'text-gray-500'}`}>{stat.trend}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">

          <div className="xl:col-span-2 order-2 xl:order-1">

            {analytics.weeklyProfileViews > 0 && (
              <div className="mb-6 bg-gradient-to-r from-blue-900/30 to-purple-900/10 border border-blue-500/20 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                    <TrendingUp size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Your visibility is increasing.</p>
                    <p className="text-xs text-blue-200/70">{analytics.weeklyProfileViews} founders viewed your professional ecosystem this week.</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between items-end mb-4">
              <h2 className="text-base font-bold text-white tracking-wide">Workspaces</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {systemModules.map((mod, index) => (
                <Link
                  to={mod.path}
                  key={index}
                  className={`group relative bg-white/[0.02] border border-white/5 p-5 md:p-6 rounded-2xl transition-all hover:bg-white/[0.04] flex flex-col overflow-hidden ${mod.highlight ? 'ring-1 ring-blue-500/30' : ''}`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="w-10 h-10 bg-black/40 border border-white/10 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                      {mod.icon}
                    </div>
                    {mod.badge && (
                      <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-white/10 text-gray-300">
                        {mod.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-white mb-1">{mod.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed mb-4 line-clamp-2">
                    {mod.desc}
                  </p>

                  <div className="mt-auto flex items-center gap-1 text-[11px] font-bold text-blue-400 uppercase tracking-wider group-hover:text-blue-300 transition-colors">
                    Open Module <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-6 order-1 xl:order-2">

            <div className="bg-white/[0.02] border border-white/5 p-5 md:p-6 rounded-2xl">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-sm font-bold text-white">Profile Setup</h2>
                <span className="text-xs text-blue-400 font-bold">70%</span>
              </div>
              <div className="w-full bg-black/50 rounded-full h-1.5 mb-4 overflow-hidden">
                <div className="bg-blue-500 h-1.5 rounded-full w-[70%]"></div>
              </div>
              <p className="text-xs text-gray-400 mb-3 leading-relaxed">Complete your profile to unlock advanced AI matches.</p>
              <Link to="/profile" className="text-xs text-white font-medium underline underline-offset-2 hover:text-blue-400 transition">Add your top skills</Link>
            </div>

            <div className="bg-gradient-to-br from-cyan-900/40 to-blue-900/20 border border-cyan-500/30 p-5 md:p-6 rounded-2xl relative overflow-hidden group">
              <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-3 text-cyan-400">
                <BrainCircuit size={16} />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">AI Match Found</h3>
              <p className="text-xs text-cyan-100/70 mb-4 leading-relaxed">A founder needs your React skills in exchange for UI Design.</p>
              <Link to="/skill-exchange" className="w-full bg-cyan-500 hover:bg-cyan-400 text-black py-2.5 rounded-xl text-xs font-bold transition flex justify-center items-center">
                Review Match
              </Link>
            </div>

            <div>
              <h2 className="text-sm font-bold text-gray-300 mb-3">Recent Activity</h2>
              <div className="bg-transparent border border-white/5 p-4 md:p-5 rounded-2xl space-y-4">
                {recentPulse.length === 0 ? (
                  <div className="text-center py-6 border border-dashed border-white/5 rounded-xl">
                    <Activity size={24} className="mx-auto text-gray-600 mb-2" />
                    <p className="text-xs text-gray-500 font-mono uppercase tracking-widest">Network pulse is quiet</p>
                    <p className="text-[10px] text-gray-600 mt-1">Broadcast an insight to generate traction.</p>
                  </div>
                ) : (
                  recentPulse.map((event, i) => {
                    const display = getEventDisplay(event);
                    return (
                      <div key={event._id || i} className="flex gap-3 items-start opacity-80 hover:opacity-100 transition-opacity">
                        <div className="mt-0.5 shrink-0 bg-white/5 p-1.5 rounded-md">{display.icon}</div>
                        <div>
                          <p className="text-xs text-gray-300 leading-tight">{display.text}</p>
                          <p className="text-[10px] text-gray-600 mt-1">{timeAgo(event.createdAt)}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

          </div>

        </div>
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-[#050810]/95 backdrop-blur-xl border-t border-white/10 z-50 px-6 py-3 flex justify-between items-center pb-safe">
        <Link to="/dashboard" className="flex flex-col items-center gap-1 text-blue-400">
          <Home size={20} />
          <span className="text-[10px] font-medium">Home</span>
        </Link>
        <Link to="/network" className="flex flex-col items-center gap-1 text-gray-500 hover:text-gray-300 transition">
          <Users size={20} />
          <span className="text-[10px] font-medium">Network</span>
        </Link>
        <Link to="/deals" className="flex flex-col items-center gap-1 text-gray-500 hover:text-gray-300 transition">
          <Briefcase size={20} />
          <span className="text-[10px] font-medium">Deals</span>
        </Link>
        <Link to="/messages" className="flex flex-col items-center gap-1 text-gray-500 hover:text-gray-300 transition relative">
          <MessageSquare size={20} />
          <span className="text-[10px] font-medium">Chat</span>
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </Link>
        <Link to="/profile" className="flex flex-col items-center gap-1 text-gray-500 hover:text-gray-300 transition">
          <User size={20} />
          <span className="text-[10px] font-medium">Profile</span>
        </Link>
      </nav>

    </div>
  );
};

export default Dashboard;
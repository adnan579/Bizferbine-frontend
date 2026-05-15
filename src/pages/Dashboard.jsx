// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Briefcase, BrainCircuit, Zap, Ticket, RefreshCcw, HeartPulse, 
  Bell, Search, MessageSquareLock, ArrowRight, Activity, Clock, 
  CheckCircle2, TrendingUp, ShieldCheck, X, Home, Users, MessageSquare, User 
} from 'lucide-react';
import NotificationCenter from './NotificationCenter';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [unreadCount, setUnreadCount] = useState(0); 
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token) {
      navigate('/login');
    } else if (userData) {
      setUser(JSON.parse(userData));
      // Mock notification fetch
      setUnreadCount(2); 
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return <div className="min-h-screen bg-[#050810] text-blue-400 flex items-center justify-center font-mono animate-pulse tracking-widest uppercase text-sm text-center px-4">Initializing Systems...</div>;

  // JARGON REMOVED: Clear, outcome-driven naming conventions
  const systemModules = [
    { title: "Secure Deal Rooms", path: "/deals", icon: <Briefcase size={20} className="text-blue-400" />, desc: "Manage financial proposals in a private environment.", badge: "2 Active", highlight: true },
    { title: "Skill Exchange", path: "/skill-exchange", icon: <RefreshCcw size={20} className="text-cyan-400" />, desc: "Trade professional skills directly with other founders.", badge: "1 Pending" },
    { title: "AI Mentorship", path: "/mentorship", icon: <BrainCircuit size={20} className="text-purple-400" />, desc: "Review AI-matched mentee applications or find a mentor." },
    { title: "Events Hub", path: "/events", icon: <Ticket size={20} className="text-emerald-400" />, desc: "Deploy new events, manage capacities, or sponsor." },
    { title: "Industry Insights", path: "/insights", icon: <Zap size={20} className="text-yellow-400" />, desc: "Read and publish micro-blogs to your professional network.", badge: "New" },
    { title: "Mental Wellness", path: "/wellness-corner", icon: <HeartPulse size={20} className="text-rose-400" />, desc: "Recalibrate, track moods, and access decompression tools." }
  ];

  return (
    // Added pb-24 so content doesn't hide behind mobile bottom nav
    <div className="min-h-screen bg-[#050810] text-gray-200 font-sans selection:bg-blue-500/30 relative overflow-hidden pb-24 md:pb-10">
      
      <NotificationCenter isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} onUnreadUpdate={setUnreadCount} />

      {/* Background: Reduced grid visibility for lower cognitive load */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/5 via-[#050810] to-[#050810] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-50"></div>

      {/* TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#050810]/90 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center gap-4">
          
          <div className="flex items-center">
            <Link to="/" className="w-10 h-10 shrink-0 bg-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:scale-105 transition-transform">
              <span className="text-white text-xl font-black">B</span>
            </Link>
          </div>

          {/* DESKTOP SEARCH: Increased width & prominence */}
          <div className="flex-1 max-w-2xl relative group hidden md:block">
            <input 
              type="text" placeholder="Search people, deals, skills, events..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && searchQuery.trim() && navigate(`/search?q=${encodeURIComponent(searchQuery)}`)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-full px-12 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition placeholder-gray-500"
            />
            <Search size={16} className="absolute left-5 top-3.5 text-gray-500" />
          </div>

          <div className="flex items-center gap-1 sm:gap-4">
            <button 
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)} 
              className="md:hidden p-2.5 text-gray-400 hover:text-white transition rounded-full hover:bg-white/5"
            >
              {isMobileSearchOpen ? <X size={20} /> : <Search size={20} />}
            </button>

            <div className="flex items-center gap-1 sm:gap-2 border-r border-white/10 pr-2 sm:pr-4">
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
                    {user.name.charAt(0)}
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
                className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-10 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50"
              />
              <Search size={16} className="absolute left-4 top-3.5 text-gray-400" />
            </div>
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8 relative z-10">
        
        {/* HERO SECTION: Height reduced, CTAs clearer */}
        <div className="mb-6 md:mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-[#0a0f1c] border border-white/5 p-6 rounded-2xl md:rounded-3xl relative overflow-hidden">
          <div className="relative z-10 w-full md:w-auto">
            <div className="text-emerald-400 font-mono text-[10px] tracking-[0.2em] mb-2 uppercase flex items-center gap-2">
              <ShieldCheck size={14} /> System Online
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-1">
              Welcome back, {user.name.split(' ')[0]}.
            </h1>
            <p className="text-gray-400 text-sm">You have <span className="text-white font-medium">3 pending proposals</span> awaiting review.</p>
          </div>
          <Link to="/skill-exchange" className="relative z-10 w-full md:w-auto bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl text-sm font-bold transition flex justify-center items-center gap-2">
            Resume Workspace <ArrowRight size={16} />
          </Link>
        </div>

        {/* KPI STRIP: Added trends/mini analytics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8">
          {[
            { label: "Active Deals", value: "2", icon: <Briefcase size={16} className="text-blue-400"/>, trend: "↑ 1 this week", trendUp: true },
            { label: "Pending Trades", value: "3", icon: <RefreshCcw size={16} className="text-cyan-400"/>, trend: "Action required", trendUp: false },
            { label: "Network Strength", value: "98%", icon: <Activity size={16} className="text-emerald-400"/>, trend: "↑ 2% optimal", trendUp: true },
            { label: "Profile Views", value: "142", icon: <TrendingUp size={16} className="text-purple-400"/>, trend: "↑ 12% vs last week", trendUp: true }
          ].map((stat, i) => (
            <div key={i} className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl flex flex-col justify-between">
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

        {/* MAIN CONTENT SPLIT */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
          
          {/* LEFT: MODULE GRID */}
          <div className="xl:col-span-2 order-2 xl:order-1">
            <div className="flex justify-between items-end mb-4">
              <h2 className="text-base font-bold text-white tracking-wide">Workspaces</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {systemModules.map((mod, index) => (
                <Link 
                  to={mod.path} 
                  key={index} 
                  // Heights reduced, padding tightened for scannability
                  className={`group relative bg-white/[0.02] border border-white/5 p-5 rounded-2xl transition-all hover:bg-white/[0.04] flex flex-col overflow-hidden ${mod.highlight ? 'ring-1 ring-blue-500/30' : ''}`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="w-10 h-10 bg-black/40 border border-white/10 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                      {mod.icon}
                    </div>
                    {/* Skimmable Badges instead of empty space */}
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
                  
                  {/* Text-based clear action instead of ambiguous arrow */}
                  <div className="mt-auto flex items-center gap-1 text-[11px] font-bold text-blue-400 uppercase tracking-wider group-hover:text-blue-300 transition-colors">
                    Open Module <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* RIGHT: RETENTION SIDEBAR */}
          <div className="space-y-6 order-1 xl:order-2">
            
            {/* NEW: Onboarding Guidance */}
            <div className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-sm font-bold text-white">Profile Setup</h2>
                <span className="text-xs text-blue-400 font-bold">70%</span>
              </div>
              <div className="w-full bg-black/50 rounded-full h-1.5 mb-4 overflow-hidden">
                <div className="bg-blue-500 h-1.5 rounded-full w-[70%]"></div>
              </div>
              <p className="text-xs text-gray-400 mb-3">Complete your profile to unlock advanced AI matches.</p>
              <Link to="/profile" className="text-xs text-white font-medium underline underline-offset-2 hover:text-blue-400 transition">Add your top skills</Link>
            </div>

            {/* Recommended Action: Elevated contrast (Level 1) */}
            <div className="bg-gradient-to-br from-cyan-900/40 to-blue-900/20 border border-cyan-500/30 p-5 rounded-2xl relative overflow-hidden group">
              <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-3 text-cyan-400">
                <BrainCircuit size={16} />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">AI Match Found</h3>
              <p className="text-xs text-cyan-100/70 mb-4 leading-relaxed">A founder needs your React skills in exchange for UI Design.</p>
              <Link to="/skill-exchange" className="w-full bg-cyan-500 hover:bg-cyan-400 text-black py-2.5 rounded-xl text-xs font-bold transition flex justify-center items-center">
                Review Match
              </Link>
            </div>

            {/* Recent Activity Feed: Lower contrast (Level 3) */}
            <div>
              <h2 className="text-sm font-bold text-gray-300 mb-3">Recent Activity</h2>
              <div className="bg-transparent border border-white/5 p-4 rounded-2xl space-y-4">
                {[
                  { icon: <Clock size={14} className="text-yellow-400"/>, text: "Deal #0A89 marked as Negotiating", time: "2 hrs ago" },
                  { icon: <CheckCircle2 size={14} className="text-emerald-400"/>, text: "Jane Doe accepted your connection", time: "5 hrs ago" },
                  { icon: <Zap size={14} className="text-purple-400"/>, text: "Your insight reached 150 views", time: "1 day ago" }
                ].map((item, i) => (
                  <div key={i} className="flex gap-3 items-start opacity-80 hover:opacity-100 transition-opacity">
                    <div className="mt-0.5 shrink-0 bg-white/5 p-1.5 rounded-md">{item.icon}</div>
                    <div>
                      <p className="text-xs text-gray-300 leading-tight">{item.text}</p>
                      <p className="text-[10px] text-gray-600 mt-1">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* NEW: MOBILE BOTTOM NAVIGATION (Sticky) */}
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
          {/* Unread indicator */}
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
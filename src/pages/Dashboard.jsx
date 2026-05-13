// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Briefcase, BrainCircuit, Zap, Ticket, RefreshCcw, HeartPulse, Bell, Search, MessageSquareLock, ArrowRight, Activity, Clock, CheckCircle2, TrendingUp, ShieldCheck } from 'lucide-react';
import NotificationCenter from './NotificationCenter';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // LIVE NOTIFICATION STATES
  const [unreadCount, setUnreadCount] = useState(0); 
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token) {
      navigate('/login');
    } else if (userData) {
      setUser(JSON.parse(userData));
      
      fetch('https://bizferbine-backend.onrender.com/api/notifications', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => setUnreadCount(data.unreadCount || 0))
      .catch(err => console.error(err));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return <div className="min-h-screen bg-[#050810] text-blue-400 flex items-center justify-center font-mono animate-pulse tracking-widest uppercase">Initializing System Vectors...</div>;

  // UPDATED MODULES ARRAY: Removed Network/Analytics/Messages. Added Wellness.
  const systemModules = [
    { title: "Quantum Deal Rooms", path: "/deals", icon: <Briefcase size={24} className="text-blue-400" />, desc: "Access secure negotiation environments and encrypted financial deal flows.", highlight: true },
    { title: "Skill Barter Exchange", path: "/skill-exchange", icon: <RefreshCcw size={24} className="text-cyan-400" />, desc: "Bypass friction. Trade professional skills directly with other network nodes." },
    { title: "Algorithmic Mentorship", path: "/mentorship", icon: <BrainCircuit size={24} className="text-purple-400" />, desc: "Review AI-matched mentee applications or manage your mentor connections." },
    { title: "Event Vectors", path: "/events", icon: <Ticket size={24} className="text-emerald-400" />, desc: "Deploy new events, manage capacities, or secure corporate sponsorships." },
    { title: "Industry Insights", path: "/insights", icon: <Zap size={24} className="text-yellow-400" />, desc: "Enter the thought leadership feed. Publish micro-blogs and engage peers." },
    { title: "Mental Wellness", path: "/wellness-corner", icon: <HeartPulse size={24} className="text-rose-400" />, desc: "A quiet space to recalibrate, track moods, and access guided decompression." }
  ];

  return (
    <div className="min-h-screen bg-[#050810] text-gray-200 font-sans selection:bg-blue-500/30 relative overflow-hidden pb-20">
      
      <NotificationCenter isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} onUnreadUpdate={setUnreadCount} />

      {/* Cyber-futuristic soft ambient background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-[#050810] to-[#050810] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

      {/* TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#050810]/70 border-b border-white/5 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-6">
          
          <div className="flex items-center gap-6">
            <Link to="/" className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-800 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:scale-105 transition-transform">
              <span className="text-white text-xl font-black">B</span>
            </Link>
          </div>

          <div className="flex-1 max-w-xl relative group hidden md:block">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-10 group-hover:opacity-20 transition duration-500"></div>
            <input 
              type="text" placeholder="Query the Database..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && searchQuery.trim() && navigate(`/search?q=${encodeURIComponent(searchQuery)}`)}
              className="relative w-full bg-[#0a0f1c] border border-white/10 rounded-full px-12 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50 transition placeholder-gray-600"
            />
            <Search size={16} className="absolute left-5 top-3.5 text-gray-500" />
          </div>

          <div className="flex items-center gap-2 sm:gap-6">
            
            {/* QUICK ACTIONS: Messages & Notifications */}
            <div className="flex items-center gap-2 border-r border-white/10 pr-6">
              <Link to="/messages" className="relative p-2 text-gray-400 hover:text-rose-400 transition group" title="Encrypted Messages">
                <MessageSquareLock size={20} className="group-hover:scale-110 transition-transform" />
              </Link>
              <button onClick={() => setIsNotifOpen(true)} className="relative p-2 text-gray-400 hover:text-blue-400 transition group" title="System Alerts">
                <Bell size={20} className="group-hover:scale-110 transition-transform" />
                {unreadCount > 0 && <span className="absolute top-1 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#050810] shadow-[0_0_10px_rgba(239,68,68,1)] animate-pulse"></span>}
              </button>
            </div>

            {/* PROFILE DROPDOWN */}
            <div className="flex items-center gap-3 group cursor-pointer relative">
              <div className="text-right hidden lg:block">
                <div className="text-sm font-bold text-white tracking-wide">{user.name}</div>
                <div className="text-[10px] text-blue-400 font-mono tracking-widest uppercase opacity-80">{user.role || 'User'}</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 p-[1.5px]">
                <div className="w-full h-full rounded-full bg-[#050810] flex items-center justify-center text-sm font-bold text-white overflow-hidden">
                  {user.profilePictureUrl ? <img src={`https://bizferbine-backend.onrender.com/${user.profilePictureUrl}`} className="w-full h-full object-cover" /> : user.name.charAt(0)}
                </div>
              </div>
              
              <div className="absolute top-12 right-0 w-48 bg-[#0a0f1c]/95 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden z-50">
                <Link to="/profile" className="block px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition">My Profile</Link>
                <div className="border-t border-white/10"></div>
                <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition">Disconnect System</button>
              </div>
            </div>

          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10 relative z-10">
        
        {/* HERO SECTION */}
        <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-gradient-to-r from-blue-900/20 to-transparent p-8 rounded-[2rem] border border-blue-500/10 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-blue-500/10 blur-[100px] pointer-events-none"></div>
          <div className="relative z-10">
            <div className="text-blue-400 font-mono text-[10px] tracking-[0.2em] mb-3 uppercase flex items-center gap-2">
              <ShieldCheck size={14} /> SECURE CONNECTION ESTABLISHED
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-2">
              Good {new Date().getHours() < 12 ? 'Morning' : 'Evening'}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">{user.name.split(' ')[0]}</span>.
            </h1>
            <p className="text-gray-400 text-sm max-w-lg">Your ecosystem is active. You have pending proposals awaiting your review in the Skill Exchange.</p>
          </div>
          <Link to="/skill-exchange" className="relative z-10 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-full text-sm font-bold transition shadow-[0_0_20px_rgba(37,99,235,0.4)] flex items-center gap-2 whitespace-nowrap">
            Resume Workspace <ArrowRight size={16} />
          </Link>
        </div>

        {/* KPI STRIP */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Active Deals", value: "2", icon: <Briefcase size={16} className="text-blue-400"/>, trend: "+1 this week" },
            { label: "Pending Trades", value: "3", icon: <RefreshCcw size={16} className="text-cyan-400"/>, trend: "Action required" },
            { label: "Network Strength", value: "98%", icon: <Activity size={16} className="text-emerald-400"/>, trend: "Optimal" },
            { label: "Profile Views", value: "142", icon: <TrendingUp size={16} className="text-purple-400"/>, trend: "+12% vs last week" }
          ].map((stat, i) => (
            <div key={i} className="bg-[#0a0f1c] border border-white/5 p-5 rounded-3xl flex flex-col justify-between">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">{stat.label}</span>
                <div className="p-1.5 bg-white/5 rounded-lg">{stat.icon}</div>
              </div>
              <div>
                <div className="text-2xl font-black text-white">{stat.value}</div>
                <div className="text-[10px] text-gray-500 mt-1">{stat.trend}</div>
              </div>
            </div>
          ))}
        </div>

        {/* MAIN CONTENT SPLIT */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* LEFT: MODULE GRID */}
          <div className="xl:col-span-2">
            <h2 className="text-sm font-bold text-white mb-4 tracking-wide">System Modules</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {systemModules.map((mod, index) => (
                <Link 
                  to={mod.path} 
                  key={index} 
                  className={`group relative bg-[#0a0f1c] border border-white/5 p-6 rounded-[2rem] transition-all duration-300 hover:-translate-y-1 flex flex-col h-full overflow-hidden ${mod.highlight ? 'ring-1 ring-blue-500/30 bg-gradient-to-br from-blue-900/10 to-transparent' : ''}`}
                >
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 bg-black/50 border border-white/10 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">
                        {mod.icon}
                      </div>
                      <ArrowRight size={16} className="text-gray-600 group-hover:text-white transition-colors" />
                    </div>
                    
                    <h3 className="text-lg font-bold text-white mb-2 tracking-wide">{mod.title}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed mt-auto">
                      {mod.desc}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* RIGHT: RETENTION SIDEBAR */}
          <div className="space-y-6">
            
            {/* Recommended Action */}
            <div>
              <h2 className="text-sm font-bold text-white mb-4 tracking-wide">Recommended Actions</h2>
              <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/10 border border-cyan-500/20 p-6 rounded-[2rem] relative overflow-hidden group">
                <div className="relative z-10">
                  <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center mb-4 text-cyan-400">
                    <BrainCircuit size={20} />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">AI Match Found</h3>
                  <p className="text-xs text-cyan-100/70 mb-5">We found a Node seeking your React skills in exchange for UI Design.</p>
                  <Link to="/skill-exchange" className="w-full bg-cyan-500 text-black py-2.5 rounded-xl text-xs font-bold transition flex justify-center items-center gap-2">
                    Review Match
                  </Link>
                </div>
              </div>
            </div>

            {/* Recent Activity Feed */}
            <div>
              <h2 className="text-sm font-bold text-white mb-4 tracking-wide">Recent Network Pulse</h2>
              <div className="bg-[#0a0f1c] border border-white/5 p-6 rounded-[2rem] space-y-5">
                {[
                  { icon: <Clock size={14} className="text-yellow-400"/>, text: "Deal #0A89 marked as Negotiating", time: "2 hrs ago" },
                  { icon: <CheckCircle2 size={14} className="text-emerald-400"/>, text: "Jane Doe accepted your connection", time: "5 hrs ago" },
                  { icon: <Zap size={14} className="text-purple-400"/>, text: "Your insight reached 150 views", time: "1 day ago" }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="mt-0.5 shrink-0">{item.icon}</div>
                    <div>
                      <p className="text-sm text-gray-300 leading-tight">{item.text}</p>
                      <p className="text-[10px] text-gray-600 font-mono mt-1">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;
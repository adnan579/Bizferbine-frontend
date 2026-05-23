// src/pages/AdminPanelPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Users, Briefcase, Activity, Settings, Search, Filter, AlertOctagon, CheckCircle2, 
  ChevronRight, Download, Ban, Unlock, Zap, Network, Calendar, Lock, MessageSquare, Megaphone, Send, Trash2, FileText, AlertTriangle, DollarSign } from 'lucide-react';

const AdminPanelPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  
  // Data States
  const [stats, setStats] = useState({ totalUsers: 0, activeDeals: 0, pendingDisputes: 0, activeBarters: 0 });
  const [deepStats, setDeepStats] = useState({ totalMentorships: 0, totalInsights: 0, totalEvents: 0, totalConnections: 0, economyVolume: 0 });
  const [disputes, setDisputes] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Broadcast State
const [broadcastMessage, setBroadcastMessage] = useState('');
const [isBroadcasting, setIsBroadcasting] = useState(false);

// Content Moderation State
  const [platformContent, setPlatformContent] = useState({ insights: [], events: [] });
  
  const handleDeleteInsight = async (id) => {
    if (!window.confirm("KILL SWITCH: Are you sure you want to permanently delete this Insight?")) return;
    try {
      const res = await fetch(`https://bizferbine-backend.onrender.com/api/admin/content/insights/${id}`, {
        method: 'DELETE', headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) fetchAdminData();
    } catch (err) { console.error(err); }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm("KILL SWITCH: Are you sure you want to permanently delete this Event?")) return;
    try {
      const res = await fetch(`https://bizferbine-backend.onrender.com/api/admin/content/events/${id}`, {
        method: 'DELETE', headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) fetchAdminData();
    } catch (err) { console.error(err); }
  };
  
  // Modal & Chat Log State
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [resolutionNote, setResolutionNote] = useState('');
  const [chatLogs, setChatLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchAdminData();
  }, []);

  // --- NEW: Automatically fetch chat logs when a dispute is opened ---
  useEffect(() => {
    if (selectedDispute && ['SkillExchange', 'DealRoom', 'Mentorship'].includes(selectedDispute.module)) {
      fetchChatLogs(selectedDispute.reportedEntityId, selectedDispute.module);
    } else {
      setChatLogs([]);
    }
  }, [selectedDispute]);

  const fetchChatLogs = async (workspaceId, moduleName) => {
    setLoadingLogs(true);
    try {
      const res = await fetch(`https://bizferbine-backend.onrender.com/api/admin/workspaces/${workspaceId}/logs?module=${moduleName}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        setChatLogs(await res.json());
      }
    } catch (err) {
      console.error("Failed to fetch logs", err);
    } finally {
      setLoadingLogs(false);
    }
  };

  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/admin-login');
        return;
      }
      
      const statRes = await fetch('https://bizferbine-backend.onrender.com/api/admin/stats', { headers: { 'Authorization': `Bearer ${token}` } });
      
      if (statRes.status === 403 || statRes.status === 401) {
        navigate('/admin-login');
        return;
      }

     const [dispRes, userRes, deepRes, contentRes] = await Promise.all([
        fetch('https://bizferbine-backend.onrender.com/api/admin/disputes', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('https://bizferbine-backend.onrender.com/api/admin/users', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('https://bizferbine-backend.onrender.com/api/admin/analytics', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('https://bizferbine-backend.onrender.com/api/admin/content', { headers: { 'Authorization': `Bearer ${token}` } }) // NEW
      ]);

      if (statRes.ok) setStats(await statRes.json());
      if (dispRes.ok) setDisputes(await dispRes.json());
      if (userRes.ok) setUsers(await userRes.json());
      if (deepRes.ok) setDeepStats(await deepRes.json());
      if (contentRes.ok) setPlatformContent(await contentRes.json()); // NEW
      
    } catch (err) {
      console.error('Admin Fetch Error', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDispute = async (id, status) => {
    try {
      const res = await fetch(`https://bizferbine-backend.onrender.com/api/admin/disputes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ status, note: resolutionNote })
      });
      if (res.ok) {
        setSelectedDispute(null);
        setResolutionNote('');
        fetchAdminData(); 
      }
    } catch (err) { console.error(err); }
  };

  const handleToggleSuspend = async (userId) => {
    if (!window.confirm("Are you sure you want to change this user's suspension status?")) return;
    try {
      const res = await fetch(`https://bizferbine-backend.onrender.com/api/admin/users/${userId}/suspend`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) fetchAdminData();
    } catch (err) { console.error(err); }
  };

  const filteredUsers = users.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleBroadcast = async (e) => {
  e.preventDefault();
  if (!window.confirm("WARNING: This will ping every active user on the platform. Proceed?")) return;

  setIsBroadcasting(true);
  try {
    const res = await fetch('https://bizferbine-backend.onrender.com/api/admin/broadcast', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` 
      },
      body: JSON.stringify({ message: broadcastMessage })
    });

    const data = await res.json();
    if (res.ok) {
      alert(data.message);
      setBroadcastMessage('');
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.error(err);
  } finally {
    setIsBroadcasting(false);
  }
};

// --- NEW: EXPORT DISPUTES TO CSV ---
  const handleExportDisputes = () => {
    if (disputes.length === 0) return alert("No active disputes to export.");
    
    // 1. Create CSV Headers
    const headers = ['Ticket ID', 'Status', 'Module', 'Reporter', 'Reason', 'Date'];
    
    // 2. Map the data into rows
    const rows = disputes.map(d => [
      d._id,
      d.status,
      d.module,
      d.reporter?.name || 'Unknown',
      `"${d.reason.replace(/"/g, '""')}"`, // Escapes quotes so commas in the text don't break the CSV
      new Date(d.createdAt).toLocaleDateString()
    ]);
    
    // 3. Build and Download the File
    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Overseer_Dispute_Log_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- NEW: ISSUE WARNING TO USER ---
  const handleWarnUser = async (userId) => {
    if (!window.confirm("Transmit an Official System Warning to this user?")) return;
    try {
      const res = await fetch(`https://bizferbine-backend.onrender.com/api/admin/users/${userId}/warn`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (res.ok) alert(data.message);
    } catch (err) {
      console.error(err);
    }
  };

  // --- PHASE 3: GHOST PROTOCOL (NEURAL OVERRIDE) ---
  const handleGhostLogin = async (userId) => {
    if (!window.confirm("NEURAL OVERRIDE: Generate a temporary session as this node?")) return;
    try {
      const res = await fetch(`https://bizferbine-backend.onrender.com/api/admin/ghost-auth/${userId}`, {
        method: 'POST', headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        window.location.href = '/dashboard';
      } else alert(data.message);
    } catch (err) { console.error(err); }
  };

  // --- PHASE 2: THE TRUST ORACLE ---
  const handleInjectBadge = async (userId) => {
    const badge = window.prompt("TRUST ORACLE: Enter the name of the badge to manually inject:");
    if (!badge || badge.trim() === '') return;
    try {
      const res = await fetch(`https://bizferbine-backend.onrender.com/api/admin/users/${userId}/badges`, {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ badge })
      });
      if (res.ok) {
        alert("Badge Injected Successfully!");
        fetchAdminData();
      }
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="min-h-screen bg-[#020408] text-rose-500 flex items-center justify-center font-mono animate-pulse uppercase tracking-widest">Authenticating Security Clearance...</div>;

  return (
    <div className="min-h-screen bg-[#020408] text-gray-200 font-sans flex h-screen overflow-hidden selection:bg-blue-500/30">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-[#050810] border-r border-white/5 flex flex-col shrink-0 relative z-20">
        <div className="p-6 border-b border-white/5 flex items-center gap-3">
          <ShieldAlert className="text-rose-500" size={28} />
          <h1 className="text-xl font-black text-white tracking-widest uppercase">OVERSEER</h1>
        </div>
        
        <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium text-sm ${activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
            <Activity size={18} /> Command Center
          </button>
          <button onClick={() => setActiveTab('disputes')} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition font-medium text-sm ${activeTab === 'disputes' ? 'bg-rose-600 text-white shadow-[0_0_15px_rgba(225,29,72,0.3)]' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
            <div className="flex items-center gap-3"><AlertOctagon size={18} /> Disputes</div>
            {stats.pendingDisputes > 0 && <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">{stats.pendingDisputes}</span>}
          </button>
          <button onClick={() => setActiveTab('users')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium text-sm ${activeTab === 'users' ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.3)]' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
            <Users size={18} /> User Moderation
          </button>
          <button onClick={() => setActiveTab('content')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium text-sm ${activeTab === 'content' ? 'bg-orange-600 text-white shadow-[0_0_15px_rgba(234,88,12,0.3)]' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
            <FileText size={18} /> Content Controls
          </button>
          <button onClick={() => setActiveTab('analytics')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium text-sm ${activeTab === 'analytics' ? 'bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
            <Briefcase size={18} /> Deep Analytics
          </button>
        </div>

        <div className="p-4 border-t border-white/5">
          <button onClick={() => navigate('/dashboard')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:text-white hover:bg-white/5 transition text-sm">
            <ChevronRight size={18} className="rotate-180" /> Exit Admin Mode
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[#020408] relative">
        
        {/* Glow Effects */}
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[150px] pointer-events-none"></div>

        {/* TOP BAR */}
        <header className="h-16 border-b border-white/5 bg-[#050810]/50 flex items-center justify-between px-8 shrink-0 z-10 backdrop-blur-md">
          <div className="relative w-96">
            <Search size={16} className="absolute left-3 top-2.5 text-gray-500" />
            <input 
              type="text" 
              placeholder="Query Database..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm text-white focus:border-blue-500 outline-none transition" 
            />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 rounded-full">System Online</span>
          </div>
        </header>

        {/* SCROLLABLE VIEW */}
        <div className="flex-1 overflow-y-auto p-8 z-10">
          
          {/* TAB 1: COMMAND CENTER */}
          {activeTab === 'dashboard' && (
            <>
              <div className="animate-in fade-in slide-in-from-bottom-4">
                <h2 className="text-3xl font-black text-white mb-8 tracking-tight">System Overview</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                  {[
                    { label: 'Total Active Users', value: stats.totalUsers, color: 'text-blue-400', border: 'border-blue-500/20', bg: 'bg-blue-500/10' },
                    { label: 'Pending Disputes', value: stats.pendingDisputes, color: 'text-rose-400', border: 'border-rose-500/20', bg: 'bg-rose-500/10' },
                    { label: 'Active Deal Rooms', value: stats.activeDeals, color: 'text-emerald-400', border: 'border-emerald-500/20', bg: 'bg-emerald-500/10' },
                    { label: 'Active Barters', value: stats.activeBarters, color: 'text-cyan-400', border: 'border-cyan-500/20', bg: 'bg-cyan-500/10' },
                  ].map((kpi, i) => (
                    <div key={i} className={`p-6 rounded-3xl border ${kpi.border} bg-[#050810] shadow-lg`}>
                      <div className={`w-10 h-10 rounded-xl ${kpi.bg} ${kpi.color} flex items-center justify-center mb-4`}>
                        <Activity size={20} />
                      </div>
                      <div className="text-4xl font-black text-white mb-1">{kpi.value}</div>
                      <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">{kpi.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              {/* SYSTEM BROADCAST WIDGET */}
              <div className="bg-[#050810] border border-cyan-500/20 rounded-3xl p-8 shadow-[0_0_30px_rgba(6,182,212,0.1)] relative overflow-hidden">
                {/* Decorative background glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-[80px] pointer-events-none"></div>
                
                <div className="flex items-center gap-3 mb-6 relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                    <Megaphone size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white">Global System Broadcast</h3>
                    <p className="text-sm text-gray-400">Transmit a high-priority alert to every active node in the ecosystem.</p>
                  </div>
                </div>

                <form onSubmit={handleBroadcast} className="relative z-10 space-y-4">
                  <textarea 
                    required 
                    rows="3" 
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    placeholder="Enter broadcast message (e.g., 'Platform scheduled maintenance at 00:00 UTC. Expect 10 mins of downtime.')" 
                    className="w-full bg-black border border-white/10 rounded-xl p-4 text-sm text-white focus:border-cyan-500 outline-none resize-none transition"
                  />
                  <div className="flex justify-end">
                    <button 
                      disabled={isBroadcasting} 
                      type="submit" 
                      className="bg-cyan-600 hover:bg-cyan-500 text-black px-6 py-3 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.4)] disabled:opacity-50"
                    >
                      {isBroadcasting ? 'TRANSMITTING...' : <><Send size={16}/> Push to All Users</>}
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}

          {/* TAB 2: DISPUTES */}
          {activeTab === 'disputes' && (
            <div className="animate-in fade-in h-full flex flex-col">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h2 className="text-2xl font-black text-white mb-1">Dispute Management Hub</h2>
                  <p className="text-sm text-gray-400">Triage and resolve conflicts across all system modules.</p>
                </div>
              </div>

              <div className="bg-[#050810] border border-white/5 rounded-3xl overflow-hidden flex-1 shadow-2xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-black/50 border-b border-white/5">
                      <th className="p-5 text-[10px] font-mono text-gray-500 uppercase tracking-widest">Status</th>
                      <th className="p-5 text-[10px] font-mono text-gray-500 uppercase tracking-widest">Module</th>
                      <th className="p-5 text-[10px] font-mono text-gray-500 uppercase tracking-widest">Reporter</th>
                      <th className="p-5 text-[10px] font-mono text-gray-500 uppercase tracking-widest">Reason</th>
                      <th className="p-5 text-[10px] font-mono text-gray-500 uppercase tracking-widest">Date</th>
                      <th className="p-5 text-[10px] font-mono text-gray-500 uppercase tracking-widest text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {disputes.length === 0 ? (
                      <tr><td colSpan="6" className="p-10 text-center text-gray-500 text-sm font-mono uppercase tracking-widest">No active disputes.</td></tr>
                    ) : (
                      disputes.map(dispute => (
                        <tr key={dispute._id} className="hover:bg-white/5 transition group cursor-pointer" onClick={() => setSelectedDispute(dispute)}>
                          <td className="p-5">
                            <span className={`px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider font-bold ${
                              dispute.status === 'Open' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                              dispute.status === 'Reviewing' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                              'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            }`}>
                              {dispute.status}
                            </span>
                          </td>
                          <td className="p-5 text-xs font-bold text-blue-400">{dispute.module}</td>
                          <td className="p-5 text-xs text-gray-300">{dispute.reporter?.name}</td>
                          <td className="p-5 text-xs text-gray-400 max-w-[200px] truncate">{dispute.reason}</td>
                          <td className="p-5 text-[10px] font-mono text-gray-500">{new Date(dispute.createdAt).toLocaleDateString()}</td>
                          <td className="p-5 text-right">
                            <button onClick={handleExportDisputes} className="flex items-center gap-2 bg-[#050810] border border-white/10 px-4 py-2 rounded-lg text-xs font-bold text-gray-300 hover:text-white hover:bg-white/5 transition"><Download size={14}/> Export CSV</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: USER MODERATION */}
          {activeTab === 'users' && (
            <div className="animate-in fade-in h-full flex flex-col">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h2 className="text-2xl font-black text-white mb-1">User Moderation</h2>
                  <p className="text-sm text-gray-400">Manage access, enforce bans, and review node activity.</p>
                </div>
              </div>

              <div className="bg-[#050810] border border-white/5 rounded-3xl overflow-hidden flex-1 shadow-2xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-black/50 border-b border-white/5">
                      <th className="p-5 text-[10px] font-mono text-gray-500 uppercase tracking-widest">User Node</th>
                      <th className="p-5 text-[10px] font-mono text-gray-500 uppercase tracking-widest">Role</th>
                      <th className="p-5 text-[10px] font-mono text-gray-500 uppercase tracking-widest">Industry</th>
                      <th className="p-5 text-[10px] font-mono text-gray-500 uppercase tracking-widest">Status</th>
                      <th className="p-5 text-[10px] font-mono text-gray-500 uppercase tracking-widest text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredUsers.map(user => (
                      <tr key={user._id} className="hover:bg-white/5 transition">
                        <td className="p-5 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-black border border-white/10 flex items-center justify-center font-bold text-white text-xs overflow-hidden">
                            {user.profilePictureUrl ? <img src={user.profilePictureUrl.startsWith('http') ? user.profilePictureUrl : `https://bizferbine-backend.onrender.com/${user.profilePictureUrl}`} className="w-full h-full object-cover"/> : user.name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-white">{user.name}</div>
                            <div className="text-[10px] font-mono text-gray-500">{user.email}</div>
                          </div>
                        </td>
                        <td className="p-5 text-xs text-gray-300">{user.role}</td>
                        <td className="p-5 text-xs text-gray-400">{user.industry || 'N/A'}</td>
                        <td className="p-5">
                          <span className={`px-2 py-1 rounded text-[10px] font-mono uppercase tracking-wider font-bold ${user.status === 'Suspended' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                            {user.status || 'Active'}
                          </span>
                        </td>
                        <td className="p-5 text-right flex flex-wrap justify-end gap-2">
    <button 
      onClick={() => handleInjectBadge(user._id)}
      className="px-3 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 bg-purple-900/20 text-purple-400 hover:bg-purple-900/40 border border-purple-700/30"
      title="Trust Oracle"
    >
      <ShieldAlert size={14}/> Badge
    </button>
    <button 
      onClick={() => handleGhostLogin(user._id)}
      className="px-3 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 bg-blue-900/20 text-blue-400 hover:bg-blue-900/40 border border-blue-700/30"
      title="Neural Override"
    >
      <Zap size={14}/> Ghost
    </button>
    {/* The New Warning Button */}
    <button 
      onClick={() => handleWarnUser(user._id)}
      className="px-3 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 bg-yellow-900/20 text-yellow-500 hover:bg-yellow-900/40 border border-yellow-700/30"
    >
      <AlertTriangle size={14}/> Warn Node
    </button>

    {/* The Existing Suspend Button */}
    <button 
      onClick={() => handleToggleSuspend(user._id)}
      className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${user.status === 'Suspended' ? 'bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/40' : 'bg-rose-900/30 text-rose-400 hover:bg-rose-900/60 border border-rose-800/50'}`}
    >
      {user.status === 'Suspended' ? <><Unlock size={14}/> Restore Access</> : <><Ban size={14}/> Suspend Node</>}
    </button>
  </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: DEEP ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="animate-in fade-in">
              <h2 className="text-3xl font-black text-white mb-2 tracking-tight">System Telemetry</h2>
              <p className="text-sm text-gray-400 mb-8">Deep insight into module utilization and ecosystem growth.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                <div className="bg-[#050810] border border-white/5 p-6 rounded-3xl shadow-lg">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4"><Users size={20} /></div>
                  <div className="text-3xl font-black text-white mb-1">{deepStats.totalMentorships}</div>
                  <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Mentorship Applications</div>
                </div>
                
                <div className="bg-[#050810] border border-white/5 p-6 rounded-3xl shadow-lg">
                  <div className="w-10 h-10 rounded-xl bg-yellow-500/10 text-yellow-400 flex items-center justify-center mb-4"><Zap size={20} /></div>
                  <div className="text-3xl font-black text-white mb-1">{deepStats.totalInsights}</div>
                  <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Insights Published</div>
                </div>

                <div className="bg-[#050810] border border-white/5 p-6 rounded-3xl shadow-lg">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4"><Network size={20} /></div>
                  <div className="text-3xl font-black text-white mb-1">{deepStats.totalConnections}</div>
                  <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Successful Connections</div>
                </div>

                <div className="bg-[#050810] border border-white/5 p-6 rounded-3xl shadow-lg">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4"><Calendar size={20} /></div>
                  <div className="text-3xl font-black text-white mb-1">{deepStats.totalEvents}</div>
                  <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Events Deployed</div>
                </div>

                <div className="bg-[#050810] border border-emerald-500/20 p-6 rounded-3xl shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4"><DollarSign size={20} /></div>
                  <div className="text-3xl font-black text-white mb-1">${deepStats.economyVolume?.toLocaleString() || 0}</div>
                  <div className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest">Ecosystem Economy Volume</div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* TAB 5: CONTENT CONTROLS */}
          {activeTab === 'content' && (
            <div className="animate-in fade-in h-full flex flex-col">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h2 className="text-2xl font-black text-white mb-1">Content Controls</h2>
                  <p className="text-sm text-gray-400">Review and wipe public Insights and Events from the ecosystem.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 overflow-hidden">
                
                {/* Insights Feed Moderation */}
                <div className="bg-[#050810] border border-white/5 rounded-3xl p-6 flex flex-col overflow-hidden shadow-2xl">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Zap className="text-yellow-400"/> Industry Insights</h3>
                  <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                    {platformContent.insights.map(insight => (
                      <div key={insight._id} className="bg-black border border-white/5 p-4 rounded-2xl relative group">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-bold text-blue-400">@{insight.author?.name}</span>
                          <span className="text-[10px] font-mono text-gray-500">{new Date(insight.createdAt).toLocaleDateString()}</span>
                        </div>
                        <h4 className="text-sm font-bold text-white mb-1">{insight.title}</h4>
                        <p className="text-xs text-gray-400 line-clamp-2">{insight.content}</p>
                        
                        {/* The Kill Switch */}
                        <button onClick={() => handleDeleteInsight(insight._id)} className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 p-2 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-lg transition">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Events Moderation */}
                <div className="bg-[#050810] border border-white/5 rounded-3xl p-6 flex flex-col overflow-hidden shadow-2xl">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Calendar className="text-emerald-400"/> Scheduled Events</h3>
                  <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                    {platformContent.events.map(event => (
                      <div key={event._id} className="bg-black border border-white/5 p-4 rounded-2xl relative group">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-bold text-emerald-400">{event.type} Event</span>
                          <span className="text-[10px] font-mono text-gray-500">{new Date(event.date).toLocaleDateString()}</span>
                        </div>
                        <h4 className="text-sm font-bold text-white mb-1">{event.title}</h4>
                        <p className="text-[10px] font-mono text-gray-400 mb-2">Org: {event.organizerId?.name}</p>
                        
                        {/* The Kill Switch */}
                        <button onClick={() => handleDeleteEvent(event._id)} className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 p-2 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-lg transition">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

      {/* DISPUTE RESOLUTION MODAL */}
      {selectedDispute && (
        <div className="fixed inset-0 z-[100] flex justify-center items-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="w-full max-w-4xl bg-[#050810] border border-rose-500/30 rounded-3xl shadow-[0_0_50px_rgba(225,29,72,0.15)] overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95">
            
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-rose-900/10 shrink-0">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2"><AlertOctagon className="text-rose-500"/> Triage Ticket #{selectedDispute._id.slice(-6).toUpperCase()}</h2>
                <p className="text-xs text-gray-400 font-mono mt-1">Module: {selectedDispute.module} | Status: {selectedDispute.status}</p>
              </div>
              <button onClick={() => setSelectedDispute(null)} className="text-gray-500 hover:text-white"><Lock size={20}/></button>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
              {/* LEFT: Ticket Details */}
              <div className="w-full lg:w-1/3 p-6 overflow-y-auto border-r border-white/5 space-y-6">
                <div>
                  <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1 block">Reporter Node</label>
                  <div className="text-sm font-bold text-white mb-4">{selectedDispute.reporter?.name}</div>
                  
                  <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1 block">Report Evidence / Reason</label>
                  <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl">
                    <p className="text-sm text-rose-200 leading-relaxed italic">"{selectedDispute.reason}"</p>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-blue-400 uppercase tracking-widest mb-2 block">Admin Resolution Notes</label>
                  <textarea 
                    rows="4" 
                    value={resolutionNote} 
                    onChange={(e) => setResolutionNote(e.target.value)} 
                    placeholder="Log your investigation findings..." 
                    className="w-full bg-black border border-white/10 rounded-xl p-4 text-sm text-white focus:border-blue-500 outline-none resize-none transition" 
                  />
                </div>
              </div>

              {/* RIGHT: CHAT LOG EVIDENCE VIEWER */}
              <div className="w-full lg:w-2/3 flex flex-col bg-[#020408]">
                <div className="p-4 border-b border-white/5 bg-black flex items-center gap-2 shrink-0">
                  <MessageSquare size={16} className="text-cyan-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-widest font-mono">Decrypted Workspace Logs</span>
                </div>

                {selectedDispute.module === 'DealRoom' && (
                  <div className="p-4 bg-rose-950/20 border-b border-rose-500/20 shrink-0 flex justify-between items-center">
                    <span className="text-xs text-rose-400 font-bold font-mono tracking-widest uppercase"><AlertTriangle size={14} className="inline mr-2"/> Deal Room Intervention</span>
                    <button onClick={async () => {
                      if(!window.confirm("VAULT QUARANTINE: Freeze this Deal Room and lock all operations?")) return;
                      try {
                        const res = await fetch(`https://bizferbine-backend.onrender.com/api/admin/deals/${selectedDispute.reportedEntityId}/freeze`, {
                          method: 'POST', headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                        });
                        if (res.ok) { alert("Vault Frozen Successfully."); fetchAdminData(); setSelectedDispute(null); }
                        else alert((await res.json()).message);
                      } catch (err) { console.error(err); }
                    }} className="bg-rose-600/20 hover:bg-rose-600/40 border border-rose-500/30 text-rose-400 px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 shadow-[0_0_15px_rgba(225,29,72,0.3)]">
                      <Lock size={14}/> Quarantine Vault
                    </button>
                  </div>
                )}
                
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {!['SkillExchange', 'DealRoom', 'Mentorship'].includes(selectedDispute.module) ? (
                    <div className="h-full flex items-center justify-center text-gray-500 text-xs font-mono uppercase tracking-widest">Logs unavailable for this module.</div>
                  ) : loadingLogs ? (
                    <div className="h-full flex items-center justify-center text-cyan-500 text-xs font-mono uppercase tracking-widest animate-pulse">Decrypting secure logs...</div>
                  ) : chatLogs.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-gray-500 text-xs font-mono uppercase tracking-widest">No chat history recorded.</div>
                  ) : (
                    chatLogs.map((msg, idx) => (
                      <div key={idx} className="bg-white/5 border border-white/5 rounded-xl p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-bold text-cyan-400">{msg.sender?.name || 'System Auto-Message'}</span>
                          <span className="text-[10px] font-mono text-gray-500">{new Date(msg.timestamp).toLocaleString()}</span>
                        </div>
                        <p className="text-sm text-gray-300 whitespace-pre-wrap">{msg.text}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-white/5 bg-black/50 flex gap-3 shrink-0">
              <button onClick={() => handleUpdateDispute(selectedDispute._id, 'Reviewing')} className="flex-1 bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-400 border border-yellow-500/30 py-3.5 rounded-xl text-xs font-bold transition">Mark as Reviewing</button>
              <button onClick={() => handleUpdateDispute(selectedDispute._id, 'Resolved')} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-black py-3.5 rounded-xl text-xs font-bold transition flex justify-center items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)]"><CheckCircle2 size={16}/> Force Resolve</button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminPanelPage;
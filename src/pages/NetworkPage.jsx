// src/pages/NetworkPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Network, UserCheck, UserX, Clock, Users } from 'lucide-react';

const NetworkPage = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();

  let loggedInUser = null;
  try {
    const userStr = localStorage.getItem('user');
    if (userStr && userStr !== "undefined") loggedInUser = JSON.parse(userStr);
  } catch (err) { console.error(err); }

  const fetchData = async () => {
    try {
      const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };
      
      // Fetch Pending Requests
      const pendingRes = await fetch('https://bizferbine-backend.onrender.com/api/network/pending', { headers });
      if (pendingRes.ok) setPendingRequests(await pendingRes.json());

      // Fetch Accepted Connections
      const connRes = await fetch('https://bizferbine-backend.onrender.com/api/network/connections', { headers });
      if (connRes.ok) setConnections(await connRes.json());
      
    } catch (err) { console.error("Network fetch error", err); } 
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (!loggedInUser?.id) navigate('/login');
    else fetchData();
  }, [navigate]);

  const handleRequest = async (requestId, status) => {
    try {
      const response = await fetch(`https://bizferbine-backend.onrender.com/api/network/connect/${requestId}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify({ status }) // 'Accepted' or 'Declined'
      });

      if (response.ok) {
        fetchData(); // Refresh the lists!
      }
    } catch (err) { console.error("Update failed", err); }
  };

  if (loading) return <div className="min-h-screen bg-[#050810] text-blue-400 flex items-center justify-center font-mono animate-pulse uppercase tracking-widest">Scanning_Network_Topology...</div>;

  return (
    <div className="min-h-screen bg-[#050810] text-gray-200 font-sans selection:bg-blue-500/30 pb-20 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[150px] pointer-events-none"></div>

      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#050810]/70 border-b border-white/5 p-4 flex justify-between items-center">
        <Link to="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-orange-400 transition group">
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-mono text-xs tracking-widest uppercase">Command Center</span>
        </Link>
      </nav>

      <main className="max-w-5xl mx-auto mt-10 px-6 relative z-10">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight flex items-center gap-4 mb-2">
            <Network className="text-orange-400" size={40} /> Network <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500">Core</span>
          </h1>
          <p className="text-gray-400 text-sm">Manage your professional graph and pending ecosystem requests.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* PENDING REQUESTS SECTION */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-white font-bold flex items-center gap-2 uppercase tracking-widest text-[10px] font-mono text-gray-500 mb-4">
              <Clock size={14} className="text-yellow-400" /> Pending Access Requests ({pendingRequests.length})
            </h2>
            
            {pendingRequests.length === 0 ? (
              <div className="bg-[#0a0f1c] border border-white/5 rounded-3xl p-10 text-center">
                <p className="text-gray-600 text-xs font-mono uppercase tracking-widest">No pending connection requests.</p>
              </div>
            ) : (
              pendingRequests.map(req => (
                <div key={req._id} className="bg-[#0a0f1c] border border-white/10 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6 shadow-lg">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-orange-600 p-[2px] shrink-0">
                    <div className="w-full h-full rounded-full bg-[#050810] flex items-center justify-center font-bold text-white overflow-hidden text-xl">
                  {req.requester?.profilePictureUrl ? <img src={req.requester.profilePictureUrl.startsWith('http') ? req.requester.profilePictureUrl : `https://bizferbine-backend.onrender.com/${req.requester.profilePictureUrl}`} className="w-full h-full object-cover" /> : req.requester?.name.charAt(0)}
                    </div>
                  </div>
                  
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-lg font-bold text-white leading-tight">{req.requester?.name}</h3>
                    {req.requester?.username && <p className="text-blue-400 font-mono text-[10px] tracking-widest mb-1">@{req.requester.username}</p>}
                    <p className="text-xs text-gray-400 line-clamp-1">{req.requester?.headline || req.requester?.role}</p>
                  </div>

                  <div className="flex gap-3 w-full md:w-auto">
                    <button onClick={() => handleRequest(req._id, 'Declined')} className="flex-1 md:flex-none px-4 py-2 bg-white/5 hover:bg-red-500/20 text-gray-300 hover:text-red-400 border border-white/10 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2">
                      <UserX size={14} /> Deny
                    </button>
                    <button onClick={() => handleRequest(req._id, 'Accepted')} className="flex-1 md:flex-none px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold transition shadow-[0_0_15px_rgba(249,115,22,0.3)] flex items-center justify-center gap-2">
                      <UserCheck size={14} /> Establish Link
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* ACTIVE CONNECTIONS SIDEBAR */}
          <div className="space-y-6">
            <h2 className="text-white font-bold flex items-center gap-2 uppercase tracking-widest text-[10px] font-mono text-gray-500 mb-4">
              <Users size={14} className="text-blue-400" /> Active Nodes ({connections.length})
            </h2>

            <div className="bg-[#0a0f1c] border border-white/10 rounded-3xl p-6 max-h-[600px] overflow-y-auto">
              {connections.length === 0 ? (
                <p className="text-gray-600 text-xs font-mono uppercase tracking-widest text-center py-10">No active connections.</p>
              ) : (
                <div className="space-y-4">
                  {connections.map(conn => (
                    <Link to={`/profile/${conn._id}`} key={conn._id} className="flex items-center gap-4 group p-2 hover:bg-white/5 rounded-xl transition">
                      <div className="w-10 h-10 rounded-full bg-[#050810] border border-white/10 shrink-0 overflow-hidden flex items-center justify-center font-bold text-white">
                    {conn.profilePictureUrl ? <img src={conn.profilePictureUrl.startsWith('http') ? conn.profilePictureUrl : `https://bizferbine-backend.onrender.com/${conn.profilePictureUrl}`} className="w-full h-full object-cover" /> : conn.name.charAt(0)}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <h3 className="font-bold text-white truncate text-sm group-hover:text-blue-400 transition">{conn.name}</h3>
                        <p className="text-[10px] text-gray-500 font-mono truncate">{conn.role}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default NetworkPage;
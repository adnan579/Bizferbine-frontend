// src/pages/SkillExchangePage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, RefreshCcw, Plus, ArrowRightLeft, Handshake, Trash2, Loader2, AlertCircle, Send, BrainCircuit, X, Inbox, CheckCircle2, LayoutDashboard } from 'lucide-react';

const SkillExchangePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Create Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createError, setCreateError] = useState('');
  const [formData, setFormData] = useState({ title: '', description: '', offeredSkills: '', requiredSkills: '' });

  // Proposal Modal State
  const [activeProposalPost, setActiveProposalPost] = useState(null);
  const [proposalMessage, setProposalMessage] = useState('');

  // MATCHING ALGORITHM STATE
  const [activeMatches, setActiveMatches] = useState(null);
  const [isMatching, setIsMatching] = useState(false);

  // VIEWING RECEIVED PROPOSALS STATE
  const [viewingProposalsFor, setViewingProposalsFor] = useState(null);

  const navigate = useNavigate();

  let loggedInUser = null;
  try {
    const userStr = localStorage.getItem('user');
    if (userStr && userStr !== "undefined") loggedInUser = JSON.parse(userStr);
  } catch (err) { console.error(err); }

  const fetchPosts = async () => {
    try {
      const response = await fetch('https://bizferbine-backend.onrender.com/api/skill-exchange', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) setPosts(await response.json());
    } catch (err) { console.error("Fetch failed", err); } 
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (!loggedInUser?.id) navigate('/login');
    else fetchPosts();
  }, [navigate]);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setCreateError('');

    const payload = {
      ...formData,
      offeredSkills: formData.offeredSkills.split(',').map(s => s.trim()).filter(s => s),
      requiredSkills: formData.requiredSkills.split(',').map(s => s.trim()).filter(s => s)
    };

    try {
      const response = await fetch('https://bizferbine-backend.onrender.com/api/skill-exchange', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      
      if (response.ok) {
        setIsCreateOpen(false);
        setFormData({ title: '', description: '', offeredSkills: '', requiredSkills: '' });
        fetchPosts();
      } else {
        setCreateError(data.message);
      }
    } catch (err) { setCreateError('Server Connection Error.'); } 
    finally { setIsSubmitting(false); }
  };

  const handleSendProposal = async (e) => {
    e.preventDefault();
    if (!proposalMessage.trim()) return;

    try {
      const response = await fetch(`https://bizferbine-backend.onrender.com/api/skill-exchange/${activeProposalPost._id}/propose`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ message: proposalMessage })
      });
      const data = await response.json();
      
      if (response.ok) {
        alert("Proposal Sent Successfully! The user has been notified.");
        setActiveProposalPost(null);
        setProposalMessage('');
        setActiveMatches(null); 
        fetchPosts();
      } else {
        alert(data.message); 
      }
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Retract this trade offer permanently?')) return;
    try {
      const response = await fetch(`https://bizferbine-backend.onrender.com/api/skill-exchange/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) setPosts(posts.filter(p => p._id !== id));
    } catch (err) { console.error(err); }
  };

  const handleRunMatchmaker = async (postId) => {
    setIsMatching(true);
    try {
      const response = await fetch(`https://bizferbine-backend.onrender.com/api/skill-exchange/${postId}/matches`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setActiveMatches(data.matches);
      }
    } catch (err) {
      console.error("Matching algorithm failed", err);
    } finally {
      setIsMatching(false);
    }
  };

  // --- UPGRADED: ACCEPT PROPOSAL LOGIC ---
  const handleAcceptProposal = async (postId, partnerId) => {
    try {
      const response = await fetch('https://bizferbine-backend.onrender.com/api/barter-workspace/accept-proposal', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify({ postId, partnerId })
      });
      
      const data = await response.json();
      
      // If success OR if the workspace already exists, we route them!
      if (response.ok || (response.status === 400 && data.message.includes('already exists'))) {
        navigate('/barter-workspace');
      } else {
        alert(data.message || 'Failed to accept proposal.');
      }
    } catch (err) {
      console.error("Failed to accept proposal", err);
      alert("Server Connection Error");
    }
  };

  if (loading) return <div className="min-h-screen bg-[#050810] text-cyan-400 flex items-center justify-center font-mono animate-pulse uppercase tracking-widest">Scanning_Marketplace_Vectors...</div>;

  return (
    <div className="min-h-screen bg-[#050810] text-gray-200 font-sans selection:bg-cyan-500/30 pb-20 relative overflow-hidden">
      
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[150px] pointer-events-none"></div>

      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#050810]/70 border-b border-white/5 p-4 flex justify-between items-center">
        <Link to="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition group">
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-mono text-xs tracking-widest uppercase hidden sm:inline">Command Center</span>
        </Link>
        
        <div className="flex items-center gap-3">
          {/* NEW: DIRECT LINK TO WORKSPACES */}
          <Link to="/barter-workspace" className="flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/10 transition">
            <LayoutDashboard size={14} /> <span className="hidden sm:inline">Active Workspaces</span>
          </Link>
          
          <button onClick={() => setIsCreateOpen(true)} className="bg-cyan-600 hover:bg-cyan-500 text-black px-5 py-2.5 rounded-full text-xs font-bold transition shadow-[0_0_15px_rgba(6,182,212,0.4)] flex items-center gap-2">
            <Plus size={16} /> Propose Trade
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto mt-10 px-6 relative z-10">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight flex items-center gap-4 mb-2">
            <RefreshCcw className="text-cyan-400" size={40} /> Skill <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Exchange</span>
          </h1>
          <p className="text-gray-400 text-sm max-w-xl">Bypass financial friction. Barter your professional skills directly with other nodes in the network.</p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl bg-[#0a0f1c]/50">
            <ArrowRightLeft size={48} className="mx-auto text-gray-600 mb-4" />
            <p className="text-gray-500 font-mono text-sm uppercase tracking-widest">No active trade proposals.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {posts.map(post => {
              const isMine = post.user?._id === loggedInUser.id;
              const hasProposed = post.proposals?.some(p => p.senderId === loggedInUser.id);
              const proposalCount = post.proposals?.length || 0;

              return (
                <div key={post._id} className="bg-[#0a0f1c] border border-white/10 rounded-3xl p-6 hover:border-cyan-500/30 transition-all duration-300 group relative flex flex-col">
                  
                  {isMine && (
                    <button onClick={() => handleDelete(post._id)} className="absolute top-4 right-4 p-2 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition">
                      <Trash2 size={16} />
                    </button>
                  )}

                  <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4 pr-8">
                    <div className="w-10 h-10 rounded-full bg-[#050810] border border-white/10 shrink-0 overflow-hidden flex items-center justify-center font-bold text-white">
                      {post.user?.profilePictureUrl ? <img src={`https://bizferbine-backend.onrender.com/${post.user.profilePictureUrl}`} className="w-full h-full object-cover" alt="avatar" /> : post.user?.name?.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white leading-tight">{post.user?.name}</h3>
                      <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">{post.user?.role}</p>
                    </div>
                  </div>

                  <h2 className="text-xl font-bold text-white mb-4">{post.title}</h2>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 bg-black/50 p-4 rounded-2xl border border-white/5">
                    <div className="flex-1 text-center sm:text-left w-full">
                      <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2">Offering</p>
                      <div className="flex flex-wrap gap-1 justify-center sm:justify-start">
                        {post.offeredSkills?.map(s => <span key={s} className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded-md border border-cyan-500/20">{s}</span>)}
                      </div>
                    </div>
                    <ArrowRightLeft className="text-gray-600 shrink-0 rotate-90 sm:rotate-0 my-2" size={20} />
                    <div className="flex-1 text-center sm:text-right w-full">
                      <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2">Seeking</p>
                      <div className="flex flex-wrap gap-1 justify-center sm:justify-end">
                         {post.requiredSkills?.map(s => <span key={s} className="text-xs font-bold text-purple-400 bg-purple-500/10 px-2 py-1 rounded-md border border-purple-500/20">{s}</span>)}
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-400 mb-6 flex-1">{post.description}</p>
                  
                  {/* Action Footer */}
                  <div className="mt-auto">
                    {isMine ? (
                       <div className="flex gap-3">
                         <button 
                            onClick={() => handleRunMatchmaker(post._id)} 
                            className="flex-1 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/30 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition flex justify-center items-center gap-2"
                         >
                           {isMatching ? <Loader2 size={16} className="animate-spin" /> : <BrainCircuit size={16} />}
                           Matchmaker
                         </button>

                         <button 
                            onClick={() => proposalCount > 0 ? setViewingProposalsFor(post) : null}
                            className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition flex justify-center items-center gap-2 ${proposalCount > 0 ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 text-gray-500 border border-white/10 cursor-not-allowed'}`}
                         >
                           <Inbox size={16} /> 
                           Proposals ({proposalCount})
                         </button>
                       </div>
                    ) : hasProposed ? (
                       <button disabled className="w-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 py-3 rounded-xl text-xs font-bold uppercase tracking-widest cursor-not-allowed flex items-center justify-center gap-2">
                         <CheckCircle2 size={16} /> Proposal Sent
                       </button>
                    ) : (
                       <button onClick={() => setActiveProposalPost(post)} className="w-full bg-cyan-600/10 hover:bg-cyan-600/20 border border-cyan-500/30 text-cyan-400 py-3 rounded-xl text-xs font-bold transition flex justify-center items-center gap-2">
                         <Handshake size={16} /> Send Proposal
                       </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* --- VIEW RECEIVED PROPOSALS MODAL --- */}
      {viewingProposalsFor && (
        <div className="fixed inset-0 z-[100] flex justify-center items-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl bg-[#0a0f1c] border border-emerald-500/30 rounded-3xl shadow-[0_0_50px_rgba(16,185,129,0.15)] p-8 animate-in zoom-in-95 duration-200 max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center mb-6 shrink-0">
              <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                <Inbox className="text-emerald-400" /> RECEIVED PROPOSALS
              </h2>
              <button onClick={() => setViewingProposalsFor(null)} className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-4">
              {viewingProposalsFor.proposals?.map(prop => (
                <div key={prop._id} className="bg-black border border-emerald-500/20 p-5 rounded-2xl flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                  <div className="flex-1">
                    <p className="text-xs text-gray-400 font-mono uppercase tracking-widest mb-2">Proposal Message:</p>
                    <p className="text-sm text-gray-200 bg-white/5 p-3 rounded-xl border border-white/5">"{prop.message}"</p>
                  </div>
                  <button 
                    onClick={() => handleAcceptProposal(viewingProposalsFor._id, prop.senderId)} 
                    className="w-full md:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-black rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                  >
                    <CheckCircle2 size={16} /> Accept Trade
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MATCHMAKER MODAL */}
      {activeMatches !== null && (
        <div className="fixed inset-0 z-[100] flex justify-center items-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl bg-[#0a0f1c] border border-blue-500/30 rounded-3xl shadow-[0_0_50px_rgba(59,130,246,0.15)] p-8 animate-in zoom-in-95 duration-200 max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center mb-6 shrink-0">
              <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                <BrainCircuit className="text-blue-400" /> SYSTEM MATCHES FOUND: {activeMatches.length}
              </h2>
              <button onClick={() => setActiveMatches(null)} className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-4">
              {activeMatches.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-white/10 rounded-2xl">
                  <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">No perfect two-way matches found yet.<br/>Expand your required skills.</p>
                </div>
              ) : (
                activeMatches.map(match => (
                  <div key={match._id} className="bg-black border border-blue-500/20 p-4 rounded-2xl flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#050810] border border-white/10 shrink-0 overflow-hidden flex items-center justify-center font-bold text-white">
                        {match.user?.name?.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">{match.title}</h3>
                        <p className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">By @{match.user?.name}</p>
                      </div>
                    </div>
                    <button onClick={() => setActiveProposalPost(match)} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0">
                      <Handshake size={14} /> Connect
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* CREATE BARTER MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-[100] flex justify-center items-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl bg-[#0a0f1c] border border-white/10 rounded-3xl shadow-2xl p-8 animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-black text-white tracking-tight mb-6">DEPLOY TRADE VECTOR</h2>
            
            {createError && (
              <div className="mb-6 bg-red-500/10 border border-red-500/50 rounded-xl p-4 flex items-start gap-3 text-sm text-red-200">
                <AlertCircle size={20} className="text-red-400 shrink-0" /> {createError}
              </div>
            )}

            <form onSubmit={handleCreatePost} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-white uppercase tracking-widest">Proposal Title</label>
                <input required type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="e.g. Will build API for Logo Design" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-cyan-500 outline-none transition" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">You Are Offering (CSV)</label>
                  <input required type="text" value={formData.offeredSkills} onChange={(e) => setFormData({...formData, offeredSkills: e.target.value})} placeholder="e.g. Node.js, React, MongoDB" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-cyan-500 outline-none transition font-mono" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-purple-400 uppercase tracking-widest">You Are Seeking (CSV)</label>
                  <input required type="text" value={formData.requiredSkills} onChange={(e) => setFormData({...formData, requiredSkills: e.target.value})} placeholder="e.g. Graphic Design, Figma" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-purple-500 outline-none transition font-mono" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Terms & Scope</label>
                <textarea required rows="4" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Describe exactly what you need and what you will deliver in return..." className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-cyan-500 outline-none resize-none transition" />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsCreateOpen(false)} className="flex-1 bg-white/5 hover:bg-white/10 text-white py-4 rounded-xl text-sm font-bold transition">Cancel</button>
                <button disabled={isSubmitting} type="submit" className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-black py-4 rounded-xl text-sm font-bold transition shadow-[0_0_15px_rgba(6,182,212,0.4)] flex justify-center items-center gap-2">
                  {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : 'Publish Trade Offer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PROPOSAL MESSAGE MODAL */}
      {activeProposalPost && (
        <div className="fixed inset-0 z-[100] flex justify-center items-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-[#0a0f1c] border border-white/10 rounded-3xl shadow-2xl p-8 animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-black text-white tracking-tight mb-2">Send Proposal</h2>
            <p className="text-sm text-gray-400 mb-6">Proposing a trade to <span className="text-cyan-400">@{activeProposalPost.user?.username || activeProposalPost.user?.name}</span></p>
            
            <form onSubmit={handleSendProposal} className="space-y-4">
              <textarea 
                required rows="4" 
                value={proposalMessage} 
                onChange={(e) => setProposalMessage(e.target.value)} 
                placeholder="Explain why you are a good match for this trade..." 
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-cyan-500 outline-none resize-none transition" 
              />
              <div className="flex gap-3">
                <button type="button" onClick={() => setActiveProposalPost(null)} className="flex-1 bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl text-sm font-bold transition">Cancel</button>
                <button type="submit" className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-black py-3 rounded-xl text-sm font-bold transition flex justify-center items-center gap-2">
                  <Send size={16} /> Transmit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default SkillExchangePage;
// src/pages/DealsPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Briefcase, ChevronLeft, ShieldCheck, Send, Plus, DollarSign, CheckCircle2, XCircle, Clock, FileText, Trash2, Share2, Paperclip, AlertCircle } from 'lucide-react';

const DealsPage = () => {
  const [deals, setDeals] = useState([]);
  const [activeDeal, setActiveDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createError, setCreateError] = useState('');
  const [newDealForm, setNewDealForm] = useState({ title: '', description: '', targetParticipantId: '' });
  
  const [proposalMsg, setProposalMsg] = useState('');
  const [proposalAmt, setProposalAmt] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const navigate = useNavigate();

  let loggedInUser = null;
  try {
    const userStr = localStorage.getItem('user');
    if (userStr && userStr !== "undefined") loggedInUser = JSON.parse(userStr);
  } catch (err) { console.error(err); }

  const fetchDeals = async () => {
    try {
      const response = await fetch('https://bizferbine-backend.onrender.com/api/deals', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setDeals(data);
        if (activeDeal) {
          const updatedActive = data.find(d => d._id === activeDeal._id);
          if (updatedActive) setActiveDeal(updatedActive);
        }
      }
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (!loggedInUser?.id) navigate('/login');
    else fetchDeals();
  }, [navigate]);

  // CREATE DEAL WITH ERROR HANDLING
  const handleCreateDeal = async (e) => {
    e.preventDefault();
    setCreateError('');
    try {
      const response = await fetch('https://bizferbine-backend.onrender.com/api/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(newDealForm)
      });
      const data = await response.json();
      
      if (response.ok) {
        setIsCreateOpen(false);
        setNewDealForm({ title: '', description: '', targetParticipantId: '' });
        fetchDeals(); 
      } else {
        setCreateError(data.message); // Displays the "Invalid ID" error!
      }
    } catch (err) { setCreateError("Server Connection Error."); }
  };

  // SEND PROPOSAL
  const handleSendProposal = async (e) => {
    e.preventDefault();
    if (!proposalMsg.trim()) return;

    try {
      const response = await fetch(`https://bizferbine-backend.onrender.com/api/deals/${activeDeal._id}/proposals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ message: proposalMsg, amount: Number(proposalAmt) || 0 })
      });
      if (response.ok) {
        setProposalMsg(''); setProposalAmt(''); fetchDeals(); 
      }
    } catch (err) { console.error(err); }
  };

  // UPLOAD SECURE DOCUMENT
  const handleDocumentUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);

    const formData = new FormData();
    formData.append('document', file);

    try {
      const response = await fetch(`https://bizferbine-backend.onrender.com/api/deals/${activeDeal._id}/documents`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: formData
      });
      if (response.ok) fetchDeals();
    } catch (err) { console.error("Upload failed", err); }
    finally { setIsUploading(false); }
  };

  const handleUpdateStatus = async (newStatus) => {
    if(!window.confirm(`Mark this deal as ${newStatus}?`)) return;
    try {
      const response = await fetch(`https://bizferbine-backend.onrender.com/api/deals/${activeDeal._id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) fetchDeals();
    } catch (err) { console.error(err); }
  };

  // DELETE DEAL
  const handleDeleteDeal = async () => {
    if(!window.confirm(`Are you absolutely sure you want to permanently destroy this Deal Room?`)) return;
    try {
      const response = await fetch(`https://bizferbine-backend.onrender.com/api/deals/${activeDeal._id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        setActiveDeal(null);
        fetchDeals();
      }
    } catch (err) { console.error(err); }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`Deal ID for Invite: ${activeDeal._id}`);
    alert('Deal ID copied to clipboard! Send this to your counterparty.');
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Open': return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      case 'Negotiating': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'Accepted': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'Closed': return 'text-red-400 bg-red-500/10 border-red-500/30';
      case 'Frozen': return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  if (loading) return <div className="min-h-screen bg-[#050810] text-blue-400 flex items-center justify-center font-mono animate-pulse uppercase tracking-widest">Accessing_Secure_Vault...</div>;

  return (
    <div className="min-h-screen bg-[#050810] text-gray-200 font-sans selection:bg-blue-500/30 flex flex-col h-screen overflow-hidden">
      
      <nav className="shrink-0 z-50 backdrop-blur-xl bg-[#050810]/70 border-b border-white/5 p-4 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="p-2 text-gray-400 hover:text-blue-400 transition bg-white/5 rounded-full">
            <ChevronLeft size={20} />
          </Link>
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-emerald-400" size={24} />
            <h1 className="text-xl font-black text-white tracking-tight uppercase">Quantum Deal Rooms</h1>
          </div>
        </div>
        <button onClick={() => setIsCreateOpen(true)} className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-full text-xs font-bold transition shadow-[0_0_15px_rgba(37,99,235,0.3)] flex items-center gap-2">
          <Plus size={14} /> Initialize Vector
        </button>
      </nav>

      <div className="flex-1 flex overflow-hidden">
        
        <aside className="w-full md:w-1/3 lg:w-1/4 border-r border-white/5 bg-[#0a0f1c]/50 overflow-y-auto">
          <div className="p-4 border-b border-white/5">
            <h2 className="text-xs font-mono text-gray-500 uppercase tracking-widest">Active Negotiations</h2>
          </div>
          {deals.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-xs font-mono">No encrypted rooms found.</div>
          ) : (
            <div className="flex flex-col">
              {deals.map(deal => (
                <button 
                  key={deal._id} onClick={() => setActiveDeal(deal)}
                  className={`p-5 text-left border-b border-white/5 hover:bg-white/5 transition relative ${activeDeal?._id === deal._id ? 'bg-blue-600/10 border-l-2 border-l-blue-500' : 'border-l-2 border-l-transparent'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-white truncate pr-4">{deal.title}</h3>
                    <span className={`text-[9px] font-mono px-2 py-0.5 rounded border uppercase tracking-wider ${getStatusColor(deal.status)}`}>{deal.status}</span>
                  </div>
                  <p className="text-xs text-gray-400 line-clamp-2">{deal.description}</p>
                </button>
              ))}
            </div>
          )}
        </aside>

        <main className="flex-1 bg-[#050810] flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 blur-[100px] pointer-events-none"></div>

          {!activeDeal ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <Briefcase size={48} className="text-gray-800 mb-6" />
              <h2 className="text-xl font-bold text-white mb-2">Secure Vault Sealed</h2>
              <p className="text-sm text-gray-500 font-mono max-w-md">Select a Quantum Deal Room from the sidebar to access encrypted negotiation flows and financial proposals.</p>
            </div>
          ) : (
            <>
              {/* DEAL HEADER */}
              <div className="p-6 border-b border-white/5 bg-[#0a0f1c]/80 backdrop-blur-md flex justify-between items-center z-10 shrink-0">
                <div>
                  <h2 className="text-2xl font-black text-white mb-1">{activeDeal.title}</h2>
                  <div className="flex items-center gap-3 text-xs">
                    <span className={`font-mono px-2 py-0.5 rounded border uppercase tracking-wider ${getStatusColor(activeDeal.status)}`}>{activeDeal.status}</span>
                    <span className="text-gray-500 font-mono flex items-center gap-2">
                      ID: {activeDeal._id}
                      <button onClick={handleShare} className="hover:text-blue-400 transition" title="Copy Room ID"><Share2 size={12} /></button>
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {(activeDeal.status === 'Open' || activeDeal.status === 'Negotiating') && (
                    <>
                      <button onClick={() => handleUpdateStatus('Accepted')} className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1"><CheckCircle2 size={14} /> Accept</button>
                      <button onClick={() => handleUpdateStatus('Closed')} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1"><XCircle size={14} /> Close</button>
                    </>
                  )}
                  {activeDeal.initiator === loggedInUser.id && (
                    <button onClick={handleDeleteDeal} className="ml-2 p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition" title="Destroy Room"><Trash2 size={16}/></button>
                  )}
                </div>
              </div>

              {/* NEGOTIATION FEED */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth z-10">
                <div className="bg-black/50 border border-white/5 p-5 rounded-2xl max-w-2xl text-sm text-gray-300">
                  <div className="flex items-center gap-2 mb-2 text-blue-400 font-mono text-[10px] uppercase tracking-widest"><FileText size={12} /> Initial Deal Parameters</div>
                  {activeDeal.description}
                </div>

                {/* Shared Documents Display */}
                {activeDeal.documents?.length > 0 && (
                   <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-4">
                     {activeDeal.documents.map((docPath, i) => (
                        <a href={`https://bizferbine-backend.onrender.com/${docPath}`} target="_blank" rel="noreferrer" key={i} className="bg-white/5 border border-white/10 hover:border-blue-500/50 p-4 rounded-xl flex items-center gap-3 transition group">
                           <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg group-hover:scale-110 transition"><FileText size={16}/></div>
                           <div className="text-xs text-gray-300 font-mono truncate">Doc_Vector_{i+1}</div>
                        </a>
                     ))}
                   </div>
                )}

                {activeDeal.proposals.map((prop, idx) => {
                  const isMe = prop.senderId === loggedInUser.id;
                  return (
                    <div key={idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      <div className={`max-w-xl p-4 rounded-2xl border ${isMe ? 'bg-blue-600/10 border-blue-500/20 rounded-tr-sm text-right' : 'bg-white/5 border-white/10 rounded-tl-sm'}`}>
                        <p className="text-sm text-gray-200">{prop.message}</p>
                        {prop.amount > 0 && (
                          <div className={`mt-3 p-3 rounded-xl border flex items-center gap-3 ${isMe ? 'bg-blue-950/50 border-blue-500/30' : 'bg-emerald-950/50 border-emerald-500/30'}`}>
                            <div className={`p-2 rounded-lg ${isMe ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400'}`}><DollarSign size={16} /></div>
                            <div className="text-left">
                              <div className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Proposed Vector</div>
                              <div className={`text-lg font-black ${isMe ? 'text-blue-400' : 'text-emerald-400'}`}>${prop.amount.toLocaleString()}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* INPUT AREA */}
              {(activeDeal.status === 'Open' || activeDeal.status === 'Negotiating') ? (
                <div className="p-4 bg-[#0a0f1c]/90 border-t border-white/5 backdrop-blur-xl shrink-0 z-10 flex gap-4 items-center">
                  
                  {/* DOCUMENT UPLOAD BUTTON */}
                  <label className={`p-3 rounded-xl border border-white/10 text-gray-400 hover:text-blue-400 hover:border-blue-500/30 transition cursor-pointer ${isUploading ? 'opacity-50' : ''}`}>
                    <Paperclip size={20} />
                    <input type="file" hidden onChange={handleDocumentUpload} disabled={isUploading} />
                  </label>

                  <form onSubmit={handleSendProposal} className="flex-1 flex gap-4">
                    <input 
                      type="text" required placeholder="Transmit encrypted proposal..." 
                      value={proposalMsg} onChange={(e) => setProposalMsg(e.target.value)}
                      className="flex-1 bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition"
                    />
                    <div className="w-40 relative">
                      <span className="absolute left-4 top-3.5 text-gray-500"><DollarSign size={14}/></span>
                      <input 
                        type="number" placeholder="Amount (Opt)" 
                        value={proposalAmt} onChange={(e) => setProposalAmt(e.target.value)}
                        className="w-full h-full bg-black border border-white/10 rounded-xl pl-9 pr-4 text-sm text-emerald-400 focus:outline-none focus:border-emerald-500 transition font-mono"
                      />
                    </div>
                    <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-6 rounded-xl flex items-center justify-center transition shadow-[0_0_15px_rgba(37,99,235,0.3)]">
                      <Send size={18} />
                    </button>
                  </form>
                </div>
              ) : (
                <div className="p-4 bg-black/50 border-t border-white/5 text-center text-xs font-mono text-gray-500 uppercase tracking-widest shrink-0 z-10">
                  Negotiation window is sealed ({activeDeal.status})
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* CREATE DEAL MODAL WITH ERROR HANDLING */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-[100] flex justify-center items-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-[#0a0f1c] border border-white/10 rounded-3xl shadow-2xl p-8 animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-black text-white tracking-tight mb-6">INITIALIZE SECURE DEAL ROOM</h2>
            
            {createError && (
              <div className="mb-6 bg-red-500/10 border border-red-500/50 rounded-xl p-4 flex items-start gap-3 text-sm text-red-200">
                <AlertCircle size={20} className="text-red-400 shrink-0" /> {createError}
              </div>
            )}

            <form onSubmit={handleCreateDeal} className="space-y-4">
              <div>
                <label className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">Project / Deal Name</label>
                <input required type="text" value={newDealForm.title} onChange={(e) => setNewDealForm({...newDealForm, title: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none mt-1" />
              </div>
              <div>
                <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Terms & Scope</label>
                <textarea required rows="4" value={newDealForm.description} onChange={(e) => setNewDealForm({...newDealForm, description: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none resize-none mt-1" />
              </div>
              <div>
                <label className="text-[10px] font-mono text-purple-400 uppercase tracking-widest">Invite Counterparty (User ID) - Optional</label>
                <input type="text" placeholder="e.g. 64b7c8f9..." value={newDealForm.targetParticipantId} onChange={(e) => setNewDealForm({...newDealForm, targetParticipantId: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-purple-500 outline-none mt-1 font-mono" />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsCreateOpen(false)} className="flex-1 bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl text-sm font-bold transition">Cancel</button>
                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl text-sm font-bold transition shadow-[0_0_15px_rgba(37,99,235,0.4)]">Launch Room</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default DealsPage;
// src/pages/DealsPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Briefcase, ChevronLeft, ShieldCheck, Send, Plus, DollarSign, CheckCircle2, XCircle, Clock, FileText, Trash2, Share2, Paperclip, AlertCircle, ShieldAlert, Download, MessageSquare, Handshake, Check } from 'lucide-react';
import { useAutonomicGovernor } from '../hooks/useAutonomicGovernor';
import apiClient from '../utils/apiClient';

const DealsPage = () => {
  const [deals, setDeals] = useState([]);
  const [activeDeal, setActiveDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createError, setCreateError] = useState('');
  const [newDealForm, setNewDealForm] = useState({ title: '', type: 'Partnership', amount: '', description: '', targetParticipantId: '' });

  const [proposalMsg, setProposalMsg] = useState('');
  const [proposalAmt, setProposalAmt] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const { isCompromised, stabilityScore } = useAutonomicGovernor();

  const navigate = useNavigate();

  let loggedInUser = null;
  try {
    const userStr = localStorage.getItem('user');
    if (userStr && userStr !== "undefined") loggedInUser = JSON.parse(userStr);
  } catch (err) { console.error(err); }

  const fetchDeals = async () => {
    try {
      const response = await apiClient.get('/deals');
      if (response.ok) {
        const data = await response.json();
        setDeals(data);
        if (activeDeal && data) {
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
      const submissionData = { ...newDealForm };
      if (newDealForm.amount) submissionData.description = `[Proposed Value: $${newDealForm.amount}] ` + submissionData.description;

      const response = await apiClient.post('/deals', {
        body: JSON.stringify(submissionData)
      });
      const data = await response.json();

      if (response.ok) {
        setIsCreateOpen(false);
        setNewDealForm({ title: '', type: 'Partnership', amount: '', description: '', targetParticipantId: '' });
        fetchDeals();
      } else {
        setCreateError(data.message);
      }
    } catch (err) { setCreateError("Server Connection Error."); }
  };

  // SEND PROPOSAL
  const handleSendProposal = async (e) => {
    e.preventDefault();
    if (!proposalMsg.trim()) return;

    try {
      const response = await apiClient.post(`/deals/${activeDeal._id}/proposals`, {
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
      // apiClient naturally omits Content-Type for FormData objects, enabling browser multipart boundary creation
      const response = await apiClient.post(`/deals/${activeDeal._id}/documents`, {
        body: formData
      });
      if (response.ok) fetchDeals();
    } catch (err) { console.error("Upload failed", err); }
    finally { setIsUploading(false); }
  };

  const handleUpdateStatus = async (newStatus) => {
    if (!window.confirm(`Mark this deal as ${newStatus}?`)) return;
    try {
      const response = await apiClient.put(`/deals/${activeDeal._id}/status`, {
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) fetchDeals();
    } catch (err) { console.error(err); }
  };

  // DELETE DEAL
  const handleDeleteDeal = async () => {
    if (!window.confirm(`Are you absolutely sure you want to permanently destroy this Deal Room?`)) return;
    try {
      const response = await apiClient.delete(`/deals/${activeDeal._id}`);
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
    switch (status) {
      case 'Open': return 'bg-slate-100 text-slate-600';
      case 'Negotiating': return 'bg-[#faeeda] text-[#ba7517]';
      case 'Accepted': return 'bg-[#eaf3de] text-[#1d9e75]';
      case 'Closed': return 'bg-slate-100 text-slate-600';
      case 'Frozen': return 'bg-red-50 text-red-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  // Pipeline Metrics
  const totalPipelineValue = deals.reduce((sum, d) => {
    if (['Open', 'Negotiating'].includes(d.status)) {
      const amt = d.proposals?.length ? d.proposals[d.proposals.length - 1].amount : 0;
      return sum + (Number(amt) || 0);
    }
    return sum;
  }, 0);
  const openNegotiationsCount = deals.filter(d => ['Open', 'Negotiating'].includes(d.status)).length;
  const closedTransactionsCount = deals.filter(d => ['Accepted', 'Closed'].includes(d.status)).length;
  const flaggedRisksCount = deals.filter(d => d.status === 'Frozen').length;

  const PIPELINE_STEPS = ['draft', 'submitted', 'review', 'negotiation', 'agreed', 'closed', 'cancelled'];
  const getActiveStepIndex = (status) => {
    switch (status) {
      case 'Open': return 1;
      case 'Frozen': return 2;
      case 'Negotiating': return 3;
      case 'Accepted': return 4;
      case 'Closed': return 5;
      default: return 1;
    }
  };

  const filteredDeals = deals.filter(d => {
    if (activeTab === 'Sent') return d.initiator === loggedInUser?.id;
    if (activeTab === 'Received') return d.initiator !== loggedInUser?.id;
    if (activeTab === 'Closed') return ['Closed', 'Accepted'].includes(d.status);
    return true;
  });

  if (loading) return <div className="min-h-screen bg-slate-50 text-[#185fa5] flex items-center justify-center font-sans animate-pulse font-bold tracking-wide">Loading Enterprise Workspace...</div>;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col overflow-y-auto">
      {/* Header */}
      <header className="bg-[#185fa5] sticky top-0 z-50 shadow-md h-16 flex items-center shrink-0">
        <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="text-white/80 hover:text-white transition">
              <ChevronLeft size={24} />
            </Link>
            <Link to="/dashboard" className="flex items-center gap-2 text-white no-underline">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center font-bold text-sm">Bz</div>
              <span className="text-xl font-bold tracking-tight">Bizzua</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#0c447c] via-[#185fa5] to-[#378add] pt-10 pb-8 shrink-0 shadow-inner">
        <div className="max-w-7xl mx-auto px-6 flex items-end justify-between flex-wrap gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight mb-1">Deal Room</h1>
            <p className="text-sm text-white/80">Manage proposals, negotiate terms, and close deals — all in a secure workspace.</p>
          </div>
          <button onClick={() => setIsCreateOpen(true)} className="h-10 px-5 rounded-lg bg-white text-[#185fa5] font-bold text-sm flex items-center gap-2 hover:opacity-90 transition">
            <Plus size={16} /> New Proposal
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 flex-1 w-full">
        {/* Metrics Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex gap-3 items-center shadow-sm">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#e6f1fb] text-[#185fa5] shrink-0"><DollarSign size={20} /></div>
            <div>
              <div className="text-2xl font-extrabold text-slate-900 leading-none">${totalPipelineValue.toLocaleString()}</div>
              <div className="text-xs font-medium text-slate-400 mt-1">Total Global Pipeline Value</div>
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex gap-3 items-center shadow-sm">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#faeeda] text-[#ba7517] shrink-0"><Briefcase size={20} /></div>
            <div>
              <div className="text-2xl font-extrabold text-slate-900 leading-none">{openNegotiationsCount}</div>
              <div className="text-xs font-medium text-slate-400 mt-1">Open Negotiations</div>
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex gap-3 items-center shadow-sm">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#eaf3de] text-[#1d9e75] shrink-0"><Handshake size={20} /></div>
            <div>
              <div className="text-2xl font-extrabold text-slate-900 leading-none">{closedTransactionsCount}</div>
              <div className="text-xs font-medium text-slate-400 mt-1">Closed Transactions</div>
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex gap-3 items-center shadow-sm">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-rose-50 text-rose-500 shrink-0"><ShieldAlert size={20} /></div>
            <div>
              <div className="text-2xl font-extrabold text-slate-900 leading-none">{flaggedRisksCount}</div>
              <div className="text-xs font-medium text-slate-400 mt-1">Flagged Risks</div>
            </div>
          </div>
        </div>

        {/* Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-6 items-start">

          {/* Left Column: Deal List */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex border-b-2 border-slate-100 mb-5">
              {['All', 'Sent', 'Received', 'Closed'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 text-sm font-semibold border-b-2 -mb-[2px] transition ${activeTab === tab ? 'border-[#185fa5] text-[#185fa5]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
                  {tab === 'All' ? 'All deals' : tab}
                </button>
              ))}
            </div>

            <div>
              {filteredDeals.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-sm">No proposals found for this view.</div>
              ) : (
                filteredDeals.map((deal, i) => (
                  <div
                    key={deal._id} onClick={() => setActiveDeal(deal)}
                    className={`border rounded-xl p-4 mb-3 cursor-pointer transition animate-in fade-in slide-in-from-bottom-2 ${activeDeal?._id === deal._id ? 'border-[#185fa5] bg-[#e6f1fb]' : 'border-slate-200 bg-white hover:border-blue-200 hover:shadow-[0_4px_14px_rgba(24,95,165,0.08)]'}`}
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    <div className="flex justify-between items-start mb-2 gap-3">
                      <h3 className="font-bold text-slate-900 text-sm leading-tight group-hover:text-[#185fa5] transition-colors">{deal.title}</h3>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full shrink-0 ${getStatusColor(deal.status)}`}>{deal.status}</span>
                    </div>
                    <div className="text-xs text-slate-500 mb-3 flex items-center gap-1.5"><Briefcase size={12} /> {deal.dealType || 'Partnership'}</div>
                    <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
                      <span className="flex items-center gap-1"><DollarSign size={12} /> {deal.proposals?.length ? deal.proposals[deal.proposals.length - 1].amount?.toLocaleString() : 0}</span>
                      <span className="flex items-center gap-1"><Clock size={12} /> {new Date(deal.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column: Sticky Detail Panel */}
          <div className="sticky top-24">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col overflow-hidden" style={{ maxHeight: 'calc(100vh - 8rem)' }}>
              {!activeDeal ? (
                <div className="flex-1 flex items-center justify-center p-10 text-center text-slate-400 flex-col">
                  <Briefcase size={48} className="mb-4 text-slate-200" />
                  <p className="text-sm">Select a deal to view details, documents, and timeline.</p>
                </div>
              ) : (
                <>
                  {/* Detail Header */}
                  <div className="p-5 border-b border-slate-100 shrink-0 bg-white">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-extrabold text-slate-900 text-lg mb-1">{activeDeal.title}</h3>
                        <p className="text-xs text-slate-500 font-mono">Counterparty ID: {activeDeal.participants[0] || 'Pending'}</p>
                      </div>
                      <button onClick={handleShare} className="text-[#185fa5] hover:bg-[#e6f1fb] p-2 rounded-lg transition" title="Share Deal ID"><Share2 size={16} /></button>
                    </div>

                    {/* Horizontal Pipeline Track */}
                    <div className="mt-6 flex items-center gap-1 overflow-x-auto pb-2 scrollbar-hide w-full">
                      {PIPELINE_STEPS.map((step, idx) => {
                        const activeIdx = getActiveStepIndex(activeDeal.status);
                        const isPast = idx < activeIdx;
                        const isActive = idx === activeIdx;
                        return (
                          <div key={step} className="flex items-center shrink-0">
                            <div className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border flex items-center gap-1 transition-all ${isActive ? 'bg-[#185fa5] border-[#185fa5] text-white shadow-md' :
                                isPast ? 'bg-[#e6f1fb] border-[#b5d4f4] text-[#185fa5]' :
                                  'bg-slate-50 border-slate-200 text-slate-400'
                              }`}>
                              {isPast && <Check size={10} />}
                              {step}
                            </div>
                            {idx < PIPELINE_STEPS.length - 1 && (
                              <div className={`w-3 h-0.5 mx-1 rounded-full ${isPast ? 'bg-[#185fa5]' : 'bg-slate-200'}`} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="flex-1 overflow-y-auto p-5 space-y-8 bg-slate-50/50">
                    {/* Team Contact Triggers */}
                    <div>
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Direct Team Contact</h4>
                      <div className="flex gap-3">
                        <button className="flex-1 bg-white border border-slate-200 hover:border-[#185fa5] hover:shadow-sm text-slate-700 hover:text-[#185fa5] py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"><MessageSquare size={14} /> Dispatch Message</button>
                        <button className="flex-1 bg-white border border-slate-200 hover:border-[#185fa5] hover:shadow-sm text-slate-700 hover:text-[#185fa5] py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"><Handshake size={14} /> Schedule Sync</button>
                      </div>
                    </div>

                    {/* Documents List */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contract Files & Metadata</h4>
                        <label className={`text-[10px] font-bold text-[#185fa5] bg-[#e6f1fb] hover:bg-[#d0e5f7] px-2 py-1 rounded cursor-pointer transition flex items-center gap-1 ${isUploading ? 'opacity-50' : ''}`}>
                          <Plus size={12} /> New File
                          <input type="file" hidden onChange={handleDocumentUpload} disabled={isUploading} />
                        </label>
                      </div>

                      {activeDeal.documents?.length === 0 ? (
                        <p className="text-xs text-slate-500 italic p-4 text-center bg-white border border-slate-200 border-dashed rounded-xl">No files attached to this deal.</p>
                      ) : (
                        <div className="space-y-2">
                          {activeDeal.documents.map((docPath, i) => (
                            <div key={i} className="flex items-center justify-between p-3 border border-slate-200 rounded-xl bg-white hover:border-[#185fa5] hover:shadow-sm transition group">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded bg-red-50 text-red-500 flex items-center justify-center shrink-0 group-hover:bg-[#185fa5] group-hover:text-white transition-colors"><FileText size={14} /></div>
                                <div>
                                  <div className="text-sm font-semibold text-slate-800">Deal_Contract_v{i + 1}.pdf</div>
                                  <div className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">Master Agreement / NDA</div>
                                </div>
                              </div>
                              <a href={`https://bizferbine-backend.onrender.com/${docPath}`} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-[#185fa5] bg-slate-50 hover:bg-[#e6f1fb] p-2 rounded-lg transition"><Download size={14} /></a>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Step History / Negotiation Feed */}
                    <div>
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Step History & Negotiations</h4>
                      {isCompromised && (
                        <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl flex items-start gap-2 mb-4">
                          <ShieldAlert className="text-rose-500 shrink-0 mt-0.5" size={16} />
                          <div>
                            <h4 className="text-rose-700 font-bold text-xs uppercase tracking-wider mb-1">Lockout Engaged</h4>
                            <p className="text-rose-600/80 text-[11px] leading-tight">Stability score critically low ({stabilityScore}/100). Binding contract executions disabled. See Aegis Protocol.</p>
                          </div>
                        </div>
                      )}

                      {activeDeal.proposals?.length === 0 ? (
                        <p className="text-xs text-slate-500 italic text-center p-4">No messages yet. Start the negotiation below.</p>
                      ) : (
                        <div className="space-y-4">
                          {activeDeal.proposals.map((prop, idx) => {
                            const isMe = prop.senderId === loggedInUser?.id;
                            return (
                              <div key={idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                <div className={`max-w-[85%] p-3.5 rounded-2xl text-xs shadow-sm ${isMe ? 'bg-[#185fa5] text-white rounded-tr-sm' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm'}`}>
                                  <p className="leading-relaxed">{prop.message}</p>
                                  {prop.amount > 0 && (
                                    <div className={`mt-2 p-2 rounded-lg flex items-center gap-2 ${isMe ? 'bg-white/20' : 'bg-slate-50 border border-slate-100'}`}>
                                      <DollarSign size={14} className={isMe ? 'text-white' : 'text-[#1d9e75]'} />
                                      <span className={`font-bold ${isMe ? 'text-white' : 'text-slate-800'}`}>${prop.amount.toLocaleString()}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Footer */}
                  <div className="p-4 border-t border-slate-200 bg-white shrink-0">
                    {(activeDeal.status === 'Open' || activeDeal.status === 'Negotiating') ? (
                      <form onSubmit={handleSendProposal} className="flex flex-col gap-3">
                        <div className="flex gap-2">
                          <input type="text" required placeholder="Type negotiation message..." value={proposalMsg} onChange={(e) => setProposalMsg(e.target.value)} className="flex-1 border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:border-[#185fa5] focus:ring-2 focus:ring-[#185fa5]/20 outline-none transition" />
                          <div className="relative w-32">
                            <DollarSign size={14} className="absolute left-2.5 top-3 text-slate-400" />
                            <input type="number" placeholder="Offer" value={proposalAmt} onChange={(e) => setProposalAmt(e.target.value)} className="w-full border border-slate-300 rounded-lg pl-7 pr-3 py-2.5 text-sm focus:border-[#185fa5] focus:ring-2 focus:ring-[#185fa5]/20 outline-none transition" />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button type="submit" className="flex-[2] bg-[#185fa5] hover:bg-[#0c447c] text-white py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"><Send size={14} /> Transmit</button>
                          <button type="button" disabled={isCompromised} onClick={() => handleUpdateStatus('Accepted')} className={`flex-1 text-white py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm ${isCompromised ? 'bg-slate-300 cursor-not-allowed' : 'bg-[#1d9e75] hover:bg-[#15805e]'}`}><CheckCircle2 size={14} /> Accept</button>
                          <button type="button" onClick={() => handleUpdateStatus('Closed')} className="flex-1 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5"><XCircle size={14} /> Decline</button>
                        </div>
                      </form>
                    ) : (
                      <div className="text-center py-3 text-xs font-bold text-slate-500 uppercase tracking-widest bg-slate-50 rounded-lg border border-slate-200">
                        Transaction is {activeDeal.status}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* CREATE DEAL MODAL WITH ERROR HANDLING */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-[100] flex justify-center items-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-8 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-extrabold text-slate-900">Submit a new proposal</h2>
              <button onClick={() => setIsCreateOpen(false)} className="text-slate-400 hover:text-slate-700 transition"><XCircle size={20} /></button>
            </div>

            {createError && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 text-sm text-red-700">
                <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" /> {createError}
              </div>
            )}

            <form onSubmit={handleCreateDeal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Deal Title</label>
                <input required type="text" placeholder="e.g. SaaS Integration Partnership" value={newDealForm.title} onChange={(e) => setNewDealForm({ ...newDealForm, title: e.target.value })} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:border-[#185fa5] focus:ring-2 focus:ring-[#185fa5]/20 outline-none transition" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Deal Type</label>
                  <select value={newDealForm.type} onChange={(e) => setNewDealForm({ ...newDealForm, type: e.target.value })} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:border-[#185fa5] focus:ring-2 focus:ring-[#185fa5]/20 outline-none transition bg-white">
                    <option>Partnership</option>
                    <option>Licensing</option>
                    <option>Distribution</option>
                    <option>Investment</option>
                    <option>Service Agreement</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Initial Value ($)</label>
                  <input type="number" placeholder="e.g. 50000" value={newDealForm.amount} onChange={(e) => setNewDealForm({ ...newDealForm, amount: e.target.value })} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:border-[#185fa5] focus:ring-2 focus:ring-[#185fa5]/20 outline-none transition" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Counterparty (User ID)</label>
                <input type="text" placeholder="Company or person ID" value={newDealForm.targetParticipantId} onChange={(e) => setNewDealForm({ ...newDealForm, targetParticipantId: e.target.value })} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:border-[#185fa5] focus:ring-2 focus:ring-[#185fa5]/20 outline-none transition" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea required rows="3" placeholder="Describe the deal, goals, and expected outcomes..." value={newDealForm.description} onChange={(e) => setNewDealForm({ ...newDealForm, description: e.target.value })} className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:border-[#185fa5] focus:ring-2 focus:ring-[#185fa5]/20 outline-none resize-none transition" />
              </div>
              <button type="submit" className="w-full bg-[#185fa5] hover:bg-[#0c447c] text-white py-3 rounded-lg text-sm font-bold transition mt-2 flex items-center justify-center gap-2">Submit Proposal <Send size={14} /></button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default DealsPage;
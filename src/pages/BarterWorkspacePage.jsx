// src/pages/BarterWorkspacePage.jsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, ArrowRightLeft, Send, CheckCircle2, PlayCircle, AlertOctagon, Clock, Star, X, Calendar, Video, Link as LinkIcon, Flag, Loader2 } from 'lucide-react';

const BarterWorkspacePage = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [activeWorkspace, setActiveWorkspace] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // REVIEW MODAL STATE
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, text: '' });

  // SCHEDULE SYNC MODAL STATE
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({ title: '', date: '', link: '' });

  // --- NEW: DISPUTE / REPORT MODAL STATE ---
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [isReporting, setIsReporting] = useState(false);
  
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  let loggedInUser = null;
  try {
    const userStr = localStorage.getItem('user');
    if (userStr && userStr !== "undefined") loggedInUser = JSON.parse(userStr);
  } catch (err) { console.error(err); }

  const fetchWorkspaces = async () => {
    try {
      const res = await fetch('https://bizferbine-backend.onrender.com/api/barter-workspace', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setWorkspaces(data);
        if (activeWorkspace) {
          setActiveWorkspace(data.find(w => w._id === activeWorkspace._id));
        }
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (!loggedInUser?.id) navigate('/login');
    else fetchWorkspaces();
    // eslint-disable-next-line
  }, [navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeWorkspace?.messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !activeWorkspace) return;

    try {
      const res = await fetch(`https://bizferbine-backend.onrender.com/api/barter-workspace/${activeWorkspace._id}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ text: message })
      });
      if (res.ok) {
        setMessage('');
        fetchWorkspaces();
      }
    } catch (err) { console.error(err); }
  };

  const handleUpdateStatus = async (newStatus) => {
    if (!window.confirm(`Update workspace status to ${newStatus}?`)) return;
    try {
      const res = await fetch(`https://bizferbine-backend.onrender.com/api/barter-workspace/${activeWorkspace._id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) fetchWorkspaces();
    } catch (err) { console.error(err); }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    const otherUser = activeWorkspace.initiator._id === loggedInUser.id ? activeWorkspace.partner : activeWorkspace.initiator;

    try {
      const response = await fetch(`https://bizferbine-backend.onrender.com/api/profile/${otherUser._id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ workspaceId: activeWorkspace._id, rating: reviewForm.rating, text: reviewForm.text })
      });
      const data = await response.json();
      if (response.ok) {
        alert("Review submitted! It is now permanently on their profile.");
        setIsReviewOpen(false);
        setReviewForm({ rating: 5, text: '' });
      } else {
        alert(data.message); 
      }
    } catch (err) { console.error(err); }
  };

  const handleScheduleSync = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://bizferbine-backend.onrender.com/api/barter-workspace/${activeWorkspace._id}/schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(scheduleForm)
      });
      if (response.ok) {
        setIsScheduleOpen(false);
        setScheduleForm({ title: '', date: '', link: '' });
        fetchWorkspaces(); 
      } else {
        alert("Failed to schedule sync.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- NEW: SUBMIT DISPUTE FUNCTION ---
  const handleReportIssue = async (e) => {
    e.preventDefault();
    setIsReporting(true);
    try {
      const response = await fetch('https://bizferbine-backend.onrender.com/api/disputes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({
          reportedEntityId: activeWorkspace._id,
          module: 'SkillExchange', // Matches your enum!
          reason: reportReason
        })
      });
      
      const data = await response.json();
      if (response.ok) {
        alert("Issue reported to the Admin Overseer. We will investigate immediately.");
        setIsReportOpen(false);
        setReportReason('');
        
        // Optionally auto-update status to "Disputed"
        handleUpdateStatus('Disputed'); 
      } else {
        alert(data.message || "Failed to submit report.");
      }
    } catch (err) {
      console.error("Report Error:", err);
    } finally {
      setIsReporting(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Negotiating': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'In Progress': return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      case 'Completed': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'Disputed': return 'text-red-400 bg-red-500/10 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  if (loading) return <div className="min-h-screen bg-[#050810] text-cyan-400 flex items-center justify-center font-mono animate-pulse uppercase tracking-widest">Loading_Workspaces...</div>;

  const otherUser = activeWorkspace ? (activeWorkspace.initiator._id === loggedInUser.id ? activeWorkspace.partner : activeWorkspace.initiator) : null;

  return (
    <div className="min-h-screen bg-[#050810] text-gray-200 font-sans selection:bg-cyan-500/30 flex flex-col h-screen overflow-hidden">
      
      <nav className="shrink-0 z-50 backdrop-blur-xl bg-[#050810]/70 border-b border-white/5 p-4 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <Link to="/skill-exchange" className="p-2 text-gray-400 hover:text-cyan-400 transition bg-white/5 rounded-full">
            <ChevronLeft size={20} />
          </Link>
          <div className="flex items-center gap-3">
            <ArrowRightLeft className="text-cyan-400" size={24} />
            <h1 className="text-xl font-black text-white tracking-tight uppercase hidden sm:inline">Active Barter Workspaces</h1>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex overflow-hidden relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-600/5 rounded-full blur-[150px] pointer-events-none"></div>

        <aside className="w-full md:w-1/3 lg:w-1/4 border-r border-white/5 bg-[#0a0f1c]/50 overflow-y-auto z-10 flex flex-col">
          {workspaces.length === 0 ? (
            <div className="p-8 text-center flex flex-col items-center gap-3">
              <p className="text-gray-500 text-xs font-mono uppercase tracking-widest leading-relaxed">No active trade workspaces.</p>
            </div>
          ) : (
            workspaces.map(ws => {
              const partnerNode = ws.initiator._id === loggedInUser.id ? ws.partner : ws.initiator;
              return (
                <button 
                  key={ws._id}
                  onClick={() => setActiveWorkspace(ws)}
                  className={`w-full p-5 flex flex-col text-left border-b border-white/5 hover:bg-white/5 transition relative ${activeWorkspace?._id === ws._id ? 'bg-cyan-500/10 border-l-2 border-l-cyan-500' : 'border-l-2 border-l-transparent'}`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-white truncate text-sm flex-1 pr-2">{ws.barterPost?.title}</h3>
                    <span className={`text-[9px] font-mono px-2 py-0.5 rounded border uppercase tracking-wider shrink-0 ${getStatusColor(ws.status)}`}>{ws.status}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#050810] border border-white/10 flex items-center justify-center text-xs font-bold text-cyan-400 overflow-hidden">
                      {partnerNode?.profilePictureUrl ? <img src={partnerNode.profilePictureUrl.startsWith('http') ? partnerNode.profilePictureUrl : `https://bizferbine-backend.onrender.com/${partnerNode.profilePictureUrl}`} className="w-full h-full object-cover" /> : partnerNode?.name?.charAt(0)}
                    </div>
                    <span className="text-xs text-gray-400">Trading with {partnerNode?.name}</span>
                  </div>
                </button>
              )
            })
          )}
        </aside>

        <main className="flex-1 bg-transparent flex flex-col relative z-10">
          {!activeWorkspace ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <ArrowRightLeft size={48} className="text-gray-800 mb-6" />
              <h2 className="text-xl font-bold text-white mb-2">Workspace Idle</h2>
              <p className="text-sm text-gray-500 font-mono max-w-md">Select a workspace to track execution status and chat with your trade partner.</p>
            </div>
          ) : (
            <>
              {/* WORKSPACE HEADER */}
              <div className="p-4 border-b border-white/5 bg-[#0a0f1c]/80 backdrop-blur-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
                <div>
                  <h2 className="text-lg font-bold text-white leading-tight">{activeWorkspace.barterPost?.title}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Status:</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${getStatusColor(activeWorkspace.status)}`}>{activeWorkspace.status}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-black/50 p-1.5 rounded-xl border border-white/10 flex-wrap">
                  
                  <button onClick={() => setIsScheduleOpen(true)} className="px-4 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]">
                    <Calendar size={14}/> Schedule Sync
                  </button>

                  <div className="w-px h-6 bg-white/10 mx-1"></div>

                  <button onClick={() => handleUpdateStatus('Negotiating')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${activeWorkspace.status === 'Negotiating' ? 'bg-yellow-500/20 text-yellow-400' : 'text-gray-500 hover:text-yellow-400'}`}><Clock size={14}/> Negotiating</button>
                  <button onClick={() => handleUpdateStatus('In Progress')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${activeWorkspace.status === 'In Progress' ? 'bg-blue-500/20 text-blue-400' : 'text-gray-500 hover:text-blue-400'}`}><PlayCircle size={14}/> In Progress</button>
                  <button onClick={() => handleUpdateStatus('Completed')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${activeWorkspace.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-500 hover:text-emerald-400'}`}><CheckCircle2 size={14}/> Completed</button>
                  
                  <div className="w-px h-6 bg-white/10 mx-1"></div>

                  {/* NEW: REPORT ISSUE BUTTON */}
                  <button onClick={() => setIsReportOpen(true)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${activeWorkspace.status === 'Disputed' ? 'bg-red-500/20 text-red-400' : 'text-rose-500/70 hover:text-rose-400 hover:bg-rose-500/10'}`}>
                    <Flag size={14}/> Report Issue
                  </button>

                </div>
              </div>

              {/* CHAT FEED */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth flex flex-col">
                
                {activeWorkspace.status === 'Completed' && (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 text-center animate-in fade-in slide-in-from-top-4 mb-4">
                    <CheckCircle2 size={32} className="mx-auto text-emerald-400 mb-3" />
                    <h3 className="text-lg font-bold text-white mb-2">Trade Completed Successfully</h3>
                    <p className="text-sm text-emerald-100/70 mb-4 max-w-sm mx-auto">Please leave a rating and review for @{otherUser?.name}. This builds their trust score in the ecosystem.</p>
                    <button onClick={() => setIsReviewOpen(true)} className="bg-emerald-600 hover:bg-emerald-500 text-black px-6 py-2.5 rounded-full text-xs font-bold transition flex justify-center items-center gap-2 mx-auto shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                      <Star size={16} className="fill-black" /> Rate Partner
                    </button>
                  </div>
                )}

                {activeWorkspace.messages.map((msg) => {
                  const isMe = msg.sender === loggedInUser.id;
                  
                  if (msg.type === 'System_Meeting' && msg.meetingDetails) {
                    return (
                      <div key={msg._id} className="w-full flex justify-center my-4 animate-in fade-in zoom-in-95">
                        <div className="bg-[#050810]/80 backdrop-blur-md border border-blue-500/30 w-full max-w-sm rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(37,99,235,0.15)]">
                          <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 p-4 border-b border-white/5 flex items-center justify-between">
                            <h4 className="font-bold text-white text-sm flex items-center gap-2">
                              <Calendar size={16} className="text-blue-400" />
                              Scheduled Video Sync
                            </h4>
                          </div>
                          <div className="p-5 text-center">
                            <p className="text-lg font-black text-white mb-1">{msg.meetingDetails.title}</p>
                            <p className="text-sm text-blue-400 font-mono mb-6 bg-blue-500/10 inline-block px-3 py-1 rounded-lg border border-blue-500/20">
                              {new Date(msg.meetingDetails.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                            </p>
                            <a href={msg.meetingDetails.link} target="_blank" rel="noreferrer" className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl text-sm font-bold transition flex justify-center items-center gap-2">
                              <Video size={18} /> Join Secure Meeting
                            </a>
                            <p className="text-[9px] text-gray-500 font-mono mt-4 uppercase tracking-widest">
                              Scheduled by {isMe ? 'You' : otherUser?.name}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={msg._id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      <div className={`max-w-md px-5 py-3 rounded-2xl ${isMe ? 'bg-cyan-600 text-black rounded-br-sm font-medium' : 'bg-white/10 text-gray-200 border border-white/5 rounded-bl-sm'}`}>
                        <p className="text-sm">{msg.text}</p>
                      </div>
                      <span className="text-[9px] text-gray-600 font-mono mt-1 px-2 uppercase">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* INPUT */}
              <div className="p-4 bg-[#0a0f1c]/90 border-t border-white/5 backdrop-blur-xl shrink-0">
                <form onSubmit={handleSendMessage} className="flex gap-3">
                  <input 
                    type="text" required placeholder="Coordinate the exchange..." 
                    value={message} onChange={(e) => setMessage(e.target.value)}
                    disabled={activeWorkspace.status === 'Completed'}
                    className="flex-1 bg-black border border-white/10 rounded-full px-6 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition disabled:opacity-50"
                  />
                  <button type="submit" disabled={activeWorkspace.status === 'Completed'} className="bg-cyan-600 hover:bg-cyan-500 text-black p-3 rounded-full flex items-center justify-center transition shadow-[0_0_15px_rgba(6,182,212,0.4)] disabled:opacity-50">
                    <Send size={18} className="ml-1" />
                  </button>
                </form>
              </div>
            </>
          )}
        </main>
      </div>

      {/* SCHEDULE SYNC MODAL */}
      {isScheduleOpen && (
        <div className="fixed inset-0 z-[100] flex justify-center items-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[#0a0f1c] border border-blue-500/30 rounded-3xl shadow-[0_0_50px_rgba(59,130,246,0.15)] p-8 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                <Calendar className="text-blue-400" /> SCHEDULE SYNC
              </h2>
              <button onClick={() => setIsScheduleOpen(false)} className="text-gray-400 hover:text-white"><X size={20}/></button>
            </div>
            
            <form onSubmit={handleScheduleSync} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest ml-1">Meeting Agenda</label>
                <input required type="text" value={scheduleForm.title} onChange={(e) => setScheduleForm({...scheduleForm, title: e.target.value})} placeholder="e.g. Design Architecture Review" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none transition" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest ml-1">Date & Time</label>
                <input required type="datetime-local" value={scheduleForm.date} onChange={(e) => setScheduleForm({...scheduleForm, date: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-300 focus:border-blue-500 outline-none transition [color-scheme:dark]" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest ml-1">Video Link (Zoom/Meet/Teams)</label>
                <div className="relative">
                  <LinkIcon size={16} className="absolute left-4 top-3.5 text-gray-500" />
                  <input required type="url" value={scheduleForm.link} onChange={(e) => setScheduleForm({...scheduleForm, link: e.target.value})} placeholder="https://zoom.us/j/..." className="w-full bg-black border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-blue-400 font-mono focus:border-blue-500 outline-none transition" />
                </div>
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl text-sm font-bold transition flex justify-center items-center gap-2 shadow-[0_0_15px_rgba(37,99,235,0.4)] mt-4">
                <Calendar size={16} /> Dispatch Calendar Invite
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- NEW: REPORT ISSUE MODAL --- */}
      {isReportOpen && (
        <div className="fixed inset-0 z-[100] flex justify-center items-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-[#0a0f1c] border border-rose-500/30 rounded-3xl shadow-[0_0_50px_rgba(225,29,72,0.15)] p-8 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2 text-rose-400">
                <Flag size={20} /> REPORT AN ISSUE
              </h2>
              <button onClick={() => setIsReportOpen(false)} className="text-gray-400 hover:text-white"><X size={20}/></button>
            </div>
            
            <p className="text-sm text-gray-400 mb-6">If your trade partner is unresponsive, not delivering agreed work, or violating terms, log a dispute. Our Admin Overseers will review the workspace communications.</p>

            <form onSubmit={handleReportIssue} className="space-y-6">
              <div>
                <label className="text-[10px] font-mono text-rose-400 uppercase tracking-widest mb-2 block">Reason for Dispute</label>
                <textarea 
                  required rows="4" 
                  value={reportReason} 
                  onChange={(e) => setReportReason(e.target.value)} 
                  placeholder="Clearly explain what happened. Admins will review the chat logs to verify your claims..." 
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-rose-500 outline-none resize-none transition" 
                />
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => setIsReportOpen(false)} className="flex-1 bg-white/5 hover:bg-white/10 text-white py-4 rounded-xl text-sm font-bold transition">Cancel</button>
                <button disabled={isReporting} type="submit" className="flex-1 bg-rose-600 hover:bg-rose-500 text-white py-4 rounded-xl text-sm font-bold transition flex justify-center items-center gap-2 shadow-[0_0_15px_rgba(225,29,72,0.4)]">
                  {isReporting ? <Loader2 size={18} className="animate-spin" /> : 'Submit Dispute'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RATING MODAL (Remains unchanged) */}
      {isReviewOpen && (
        <div className="fixed inset-0 z-[100] flex justify-center items-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-[#0a0f1c] border border-emerald-500/30 rounded-3xl shadow-[0_0_50px_rgba(16,185,129,0.15)] p-8 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-white tracking-tight">EVALUATE TRADE</h2>
              <button onClick={() => setIsReviewOpen(false)} className="text-gray-400 hover:text-white"><X size={20}/></button>
            </div>
            
            <form onSubmit={handleSubmitReview} className="space-y-6">
              <div className="flex flex-col items-center gap-4 bg-black/30 p-6 rounded-2xl border border-white/5">
                <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Rate @{otherUser?.username || otherUser?.name}</p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button" onClick={() => setReviewForm({...reviewForm, rating: star})} className={`transition-transform hover:scale-110 ${reviewForm.rating >= star ? 'text-yellow-400' : 'text-gray-700'}`}>
                      <Star size={36} className={reviewForm.rating >= star ? 'fill-yellow-400' : ''} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-2 block">Public Feedback</label>
                <textarea required rows="3" value={reviewForm.text} onChange={(e) => setReviewForm({...reviewForm, text: e.target.value})} placeholder="How was the experience? Was the work delivered on time?" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-emerald-500 outline-none resize-none transition" />
              </div>

              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-black py-4 rounded-xl text-sm font-bold transition flex justify-center items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                Submit Public Review
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default BarterWorkspacePage;
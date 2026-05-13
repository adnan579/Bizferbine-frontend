// src/pages/MentorshipPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, BrainCircuit, Users, Send, CheckCircle2, XCircle, Search, Plus, Calendar, Clock, Loader2, Sparkles } from 'lucide-react';

const MentorshipPage = () => {
  const [activeTab, setActiveTab] = useState('active'); // 'active', 'matchmaker', 'apply'
  const [loading, setLoading] = useState(true);
  
  // Data States
  const [activeRequests, setActiveRequests] = useState([]);
  const [algorithmicMatches, setAlgorithmicMatches] = useState([]);
  
  // Form States
  const [applyForm, setApplyForm] = useState({ title: '', description: '' });
  const [isApplying, setIsApplying] = useState(false);
  
  // Offer Modal State
  const [activeOfferApp, setActiveOfferApp] = useState(null);
  const [offerMessage, setOfferMessage] = useState('');

  const navigate = useNavigate();

  let loggedInUser = null;
  try {
    const userStr = localStorage.getItem('user');
    if (userStr && userStr !== "undefined") loggedInUser = JSON.parse(userStr);
  } catch (err) { console.error(err); }

  // --- FETCH DATA ---
  const fetchActiveRequests = async () => {
    try {
      const res = await fetch('https://bizferbine-backend.onrender.com/api/mentorship', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) setActiveRequests(await res.json());
    } catch (err) { console.error(err); }
  };

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://bizferbine-backend.onrender.com/api/mentorship-board/matches', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAlgorithmicMatches(data.matches || []);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (!loggedInUser?.id) navigate('/login');
    else {
      fetchActiveRequests();
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    if (activeTab === 'matchmaker') fetchMatches();
  }, [activeTab]);

  // --- ACTIONS ---
  const handleApply = async (e) => {
    e.preventDefault();
    setIsApplying(true);
    try {
      const res = await fetch('https://bizferbine-backend.onrender.com/api/mentorship-board/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(applyForm)
      });
      if (res.ok) {
        alert('Mentorship Application Broadcasted Successfully!');
        setApplyForm({ title: '', description: '' });
        setActiveTab('active');
      } else {
        const data = await res.json();
        alert(data.message);
      }
    } catch (err) { console.error(err); }
    finally { setIsApplying(false); }
  };

  const handleSendOffer = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`https://bizferbine-backend.onrender.com/api/mentorship-board/${activeOfferApp._id}/offer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ message: offerMessage })
      });
      if (res.ok) {
        alert('Offer Sent to Mentee!');
        setActiveOfferApp(null);
        setOfferMessage('');
        fetchMatches(); // refresh matches
      } else {
        const data = await res.json();
        alert(data.message);
      }
    } catch (err) { console.error(err); }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await fetch(`https://bizferbine-backend.onrender.com/api/mentorship/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ status })
      });
      if (res.ok) fetchActiveRequests();
    } catch (err) { console.error(err); }
  };

  if (loading && activeTab === 'active') return <div className="min-h-screen bg-[#050810] text-purple-400 flex items-center justify-center font-mono animate-pulse uppercase tracking-widest">Loading Mentorship Vectors...</div>;

  return (
    <div className="min-h-screen bg-[#050810] text-gray-200 font-sans selection:bg-purple-500/30 pb-20 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none"></div>

      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#050810]/70 border-b border-white/5 p-4 flex justify-between items-center">
        <Link to="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition group">
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-mono text-xs tracking-widest uppercase">Command Center</span>
        </Link>
      </nav>

      <main className="max-w-6xl mx-auto mt-10 px-6 relative z-10">
        
        <div className="mb-10 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-6 border-b border-white/5 pb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight flex items-center justify-center md:justify-start gap-4 mb-2">
              <BrainCircuit className="text-purple-400" size={40} /> Algorithmic <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">Mentorship</span>
            </h1>
            <p className="text-gray-400 text-sm max-w-xl">Accelerate your growth. Connect with industry veterans or guide the next generation of founders.</p>
          </div>
        </div>

        {/* TABS */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button onClick={() => setActiveTab('active')} className={`px-6 py-3 rounded-full text-xs font-bold transition flex items-center gap-2 ${activeTab === 'active' ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.4)]' : 'bg-[#0a0f1c] text-gray-400 border border-white/5 hover:text-white'}`}>
            <Clock size={16} /> Direct Requests & Active
          </button>
          <button onClick={() => setActiveTab('matchmaker')} className={`px-6 py-3 rounded-full text-xs font-bold transition flex items-center gap-2 ${activeTab === 'matchmaker' ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.4)]' : 'bg-[#0a0f1c] text-gray-400 border border-white/5 hover:text-white'}`}>
            <Sparkles size={16} /> Mentor Matchmaker
          </button>
          <button onClick={() => setActiveTab('apply')} className={`px-6 py-3 rounded-full text-xs font-bold transition flex items-center gap-2 ${activeTab === 'apply' ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'bg-[#0a0f1c] text-gray-400 border border-white/5 hover:text-white'}`}>
            <Plus size={16} /> Apply for a Mentor
          </button>
        </div>

        {/* TAB 1: ACTIVE REQUESTS */}
        {activeTab === 'active' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white mb-4">Your Mentorship Connections</h2>
            {activeRequests.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl bg-[#0a0f1c]/50">
                <Users size={48} className="mx-auto text-gray-600 mb-4" />
                <p className="text-gray-500 font-mono text-sm uppercase tracking-widest">No active requests.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeRequests.map(req => {
                  const isMentor = req.mentor === loggedInUser.id;
                  return (
                    <div key={req._id} className="bg-[#0a0f1c] border border-white/10 rounded-3xl p-6 relative flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                        <span className={`text-[10px] font-mono px-3 py-1 rounded-full uppercase tracking-widest ${
                          req.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : 
                          req.status === 'Accepted' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                          'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}>
                          {req.status}
                        </span>
                        <span className="text-[10px] bg-purple-500/10 text-purple-400 px-3 py-1 rounded-full border border-purple-500/20 font-mono uppercase tracking-widest">
                          {isMentor ? 'You are the Mentor' : 'You are the Mentee'}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-300 mb-4 bg-black/50 p-4 rounded-xl border border-white/5 italic">"{req.message}"</p>
                      
                      {req.scheduledSession && (
                        <div className="flex items-center gap-2 text-xs text-blue-400 bg-blue-500/10 p-3 rounded-xl border border-blue-500/20 mb-4 font-mono">
                          <Calendar size={14} /> Requested Time: {new Date(req.scheduledSession).toLocaleString()}
                        </div>
                      )}

                      {/* Mentor Actions */}
                      {isMentor && req.status === 'Pending' && (
                        <div className="flex gap-3 mt-auto">
                          <button onClick={() => handleUpdateStatus(req._id, 'Accepted')} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-black py-2.5 rounded-xl text-xs font-bold transition flex justify-center items-center gap-2">
                            <CheckCircle2 size={16}/> Accept
                          </button>
                          <button onClick={() => handleUpdateStatus(req._id, 'Declined')} className="flex-1 bg-red-900/30 hover:bg-red-900/50 text-red-400 border border-red-800/50 py-2.5 rounded-xl text-xs font-bold transition flex justify-center items-center gap-2">
                            <XCircle size={16}/> Decline
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MENTOR MATCHMAKER */}
        {activeTab === 'matchmaker' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="bg-indigo-900/20 border border-indigo-500/20 p-6 rounded-3xl mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2"><Sparkles className="text-indigo-400"/> AI Matchmaker Active</h2>
                <p className="text-sm text-indigo-200/70">Scanning the ecosystem for open applications that match your specific industry expertise.</p>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-10"><Loader2 size={32} className="animate-spin text-indigo-400 mx-auto" /></div>
            ) : algorithmicMatches.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl bg-[#0a0f1c]/50">
                <Search size={48} className="mx-auto text-gray-600 mb-4" />
                <p className="text-gray-500 font-mono text-sm uppercase tracking-widest">No industry matches found right now.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {algorithmicMatches.map(app => (
                  <div key={app._id} className="bg-[#0a0f1c] border border-white/10 rounded-3xl p-6 hover:border-indigo-500/30 transition-all flex flex-col">
                    <div className="flex items-center gap-3 mb-4 border-b border-white/5 pb-4">
                      <div className="w-10 h-10 rounded-full bg-[#050810] border border-white/10 flex items-center justify-center font-bold text-white">
                        {app.mentee?.name?.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">{app.mentee?.name}</h3>
                        <p className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest">{app.industry}</p>
                      </div>
                    </div>
                    
                    <h4 className="text-md font-bold text-white mb-2">{app.title}</h4>
                    <p className="text-sm text-gray-400 mb-6 flex-1">{app.description}</p>
                    
                    <button onClick={() => setActiveOfferApp(app)} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl text-xs font-bold transition flex justify-center items-center gap-2 shadow-[0_0_15px_rgba(79,70,229,0.3)]">
                      <Send size={16}/> Send Mentorship Offer
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: APPLY FOR MENTOR */}
        {activeTab === 'apply' && (
          <div className="max-w-2xl mx-auto bg-[#0a0f1c] border border-white/10 rounded-3xl p-8 shadow-2xl animate-in zoom-in-95">
            <h2 className="text-2xl font-black text-white mb-2">Deploy Mentorship Application</h2>
            <p className="text-sm text-gray-400 mb-8">Broadcast your goals to the network. Our algorithm will notify verified mentors in your industry.</p>
            
            <form onSubmit={handleApply} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">Target Goal / Title</label>
                <input required type="text" value={applyForm.title} onChange={(e) => setApplyForm({...applyForm, title: e.target.value})} placeholder="e.g. Need guidance scaling a SaaS startup" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none transition" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">Detailed Context</label>
                <textarea required rows="5" value={applyForm.description} onChange={(e) => setApplyForm({...applyForm, description: e.target.value})} placeholder="Explain where you are currently at, the roadblocks you are facing, and exactly what kind of guidance you need..." className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none resize-none transition" />
              </div>
              <button disabled={isApplying} type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl text-sm font-bold transition flex justify-center items-center gap-2 shadow-[0_0_15px_rgba(37,99,235,0.4)] mt-4">
                {isApplying ? <Loader2 size={18} className="animate-spin" /> : 'Publish to Algorithm'}
              </button>
            </form>
          </div>
        )}
      </main>

      {/* OFFER MODAL */}
      {activeOfferApp && (
        <div className="fixed inset-0 z-[100] flex justify-center items-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-[#0a0f1c] border border-indigo-500/30 rounded-3xl shadow-[0_0_50px_rgba(79,70,229,0.15)] p-8 animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-black text-white tracking-tight mb-2">Send Mentorship Offer</h2>
            <p className="text-sm text-gray-400 mb-6">Offering guidance to <span className="text-indigo-400 font-bold">{activeOfferApp.mentee?.name}</span></p>
            
            <form onSubmit={handleSendOffer} className="space-y-4">
              <textarea 
                required rows="4" 
                value={offerMessage} 
                onChange={(e) => setOfferMessage(e.target.value)} 
                placeholder="Introduce yourself, explain how your experience aligns with their problem, and propose a next step..." 
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-indigo-500 outline-none resize-none transition" 
              />
              <div className="flex gap-3">
                <button type="button" onClick={() => setActiveOfferApp(null)} className="flex-1 bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl text-sm font-bold transition">Cancel</button>
                <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl text-sm font-bold transition flex justify-center items-center gap-2 shadow-[0_0_15px_rgba(79,70,229,0.4)]">
                  <Send size={16} /> Dispatch Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default MentorshipPage;
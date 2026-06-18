// src/pages/MentorshipPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ChevronLeft, BrainCircuit, Users, Send, CheckCircle2, RefreshCcw,
  XCircle, Search, Plus, Calendar, Clock, Loader2,
  Sparkles, Star, Target, MessageSquare, ShieldCheck, Award
} from 'lucide-react';
import apiClient from '../utils/apiClient';

const MentorshipPage = () => {
  // New Tabs: 'workspaces' (Active), 'pending' (Inbox), 'matchmaker' (Discover), 'apply' (Broadcast)
  const [activeTab, setActiveTab] = useState('workspaces');
  const [loading, setLoading] = useState(true);

  // Data States
  const [requests, setRequests] = useState([]);
  const [algorithmicMatches, setAlgorithmicMatches] = useState([]);

  // Form States
  const [applyForm, setApplyForm] = useState({ title: '', description: '' });
  const [isApplying, setIsApplying] = useState(false);

  // Quiz State
  const [showQuiz, setShowQuiz] = useState(true);
  const [quizStep, setQuizStep] = useState(1);
  const [quizAnswers, setQuizAnswers] = useState({
    goals: [], industry: '', stage: '', location: '', communication: ''
  });
  const [isMatching, setIsMatching] = useState(false);

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
  const fetchRequests = async () => {
    try {
      const res = await apiClient.get('/mentorship');
      if (res.ok) setRequests(await res.json());
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    if (!loggedInUser?.id) navigate('/login');
    else {
      fetchRequests();
      setLoading(false);
    }
  }, [navigate]);

  // --- ACTIONS ---
  const handleApply = async (e) => {
    e.preventDefault();
    setIsApplying(true);
    try {
      const res = await apiClient.post('/mentorship-board/apply', {
        body: JSON.stringify(applyForm)
      });
      if (res.ok) {
        alert('Mentorship Application Broadcasted Successfully!');
        setApplyForm({ title: '', description: '' });
        setActiveTab('pending');
      } else {
        const data = await res.json();
        alert(data.message);
      }
    } catch (err) { console.error(err); }
    finally { setIsApplying(false); }
  };

  const handleQuizSubmit = async () => {
    setIsMatching(true);
    setShowQuiz(false);
    try {
      const res = await apiClient.post('/mentorship/match', {
        body: JSON.stringify(quizAnswers)
      });
      if (res.ok) {
        const data = await res.json();
        setAlgorithmicMatches(data.matches || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsMatching(false);
    }
  };

  const handleSendOffer = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (activeOfferApp.mentee) {
        res = await apiClient.post(`/mentorship-board/${activeOfferApp._id}/offer`, {
          body: JSON.stringify({ message: offerMessage })
        });
      } else {
        res = await apiClient.post(`/mentorship/request`, {
          body: JSON.stringify({ mentorId: activeOfferApp._id, message: offerMessage, scheduledSession: new Date() })
        });
      }

      if (res.ok) {
        alert(activeOfferApp.mentee ? 'Offer Sent to Mentee!' : 'Mentorship Request Sent!');
        setActiveOfferApp(null);
        setOfferMessage('');
      } else {
        const data = await res.json();
        alert(data.message);
      }
    } catch (err) { console.error(err); }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await apiClient.put(`/mentorship/${id}/status`, {
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchRequests();
        if (status === 'Accepted') setActiveTab('workspaces');
      }
    } catch (err) { console.error(err); }
  };

  // Filter Data for Tabs
  const pendingRequests = requests.filter(r => r.status === 'Pending');
  const activeWorkspaces = requests.filter(r => r.status === 'Accepted' || r.status === 'Completed');

  if (loading && activeTab === 'workspaces') return <div className="min-h-screen bg-[#050810] text-purple-400 flex items-center justify-center font-mono animate-pulse uppercase tracking-widest">Loading Mentorship Vectors...</div>;

  return (
    <div className="min-h-screen bg-[#050810] text-gray-200 font-sans selection:bg-purple-500/30 pb-20 relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none"></div>

      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#050810]/80 border-b border-white/5 p-4 flex justify-between items-center">
        <Link to="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition group">
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-mono text-xs tracking-widest uppercase">Command Center</span>
        </Link>
      </nav>

      <main className="max-w-6xl mx-auto mt-8 px-4 sm:px-6 relative z-10">

        <div className="mb-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-6 border-b border-white/5 pb-8">
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight flex items-center justify-center md:justify-start gap-4 mb-2">
              <BrainCircuit className="text-purple-400" size={36} /> Algorithmic <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">Mentorship</span>
            </h1>
            <p className="text-gray-400 text-sm max-w-xl">Accelerate your growth. Connect with verified industry veterans, track your milestones, and build your startup.</p>
          </div>
        </div>

        {/* ENHANCED TAB NAVIGATION */}
        <div className="flex flex-wrap gap-2 md:gap-3 mb-8 bg-[#0a0f1c] p-2 rounded-2xl md:rounded-full border border-white/5 inline-flex">
          <button onClick={() => setActiveTab('workspaces')} className={`px-5 py-2.5 rounded-xl md:rounded-full text-xs font-bold transition flex items-center gap-2 ${activeTab === 'workspaces' ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.4)]' : 'text-gray-400 hover:text-white'}`}>
            <Target size={16} /> Active Workspaces
          </button>
          <button onClick={() => setActiveTab('pending')} className={`px-5 py-2.5 rounded-xl md:rounded-full text-xs font-bold transition flex items-center gap-2 relative ${activeTab === 'pending' ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.4)]' : 'text-gray-400 hover:text-white'}`}>
            <Clock size={16} /> Inbox
            {pendingRequests.length > 0 && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-[#050810]"></span>}
          </button>
          <button onClick={() => setActiveTab('matchmaker')} className={`px-5 py-2.5 rounded-xl md:rounded-full text-xs font-bold transition flex items-center gap-2 ${activeTab === 'matchmaker' ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'text-gray-400 hover:text-white'}`}>
            <Sparkles size={16} /> Matchmaker
          </button>
          <button onClick={() => setActiveTab('apply')} className={`px-5 py-2.5 rounded-xl md:rounded-full text-xs font-bold transition flex items-center gap-2 ${activeTab === 'apply' ? 'bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'text-gray-400 hover:text-white'}`}>
            <Plus size={16} /> Broadcast Goal
          </button>
        </div>

        {/* TAB 1: ACTIVE WORKSPACES (The Evolution) */}
        {activeTab === 'workspaces' && (
          <div className="space-y-6 animate-in fade-in">
            {activeWorkspaces.length === 0 ? (
              <div className="text-center py-20 border border-white/5 rounded-3xl bg-gradient-to-b from-[#0a0f1c] to-transparent">
                <Target size={48} className="mx-auto text-purple-900 mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">No Active Workspaces Yet</h3>
                <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">Your mentorship journey starts here. Connect with a mentor to unlock session tracking, goal setting, and shared resources.</p>
                <div className="flex justify-center gap-4">
                  <button onClick={() => setActiveTab('matchmaker')} className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2.5 rounded-full text-sm font-bold transition shadow-lg">Browse Mentors</button>
                  <button onClick={() => setActiveTab('apply')} className="bg-white/5 border border-white/10 hover:bg-white/10 text-white px-6 py-2.5 rounded-full text-sm font-bold transition">Broadcast a Goal</button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {activeWorkspaces.map(req => {
                  const isMentor = req.mentor === loggedInUser.id;
                  return (
                    <div key={req._id} className="bg-gradient-to-br from-[#0a0f1c] to-[#050810] border border-purple-500/20 rounded-3xl p-6 relative overflow-hidden group hover:border-purple-500/50 transition-colors">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-[50px] group-hover:bg-purple-500/10 transition-colors"></div>

                      <div className="flex justify-between items-start mb-6 relative z-10">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-purple-900/30 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold text-lg">
                            {isMentor ? 'M' : 'U'}
                          </div>
                          <div>
                            <h3 className="text-white font-bold text-lg">{isMentor ? 'Mentee Workspace' : 'Mentor Workspace'}</h3>
                            <p className="text-xs text-purple-400 font-mono tracking-widest uppercase">Status: {req.status}</p>
                          </div>
                        </div>
                      </div>

                      {/* Lifecycle Progress UI */}
                      <div className="mb-6 bg-black/40 rounded-xl p-4 border border-white/5">
                        <div className="flex justify-between text-xs text-gray-400 mb-2 font-bold uppercase tracking-wider">
                          <span>Mentorship Progress</span>
                          <span className="text-purple-400">Level 1</span>
                        </div>
                        <div className="w-full bg-white/5 rounded-full h-1.5 mb-3">
                          <div className="bg-gradient-to-r from-purple-600 to-indigo-500 h-1.5 rounded-full w-[25%]"></div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-4">
                          <div className="bg-white/5 p-3 rounded-lg text-center">
                            <div className="text-xl font-black text-white">0</div>
                            <div className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Sessions</div>
                          </div>
                          <div className="bg-white/5 p-3 rounded-lg text-center">
                            <div className="text-xl font-black text-white">0</div>
                            <div className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Goals Met</div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3 relative z-10">
                        <button className="flex-1 bg-purple-600 hover:bg-purple-500 text-white py-3 rounded-xl text-sm font-bold transition flex justify-center items-center gap-2 shadow-lg">
                          Enter Workspace <ChevronRight size={16} />
                        </button>
                        <button className="bg-white/5 hover:bg-white/10 text-white p-3 rounded-xl transition border border-white/10">
                          <MessageSquare size={20} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: INBOX (Pending Requests) */}
        {activeTab === 'pending' && (
          <div className="space-y-6 animate-in fade-in">
            {pendingRequests.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl bg-[#0a0f1c]/50">
                <Clock size={48} className="mx-auto text-gray-700 mb-4" />
                <p className="text-gray-500 font-mono text-sm uppercase tracking-widest">Inbox is clear.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pendingRequests.map(req => {
                  const isMentor = req.mentor === loggedInUser.id;
                  return (
                    <div key={req._id} className="bg-[#0a0f1c] border border-white/10 rounded-3xl p-6 flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                        <span className="bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 text-[10px] font-mono px-3 py-1 rounded-full uppercase tracking-widest">
                          Awaiting Action
                        </span>
                        <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">
                          {isMentor ? 'Inbound Request' : 'Outbound Request'}
                        </span>
                      </div>

                      <div className="bg-black/50 p-4 rounded-xl border border-white/5 mb-4 relative">
                        <MessageSquare size={14} className="absolute top-4 right-4 text-gray-600" />
                        <p className="text-sm text-gray-300 italic pr-6">"{req.message}"</p>
                      </div>

                      {/* Mentor Actions */}
                      {isMentor ? (
                        <div className="flex gap-3 mt-auto">
                          <button onClick={() => handleUpdateStatus(req._id, 'Accepted')} className="flex-1 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-500/30 py-2.5 rounded-xl text-xs font-bold transition flex justify-center items-center gap-2">
                            <CheckCircle2 size={16} /> Accept Mentee
                          </button>
                          <button onClick={() => handleUpdateStatus(req._id, 'Declined')} className="flex-1 bg-red-900/20 hover:bg-red-900/40 text-red-400 border border-red-800/30 py-2.5 rounded-xl text-xs font-bold transition flex justify-center items-center gap-2">
                            <XCircle size={16} /> Decline
                          </button>
                        </div>
                      ) : (
                        <div className="mt-auto text-center p-3 bg-white/5 rounded-xl border border-white/5 text-xs font-bold text-gray-400">
                          Waiting for Mentor to review...
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: MENTOR MATCHMAKER (With Trust UI) */}
        {activeTab === 'matchmaker' && (
          <div className="space-y-6 animate-in fade-in">
            {showQuiz ? (
              <div className="max-w-2xl mx-auto bg-gradient-to-br from-blue-900/20 to-purple-900/10 border border-blue-500/30 rounded-3xl p-8 shadow-2xl animate-in fade-in">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    <Sparkles className="text-blue-400" /> Mentor Matchmaker
                  </h2>
                  <span className="text-xs font-mono text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">Step {quizStep} of 5</span>
                </div>

                <div className="w-full bg-black/50 rounded-full h-1.5 mb-8 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-300" style={{ width: `${(quizStep / 5) * 100}%` }}></div>
                </div>

                {quizStep === 1 && (
                  <div className="space-y-6 animate-in slide-in-from-right-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">What is your primary networking goal?</h3>
                      <p className="text-sm text-gray-400">Select the main area where you need guidance.</p>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      {['Scaling B2B Sales', 'Fundraising', 'Global Expansion', 'Product-Market Fit', 'Leadership Development'].map(goal => (
                        <button key={goal} onClick={() => { setQuizAnswers({ ...quizAnswers, goals: [goal] }); setQuizStep(2); }} className={`p-4 rounded-xl border text-left transition-all ${quizAnswers.goals.includes(goal) ? 'bg-blue-600/20 border-blue-500 text-white' : 'bg-black/40 border-white/5 text-gray-300 hover:bg-white/5 hover:border-white/20'}`}>
                          <span className="font-bold">{goal}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {quizStep === 2 && (
                  <div className="space-y-6 animate-in slide-in-from-right-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">Preferred Industry Vertical?</h3>
                      <p className="text-sm text-gray-400">Which industry should your mentor have experience in?</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {['Technology/SaaS', 'Finance/FinTech', 'Healthcare', 'Retail/E-commerce', 'Real Estate', 'Manufacturing'].map(ind => (
                        <button key={ind} onClick={() => { setQuizAnswers({ ...quizAnswers, industry: ind }); setQuizStep(3); }} className={`p-4 rounded-xl border text-left transition-all ${quizAnswers.industry === ind ? 'bg-blue-600/20 border-blue-500 text-white' : 'bg-black/40 border-white/5 text-gray-300 hover:bg-white/5 hover:border-white/20'}`}>
                          <span className="font-bold">{ind}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {quizStep === 3 && (
                  <div className="space-y-6 animate-in slide-in-from-right-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">What is your current stage?</h3>
                      <p className="text-sm text-gray-400">Helps us match you with someone who has been there recently.</p>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      {['Idea / Pre-seed', 'Seed / Early Stage', 'Growth / Series A+', 'Mature / Enterprise'].map(stage => (
                        <button key={stage} onClick={() => { setQuizAnswers({ ...quizAnswers, stage }); setQuizStep(4); }} className={`p-4 rounded-xl border text-left transition-all ${quizAnswers.stage === stage ? 'bg-blue-600/20 border-blue-500 text-white' : 'bg-black/40 border-white/5 text-gray-300 hover:bg-white/5 hover:border-white/20'}`}>
                          <span className="font-bold">{stage}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {quizStep === 4 && (
                  <div className="space-y-6 animate-in slide-in-from-right-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">Geographic Target Interest?</h3>
                      <p className="text-sm text-gray-400">Does location matter for your mentorship?</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {['Local / Regional', 'National', 'Global / International', 'Remote / Async'].map(loc => (
                        <button key={loc} onClick={() => { setQuizAnswers({ ...quizAnswers, location: loc }); setQuizStep(5); }} className={`p-4 rounded-xl border text-left transition-all ${quizAnswers.location === loc ? 'bg-blue-600/20 border-blue-500 text-white' : 'bg-black/40 border-white/5 text-gray-300 hover:bg-white/5 hover:border-white/20'}`}>
                          <span className="font-bold">{loc}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {quizStep === 5 && (
                  <div className="space-y-6 animate-in slide-in-from-right-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">Communication Style Preference?</h3>
                      <p className="text-sm text-gray-400">How do you prefer to interact?</p>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      {['Weekly 1:1 Video Calls', 'Async Text/Voice', 'Monthly Check-ins', 'Hands-on tactical'].map(comm => (
                        <button key={comm} onClick={() => setQuizAnswers({ ...quizAnswers, communication: comm })} className={`p-4 rounded-xl border text-left transition-all ${quizAnswers.communication === comm ? 'bg-blue-600/20 border-blue-500 text-white' : 'bg-black/40 border-white/5 text-gray-300 hover:bg-white/5 hover:border-white/20'}`}>
                          <span className="font-bold">{comm}</span>
                        </button>
                      ))}
                    </div>
                    <div className="pt-4 border-t border-white/5 flex gap-3">
                      <button onClick={() => setQuizStep(4)} className="px-6 py-3 rounded-xl border border-white/10 text-white hover:bg-white/5 font-bold transition">Back</button>
                      <button disabled={!quizAnswers.communication || isMatching} onClick={handleQuizSubmit} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.4)] disabled:opacity-50">
                        {isMatching ? <Loader2 size={18} className="animate-spin" /> : 'Find My Match'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/10 border border-blue-500/20 p-6 rounded-3xl mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2"><Sparkles className="text-blue-400" /> AI Matches Generated</h2>
                    <p className="text-sm text-blue-200/70">Based on your quiz results, we found these mentors in our network.</p>
                  </div>
                  <button onClick={() => { setShowQuiz(true); setQuizStep(1); }} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-xs font-bold transition border border-white/10 whitespace-nowrap flex items-center gap-2">
                    <RefreshCcw size={14} /> Retake Quiz
                  </button>
                </div>

                {isMatching ? (
                  <div className="text-center py-20"><Loader2 size={32} className="animate-spin text-blue-400 mx-auto mb-4" /><p className="text-blue-400 font-mono text-sm tracking-widest uppercase animate-pulse">Running Match Algorithm...</p></div>
                ) : algorithmicMatches.length === 0 ? (
                  <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl bg-[#0a0f1c]/50">
                    <Search size={48} className="mx-auto text-gray-600 mb-4" />
                    <p className="text-gray-500 font-mono text-sm uppercase tracking-widest mb-4">No exact matches found right now.</p>
                    <button onClick={() => { setShowQuiz(true); setQuizStep(1); }} className="text-blue-400 text-sm font-bold hover:underline">Adjust Parameters</button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {algorithmicMatches.map(app => (
                      <div key={app._id} className="bg-[#0a0f1c] border border-white/10 rounded-3xl p-6 hover:border-blue-500/30 transition-all flex flex-col group">
                        <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 p-[2px]">
                              <div className="w-full h-full rounded-full bg-[#050810] flex items-center justify-center font-bold text-white text-xl">
                                {app.name?.charAt(0) || app.mentee?.name?.charAt(0) || 'M'}
                              </div>
                            </div>
                            <div>
                              <h3 className="text-base font-bold text-white flex items-center gap-1">
                                {app.name || app.mentee?.name} <ShieldCheck size={14} className="text-blue-400" />
                              </h3>
                              <p className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">{app.industry || 'General'}</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <div className="flex items-center gap-1 text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded-md mb-1">
                              <Star size={12} className="fill-yellow-400" /> <span className="text-xs font-bold">{app.rating || '5.0'}</span>
                            </div>
                          </div>
                        </div>

                        <p className="text-sm text-gray-400 mb-6 flex-1 line-clamp-3">{app.bio || app.description || "Experienced professional ready to share insights and accelerate your growth."}</p>

                        <div className="flex flex-wrap gap-2 mb-6">
                          {quizAnswers.goals.map(g => <span key={g} className="bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] px-2 py-1 rounded-md font-mono uppercase">{g}</span>)}
                          {quizAnswers.industry && <span className="bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] px-2 py-1 rounded-md font-mono uppercase">{quizAnswers.industry}</span>}
                        </div>

                        <button onClick={() => setActiveOfferApp(app)} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl text-sm font-bold transition flex justify-center items-center gap-2 shadow-lg group-hover:shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                          <Send size={16} /> {app.mentee ? 'Dispatch Mentorship Offer' : 'Request Mentorship'}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* TAB 4: BROADCAST GOAL (Apply) */}
        {activeTab === 'apply' && (
          <div className="max-w-2xl mx-auto bg-[#0a0f1c] border border-white/10 rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 mt-4">
            <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mb-6">
              <Award size={24} />
            </div>
            <h2 className="text-2xl font-black text-white mb-2">Broadcast a Mentorship Goal</h2>
            <p className="text-sm text-gray-400 mb-8 leading-relaxed">Stop guessing. Define exactly what you are trying to achieve, and our algorithm will route your goal to verified mentors with the specific skills you need.</p>

            <form onSubmit={handleApply} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">Target Objective</label>
                <input required type="text" value={applyForm.title} onChange={(e) => setApplyForm({ ...applyForm, title: e.target.value })} placeholder="e.g. Need guidance scaling a SaaS startup from 10 to 100 users" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-emerald-500 outline-none transition" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">Current Context & Roadblocks</label>
                <textarea required rows="5" value={applyForm.description} onChange={(e) => setApplyForm({ ...applyForm, description: e.target.value })} placeholder="Explain where you are currently at, the roadblocks you are facing, and what a successful outcome looks like..." className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-emerald-500 outline-none resize-none transition" />
              </div>
              <button disabled={isApplying} type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-xl text-sm font-bold transition flex justify-center items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)] mt-4">
                {isApplying ? <Loader2 size={18} className="animate-spin" /> : 'Publish to Ecosystem'}
              </button>
            </form>
          </div>
        )}
      </main>

      {/* OFFER MODAL (Unchanged but styled better) */}
      {activeOfferApp && (
        <div className="fixed inset-0 z-[100] flex justify-center items-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-[#0a0f1c] border border-blue-500/30 rounded-3xl shadow-[0_0_50px_rgba(37,99,235,0.15)] p-8 animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-black text-white tracking-tight mb-2">{activeOfferApp.mentee ? 'Draft Mentorship Offer' : 'Draft Mentorship Request'}</h2>
            <p className="text-sm text-gray-400 mb-6">{activeOfferApp.mentee ? 'Offering guidance to' : 'Requesting guidance from'} <span className="text-blue-400 font-bold">{activeOfferApp.name || activeOfferApp.mentee?.name}</span></p>

            <form onSubmit={handleSendOffer} className="space-y-4">
              <textarea
                required rows="4"
                value={offerMessage}
                onChange={(e) => setOfferMessage(e.target.value)}
                placeholder={activeOfferApp.mentee ? "Introduce yourself, explain how your experience aligns with their problem, and propose a next step..." : "Introduce yourself, explain your goals, and propose a next step..."}
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 outline-none resize-none transition"
              />
              <div className="flex gap-3">
                <button type="button" onClick={() => setActiveOfferApp(null)} className="flex-1 bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl text-sm font-bold transition">Cancel</button>
                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl text-sm font-bold transition flex justify-center items-center gap-2 shadow-[0_0_15px_rgba(37,99,235,0.4)]">
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

export default MentorshipPage;

// Mock ChevronRight Icon component just in case it wasn't imported from lucide-react above.
const ChevronRight = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>;
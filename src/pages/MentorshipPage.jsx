// src/pages/MentorshipPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ChevronLeft, BrainCircuit, Users, Send, CheckCircle2, RefreshCcw,
  XCircle, Search, Plus, Calendar, Clock, Loader2,
  Sparkles, Star, Target, MessageSquare, ShieldCheck, Award, ChevronRight
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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-500/30 flex flex-col overflow-y-auto pb-20">

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
        <div className="max-w-6xl mx-auto px-6 flex items-end justify-between flex-wrap gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight mb-1 flex items-center gap-3">
              <BrainCircuit className="text-blue-200" size={32} /> Mentorship Program
            </h1>
            <p className="text-sm text-white/80 max-w-xl">Accelerate your growth. Connect with verified industry veterans, track your milestones, and build your startup.</p>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto mt-8 px-6 relative z-10 w-full flex-1">

        <div className="flex border-b-2 border-slate-200 mb-8 overflow-x-auto scrollbar-hide">
          <button onClick={() => setActiveTab('workspaces')} className={`px-5 py-3 text-sm font-semibold border-b-2 -mb-[2px] transition flex items-center gap-2 whitespace-nowrap ${activeTab === 'workspaces' ? 'border-[#185fa5] text-[#185fa5]' : 'border-transparent text-slate-500 hover:text-slate-800'}`}><Target size={16} /> Active Workspaces</button>
          <button onClick={() => setActiveTab('pending')} className={`px-5 py-3 text-sm font-semibold border-b-2 -mb-[2px] transition flex items-center gap-2 whitespace-nowrap relative ${activeTab === 'pending' ? 'border-[#185fa5] text-[#185fa5]' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
            <Clock size={16} /> Inbox
            {pendingRequests.length > 0 && <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-1">{pendingRequests.length}</span>}
          </button>
          <button onClick={() => setActiveTab('matchmaker')} className={`px-5 py-3 text-sm font-semibold border-b-2 -mb-[2px] transition flex items-center gap-2 whitespace-nowrap ${activeTab === 'matchmaker' ? 'border-[#185fa5] text-[#185fa5]' : 'border-transparent text-slate-500 hover:text-slate-800'}`}><Sparkles size={16} /> Matchmaker Quiz</button>
          <button onClick={() => setActiveTab('apply')} className={`px-5 py-3 text-sm font-semibold border-b-2 -mb-[2px] transition flex items-center gap-2 whitespace-nowrap ${activeTab === 'apply' ? 'border-[#185fa5] text-[#185fa5]' : 'border-transparent text-slate-500 hover:text-slate-800'}`}><Plus size={16} /> Broadcast Goal</button>
        </div>

        {/* TAB 1: ACTIVE WORKSPACES */}
        {activeTab === 'workspaces' && (
          <div className="space-y-6 animate-in fade-in">
            {activeWorkspaces.length === 0 ? (
              <div className="text-center py-20 border border-slate-200 rounded-2xl bg-white shadow-sm">
                <Target size={48} className="mx-auto text-slate-300 mb-4" />
                <h3 className="text-lg font-bold text-slate-900 mb-2">No Active Workspaces Yet</h3>
                <p className="text-slate-500 text-sm mb-6 max-w-md mx-auto">Your mentorship journey starts here. Connect with a mentor to unlock session tracking, goal setting, and shared resources.</p>
                <div className="flex justify-center gap-4">
                  <button onClick={() => setActiveTab('matchmaker')} className="bg-[#185fa5] hover:bg-[#0c447c] text-white px-6 py-2.5 rounded-lg text-sm font-bold transition shadow-sm">Browse Mentors</button>
                  <button onClick={() => setActiveTab('apply')} className="bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-700 px-6 py-2.5 rounded-lg text-sm font-bold transition">Broadcast a Goal</button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {activeWorkspaces.map(req => {
                  const isMentor = req.mentor === loggedInUser.id;
                  return (
                    <div key={req._id} className="bg-white border border-slate-200 rounded-2xl p-6 relative overflow-hidden group hover:border-[#185fa5] transition-all shadow-sm hover:shadow-md">
                      <div className="flex justify-between items-start mb-6 relative z-10">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-[#e6f1fb] flex items-center justify-center text-[#185fa5] font-bold text-lg">
                            {isMentor ? 'M' : 'U'}
                          </div>
                          <div>
                            <h3 className="text-slate-900 font-bold text-lg">{isMentor ? 'Mentee Workspace' : 'Mentor Workspace'}</h3>
                            <p className="text-xs text-slate-500 font-mono tracking-widest uppercase">Status: {req.status}</p>
                          </div>
                        </div>
                      </div>

                      {/* Lifecycle Progress UI */}
                      <div className="mb-6 bg-slate-50 rounded-xl p-4 border border-slate-100">
                        <div className="flex justify-between text-xs text-slate-500 mb-2 font-bold uppercase tracking-wider">
                          <span>Mentorship Progress</span>
                          <span className="text-[#185fa5]">Level 1</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-1.5 mb-3">
                          <div className="bg-[#185fa5] h-1.5 rounded-full w-[25%] transition-all"></div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-4">
                          <div className="bg-white border border-slate-200 p-3 rounded-lg text-center shadow-sm">
                            <div className="text-xl font-black text-slate-900">0</div>
                            <div className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Sessions</div>
                          </div>
                          <div className="bg-white border border-slate-200 p-3 rounded-lg text-center shadow-sm">
                            <div className="text-xl font-black text-slate-900">0</div>
                            <div className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Goals Met</div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3 relative z-10">
                        <button className="flex-1 bg-[#185fa5] hover:bg-[#0c447c] text-white py-3 rounded-xl text-sm font-bold transition flex justify-center items-center gap-2 shadow-sm">
                          Enter Workspace <ChevronRight size={16} />
                        </button>
                        <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-3 rounded-xl transition border border-slate-200">
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
              <div className="text-center py-20 border border-dashed border-slate-300 rounded-2xl bg-white shadow-sm">
                <Clock size={48} className="mx-auto text-slate-300 mb-4" />
                <p className="text-slate-500 font-mono text-sm uppercase tracking-widest">Inbox is clear.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pendingRequests.map(req => {
                  const isMentor = req.mentor === loggedInUser.id;
                  return (
                    <div key={req._id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                        <span className="bg-[#faeeda] text-[#ba7517] border border-yellow-200/50 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                          Awaiting Action
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">
                          {isMentor ? 'Inbound Request' : 'Outbound Request'}
                        </span>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-4 relative">
                        <MessageSquare size={14} className="absolute top-4 right-4 text-slate-400" />
                        <p className="text-sm text-slate-700 italic pr-6">"{req.message}"</p>
                      </div>

                      {/* Mentor Actions */}
                      {isMentor ? (
                        <div className="flex gap-3 mt-auto">
                          <button onClick={() => handleUpdateStatus(req._id, 'Accepted')} className="flex-1 bg-[#eaf3de] hover:bg-[#d6ebb9] text-[#1d9e75] py-2.5 rounded-lg text-xs font-bold transition flex justify-center items-center gap-2">
                            <CheckCircle2 size={16} /> Accept Mentee
                          </button>
                          <button onClick={() => handleUpdateStatus(req._id, 'Declined')} className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2.5 rounded-lg text-xs font-bold transition flex justify-center items-center gap-2 border border-red-100">
                            <XCircle size={16} /> Decline
                          </button>
                        </div>
                      ) : (
                        <div className="mt-auto text-center p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs font-bold text-slate-500">
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
        {showQuiz && (
          <div className="fixed inset-0 z-[100] flex justify-center items-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl p-8 animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                  <Sparkles className="text-[#185fa5]" /> Mentor Matchmaker
                </h2>
                <span className="text-xs font-bold text-[#185fa5] bg-[#e6f1fb] px-3 py-1 rounded-full border border-blue-200">Step {quizStep} of 5</span>
              </div>

              <div className="w-full bg-slate-100 rounded-full h-1.5 mb-8 overflow-hidden">
                <div className="bg-[#185fa5] h-full transition-all duration-300" style={{ width: `${(quizStep / 5) * 100}%` }}></div>
              </div>

              {quizStep === 1 && (
                <div className="space-y-6 animate-in slide-in-from-right-4">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">What is your core objective?</h3>
                    <p className="text-sm text-slate-500">Select the primary area where you need mentorship.</p>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {['Scale', 'Cross-Border Trade', 'Capital/Raising', 'Product Dev'].map(goal => (
                      <button key={goal} onClick={() => { setQuizAnswers({ ...quizAnswers, goals: [goal] }); setQuizStep(2); }} className={`p-4 rounded-xl border text-left transition-all ${quizAnswers.goals.includes(goal) ? 'bg-[#e6f1fb] border-[#185fa5] text-[#185fa5] shadow-sm' : 'bg-white border-slate-200 text-slate-700 hover:border-blue-300 hover:shadow-sm'}`}>
                        <span className="font-bold">{goal}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {quizStep === 2 && (
                <div className="space-y-6 animate-in slide-in-from-right-4">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Global Industry Classification</h3>
                    <p className="text-sm text-slate-500">Which industry should your mentor have experience in?</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {['Enterprise Software / SaaS', 'Financial Technology', 'Healthcare & Life Sciences', 'Deep Tech / AI', 'Manufacturing & Logistics', 'Consumer & Retail'].map(ind => (
                      <button key={ind} onClick={() => { setQuizAnswers({ ...quizAnswers, industry: ind }); setQuizStep(3); }} className={`p-4 rounded-xl border text-left transition-all ${quizAnswers.industry === ind ? 'bg-[#e6f1fb] border-[#185fa5] text-[#185fa5] shadow-sm' : 'bg-white border-slate-200 text-slate-700 hover:border-blue-300 hover:shadow-sm'}`}>
                        <span className="font-bold">{ind}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {quizStep === 3 && (
                <div className="space-y-6 animate-in slide-in-from-right-4">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Current Run-Rate / Stage</h3>
                    <p className="text-sm text-slate-500">Helps us match you with someone who has scaled beyond this.</p>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {['Pre-Revenue / Seed', 'Early Growth ($1M - $5M ARR)', 'Scaling ($5M - $20M ARR)', 'Enterprise ($20M+ ARR)'].map(stage => (
                      <button key={stage} onClick={() => { setQuizAnswers({ ...quizAnswers, stage }); setQuizStep(4); }} className={`p-4 rounded-xl border text-left transition-all ${quizAnswers.stage === stage ? 'bg-[#e6f1fb] border-[#185fa5] text-[#185fa5] shadow-sm' : 'bg-white border-slate-200 text-slate-700 hover:border-blue-300 hover:shadow-sm'}`}>
                        <span className="font-bold">{stage}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {quizStep === 4 && (
                <div className="space-y-6 animate-in slide-in-from-right-4">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Geographic Target Markets</h3>
                    <p className="text-sm text-slate-500">Where are you looking to expand?</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {['North America', 'APAC', 'Europe', 'LATAM'].map(loc => (
                      <button key={loc} onClick={() => { setQuizAnswers({ ...quizAnswers, location: loc }); setQuizStep(5); }} className={`p-4 rounded-xl border text-left transition-all ${quizAnswers.location === loc ? 'bg-[#e6f1fb] border-[#185fa5] text-[#185fa5] shadow-sm' : 'bg-white border-slate-200 text-slate-700 hover:border-blue-300 hover:shadow-sm'}`}>
                        <span className="font-bold">{loc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {quizStep === 5 && (
                <div className="space-y-6 animate-in slide-in-from-right-4">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Frequency Preference</h3>
                    <p className="text-sm text-slate-500">How often do you want to sync?</p>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {['Weekly Syncs', 'Bi-weekly Strategy', 'Monthly Board Review'].map(comm => (
                      <button key={comm} onClick={() => setQuizAnswers({ ...quizAnswers, communication: comm })} className={`p-4 rounded-xl border text-left transition-all ${quizAnswers.communication === comm ? 'bg-[#e6f1fb] border-[#185fa5] text-[#185fa5] shadow-sm' : 'bg-white border-slate-200 text-slate-700 hover:border-blue-300 hover:shadow-sm'}`}>
                        <span className="font-bold">{comm}</span>
                      </button>
                    ))}
                  </div>
                  <div className="pt-6 border-t border-slate-100 flex gap-3">
                    <button onClick={() => setQuizStep(4)} className="px-6 py-3 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50 font-bold transition">Back</button>
                    <button disabled={!quizAnswers.communication || isMatching} onClick={handleQuizSubmit} className="flex-1 bg-[#185fa5] hover:bg-[#0c447c] text-white py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50">
                      {isMatching ? <Loader2 size={18} className="animate-spin" /> : 'Execute AI Match'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'matchmaker' && !showQuiz && (
          <div className="space-y-6 animate-in fade-in">
            <div className="bg-white border border-slate-200 shadow-sm p-6 rounded-2xl mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2"><Sparkles className="text-[#185fa5]" /> Executive Matches Generated</h2>
                <p className="text-sm text-slate-500">Based on your onboarding parameters, we found these global mentors in our network.</p>
              </div>
              <button onClick={() => { setShowQuiz(true); setQuizStep(1); }} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap flex items-center gap-2">
                <RefreshCcw size={14} /> Recalibrate
              </button>
            </div>

            {isMatching ? (
              <div className="text-center py-20"><Loader2 size={32} className="animate-spin text-[#185fa5] mx-auto mb-4" /><p className="text-[#185fa5] font-mono text-sm tracking-widest uppercase animate-pulse">Running Match Algorithm...</p></div>
            ) : algorithmicMatches.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-slate-300 rounded-3xl bg-white shadow-sm">
                <Search size={48} className="mx-auto text-slate-300 mb-4" />
                <p className="text-slate-500 font-mono text-sm uppercase tracking-widest mb-4">No exact matches found.</p>
                <button onClick={() => { setShowQuiz(true); setQuizStep(1); }} className="text-[#185fa5] text-sm font-bold hover:underline">Adjust Parameters</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {algorithmicMatches.map(app => (
                  <div key={app._id} className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-[#185fa5] hover:shadow-md transition-all flex flex-col group shadow-sm">
                    <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-[#185fa5] flex items-center justify-center font-bold text-white text-xl shadow-inner">
                          {app.name?.charAt(0) || app.mentee?.name?.charAt(0) || 'M'}
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-slate-900 flex items-center gap-1">
                            {app.name || app.mentee?.name} <ShieldCheck size={14} className="text-[#185fa5]" />
                          </h3>
                          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{app.industry || 'General'}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="flex items-center gap-1 text-[#ba7517] bg-[#faeeda] px-2 py-1 rounded-md mb-1 border border-yellow-200/50">
                          <Star size={12} className="fill-[#ba7517]" /> <span className="text-xs font-bold">{app.rating || '5.0'}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-slate-600 mb-6 flex-1 line-clamp-3 leading-relaxed">{app.bio || app.description || "Experienced professional ready to share insights and accelerate your growth."}</p>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {quizAnswers.goals.map(g => <span key={g} className="bg-[#e6f1fb] border border-blue-200 text-[#185fa5] text-[10px] px-2 py-1 rounded-md font-mono uppercase font-semibold">{g}</span>)}
                      {quizAnswers.industry && <span className="bg-slate-100 border border-slate-200 text-slate-600 text-[10px] px-2 py-1 rounded-md font-mono uppercase font-semibold">{quizAnswers.industry}</span>}
                    </div>

                    <button onClick={() => setActiveOfferApp(app)} className="w-full bg-white border-2 border-[#185fa5] text-[#185fa5] hover:bg-[#e6f1fb] py-2.5 rounded-xl text-sm font-bold transition flex justify-center items-center gap-2">
                      <Send size={16} /> {app.mentee ? 'Dispatch Mentorship Offer' : 'Request Mentorship'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: BROADCAST GOAL (Apply) */}
        {activeTab === 'apply' && (
          <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-2xl p-8 shadow-sm mt-4 animate-in zoom-in-95">
            <div className="w-12 h-12 bg-[#eaf3de] text-[#1d9e75] rounded-xl flex items-center justify-center mb-6">
              <Award size={24} />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Broadcast a Mentorship Goal</h2>
            <p className="text-sm text-slate-500 mb-8 leading-relaxed">Stop guessing. Define exactly what you are trying to achieve, and our algorithm will route your goal to verified mentors with the specific skills you need.</p>

            <form onSubmit={handleApply} className="space-y-5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Target Objective</label>
                <input required type="text" value={applyForm.title} onChange={(e) => setApplyForm({ ...applyForm, title: e.target.value })} placeholder="e.g. Need guidance scaling a SaaS startup from 10 to 100 users" className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 focus:border-[#185fa5] focus:ring-2 focus:ring-[#185fa5]/20 outline-none transition" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Current Context & Roadblocks</label>
                <textarea required rows="5" value={applyForm.description} onChange={(e) => setApplyForm({ ...applyForm, description: e.target.value })} placeholder="Explain where you are currently at, the roadblocks you are facing, and what a successful outcome looks like..." className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-sm text-slate-900 focus:border-[#185fa5] focus:ring-2 focus:ring-[#185fa5]/20 outline-none resize-none transition" />
              </div>
              <button disabled={isApplying} type="submit" className="w-full bg-[#185fa5] hover:bg-[#0c447c] text-white py-3 rounded-lg text-sm font-bold transition flex justify-center items-center gap-2 mt-4 disabled:opacity-50 shadow-sm">
                {isApplying ? <Loader2 size={18} className="animate-spin" /> : 'Publish to Ecosystem'}
              </button>
            </form>
          </div>
        )}
      </main>

      {/* OFFER MODAL */}
      {activeOfferApp && (
        <div className="fixed inset-0 z-[100] flex justify-center items-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-xl p-8 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">{activeOfferApp.mentee ? 'Draft Mentorship Offer' : 'Draft Mentorship Request'}</h2>
                <p className="text-sm text-slate-500 mt-1">{activeOfferApp.mentee ? 'Offering guidance to' : 'Requesting guidance from'} <span className="text-[#185fa5] font-bold">{activeOfferApp.name || activeOfferApp.mentee?.name}</span></p>
              </div>
              <button onClick={() => setActiveOfferApp(null)} className="text-slate-400 hover:text-slate-700 transition"><XCircle size={20} /></button>
            </div>

            <form onSubmit={handleSendOffer} className="space-y-4">
              <textarea
                required rows="4"
                value={offerMessage}
                onChange={(e) => setOfferMessage(e.target.value)}
                placeholder={activeOfferApp.mentee ? "Introduce yourself, explain how your experience aligns with their problem, and propose a next step..." : "Introduce yourself, explain your goals, and propose a next step..."}
                className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm text-slate-900 focus:border-[#185fa5] focus:ring-2 focus:ring-[#185fa5]/20 outline-none resize-none transition"
              />
              <button type="submit" className="w-full bg-[#185fa5] hover:bg-[#0c447c] text-white py-3 rounded-lg text-sm font-bold transition flex justify-center items-center gap-2">
                <Send size={16} /> Transmit
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default MentorshipPage;
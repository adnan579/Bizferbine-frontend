// src/pages/EventsPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Ticket, Calendar, MapPin, Users, DollarSign, Plus, CheckCircle2, ShieldAlert, Loader2, AlertCircle, Settings, Download, Megaphone, CalendarDays, Cpu, Network, Target, Radar, Briefcase, Zap, Layers, PlayCircle, MessageSquare, Clock } from 'lucide-react';
import apiClient from '../utils/apiClient';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createError, setCreateError] = useState('');

  const [formData, setFormData] = useState({
    title: '', description: '', type: 'Online', locationOrLink: '',
    date: '', ticketPrice: 0, maxCapacity: 100,
    acceptsSponsors: false, sponsorshipPrice: 0
  });

  // Event Operating System State
  const [activeOsEvent, setActiveOsEvent] = useState(null);
  const [osData, setOsData] = useState({ sessions: [], attendees: [] });
  const [isOsLoading, setIsOsLoading] = useState(false);
  const [osTab, setOsTab] = useState('agenda');

  // Intent Capture State
  const [userIntent, setUserIntent] = useState(null);
  const [isIntentSubmitting, setIsIntentSubmitting] = useState(false);
  const [intentForm, setIntentForm] = useState({ attendingPurpose: 'Customers', specificLookingFor: '', geographicRegion: '', weekendAvailabilityOnly: false, earlyStageFocus: true });

  // Command Center Modal State
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [manageData, setManageData] = useState(null);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  const navigate = useNavigate();

  let loggedInUser = null;
  try {
    const userStr = localStorage.getItem('user');
    if (userStr && userStr !== "undefined") loggedInUser = JSON.parse(userStr);
  } catch (err) { console.error(err); }

  const fetchEvents = async () => {
    try {
      // Note: Your GET /api/events backend route doesn't strictly require auth, 
      // but we pass the token anyway for future-proofing.
      const response = await apiClient.get('/events');
      if (response.ok) {
        setEvents(await response.json());
      }
    } catch (err) { console.error("Failed to fetch events", err); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (!loggedInUser?.id) navigate('/login');
    else fetchEvents();
  }, [navigate]);

  // CREATE EVENT
  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setCreateError('');

    try {
      const response = await apiClient.post('/events', {
        body: JSON.stringify(formData)
      });
      const data = await response.json();

      if (response.ok) {
        setIsCreateOpen(false);
        setFormData({ title: '', description: '', type: 'Online', locationOrLink: '', date: '', ticketPrice: 0, maxCapacity: 100, acceptsSponsors: false, sponsorshipPrice: 0 });
        fetchEvents();
      } else {
        setCreateError(data.message || 'Failed to create event.');
      }
    } catch (err) { setCreateError('Server Connection Error.'); }
    finally { setIsSubmitting(false); }
  };

  // FETCH OPERATING SYSTEM DATA
  const fetchOperatingSystem = async (eventId) => {
    setIsOsLoading(true);
    try {
      const res = await apiClient.get(`/events/${eventId}/operating-system`);
      if (res.ok) {
        const data = await res.json();
        setOsData(data);
        const myReg = data.attendees.find(a => a.user?._id === loggedInUser?.id);
        if (myReg) setUserIntent(myReg);
        else setUserIntent(null);
      }
    } catch (err) { console.error(err); }
    finally { setIsOsLoading(false); }
  };

  // REGISTER INTENT (NEW ALGORITHMIC PIPELINE)
  const handleRegisterIntent = async (e) => {
    e.preventDefault();
    setIsIntentSubmitting(true);
    try {
      const res = await apiClient.post(`/events/${activeOsEvent._id}/register-intent`, {
        body: JSON.stringify(intentForm)
      });
      const data = await response.json();
      if (res.ok) {
        setUserIntent(data.registration);
        fetchOperatingSystem(activeOsEvent._id);
        fetchEvents();
      } else {
        alert(data.message);
      }
    } catch (err) { console.error(err); }
    finally { setIsIntentSubmitting(false); }
  };

  // REGISTER AS SPONSOR
  const handleSponsor = async (event) => {
    if (event.sponsorshipPrice > 0) {
      const confirmPay = window.confirm(`Proceed to Escrow Checkout to secure sponsorship for $${event.sponsorshipPrice}?`);
      if (!confirmPay) return;
    }
    try {
      const response = await apiClient.post(`/events/${event._id}/sponsor`, {
        body: JSON.stringify({ paymentSuccess: true }) // Simulating successful Razorpay gateway
      });
      const data = await response.json();
      alert(data.message);
      if (response.ok) fetchEvents();
    } catch (err) { console.error(err); }
  };

  // OPEN COMMAND CENTER
  const handleOpenCommandCenter = async (eventId) => {
    try {
      const response = await apiClient.get(`/events/${eventId}/manage`);
      if (response.ok) {
        setManageData(await response.json());
        setIsManageOpen(true);
      }
    } catch (err) { console.error(err); }
  };

  // GENERATE GOOGLE CALENDAR LINK
  const generateCalendarLink = (event) => {
    const title = encodeURIComponent(event.title);
    const details = encodeURIComponent(event.description);
    const location = encodeURIComponent(event.locationOrLink);
    const start = new Date(event.date).toISOString().replace(/-|:|\.\d\d\d/g, '');
    const end = new Date(new Date(event.date).getTime() + 3600000).toISOString().replace(/-|:|\.\d\d\d/g, ''); // +1 hour
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
  };

  if (loading) return <div className="min-h-screen bg-[#050810] text-blue-400 flex items-center justify-center font-mono animate-pulse uppercase tracking-widest">Scanning_Event_Vectors...</div>;

  // --- THE EVENT OPERATING SYSTEM VIEW ---
  if (activeOsEvent) {
    // Compute Fake Opportunity Match for Demo Mission Brief
    const simulatedMatches = osData.attendees.filter(a => a.user?._id !== loggedInUser?.id).slice(0, 3);
    const matchScore = userIntent ? Math.floor(Math.random() * 20) + 75 : 0; // 75-95 random score

    return (
      <div className="min-h-screen bg-[#050810] text-gray-200 font-sans selection:bg-emerald-500/30 flex flex-col overflow-hidden h-screen">
        <nav className="shrink-0 z-50 backdrop-blur-xl bg-[#050810]/70 border-b border-white/5 p-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <button onClick={() => { setActiveOsEvent(null); setOsData({ sessions: [], attendees: [] }); setUserIntent(null); }} className="p-2 text-gray-400 hover:text-emerald-400 transition bg-white/5 rounded-full">
              <ChevronLeft size={20} />
            </button>
            <div className="flex items-center gap-3">
              <Cpu className="text-emerald-400" size={24} />
              <h1 className="text-xl font-black text-white tracking-tight uppercase">Event Operating System</h1>
            </div>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 rounded-full uppercase tracking-widest">Live Telemetry</span>
        </nav>

        <div className="flex-1 flex overflow-hidden relative">
          <div className="absolute top-1/2 right-1/4 w-[600px] h-[600px] bg-emerald-600/5 rounded-full blur-[150px] pointer-events-none"></div>

          {/* LEFT COMPONENT: THE INTENT CAPTURE SYSTEM */}
          <aside className="w-full md:w-1/3 lg:w-1/4 border-r border-white/5 bg-[#0a0f1c]/80 overflow-y-auto z-10 flex flex-col p-6">
            <h2 className="text-2xl font-black text-white mb-2 leading-tight">{activeOsEvent.title}</h2>
            <p className="text-xs text-emerald-400 font-mono tracking-widest uppercase mb-6 flex items-center gap-2"><MapPin size={12} /> {activeOsEvent.locationOrLink}</p>

            {isOsLoading ? (
              <div className="flex-1 flex items-center justify-center text-emerald-400 animate-pulse font-mono text-xs uppercase tracking-widest"><Loader2 className="animate-spin mr-2" /> Syncing Hub</div>
            ) : userIntent ? (
              <div className="bg-emerald-900/10 border border-emerald-500/30 rounded-3xl p-6 relative overflow-hidden flex-1 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[40px]"></div>
                <h3 className="text-lg font-black text-white mb-6 relative z-10 flex items-center gap-2"><Target className="text-emerald-400" /> Intent Registered</h3>

                <div className="space-y-4 relative z-10">
                  <div>
                    <label className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">Active Directive</label>
                    <p className="text-sm font-bold text-white bg-black/40 px-3 py-2 rounded-lg border border-white/5 mt-1">{userIntent.attendingPurpose}</p>
                  </div>
                  <div>
                    <label className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">Target Acquisition</label>
                    <p className="text-sm font-bold text-emerald-300 bg-emerald-500/10 px-3 py-2 rounded-lg border border-emerald-500/20 mt-1">{userIntent.specificLookingFor || 'General Networking'}</p>
                  </div>
                  <div>
                    <label className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">Geographic Focus</label>
                    <p className="text-sm font-bold text-white bg-black/40 px-3 py-2 rounded-lg border border-white/5 mt-1">{userIntent.geographicRegion}</p>
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t border-emerald-500/20 text-center relative z-10">
                  <ShieldCheck size={32} className="mx-auto text-emerald-500 mb-2" />
                  <p className="text-[10px] font-mono text-emerald-400/80 uppercase tracking-widest">System Integrated</p>
                </div>
              </div>
            ) : (
              <div className="bg-[#050810] border border-white/10 rounded-3xl p-6 flex-1 shadow-2xl">
                <h3 className="text-lg font-black text-white mb-2 flex items-center gap-2"><Crosshair className="text-cyan-400" /> Capture Intent</h3>
                <p className="text-[10px] text-gray-400 font-mono uppercase tracking-widest mb-6">Define your parameters to unlock algorithmic matchmaking.</p>

                <form onSubmit={handleRegisterIntent} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">Primary Objective</label>
                    <select required value={intentForm.attendingPurpose} onChange={(e) => setIntentForm({ ...intentForm, attendingPurpose: e.target.value })} className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-cyan-500 outline-none">
                      <option value="Customers">Acquiring Customers</option>
                      <option value="Mentor">Seeking Mentorship</option>
                      <option value="Co-founder">Finding a Co-founder</option>
                      <option value="Funding">Raising Capital</option>
                      <option value="Hiring">Hiring Talent</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">Geographic Region</label>
                    <input required type="text" placeholder="e.g. North America, Global" value={intentForm.geographicRegion} onChange={(e) => setIntentForm({ ...intentForm, geographicRegion: e.target.value })} className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-cyan-500 outline-none" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">Specific Target</label>
                    <textarea required rows="2" placeholder="e.g. Looking for Seed Stage FinTech investors..." value={intentForm.specificLookingFor} onChange={(e) => setIntentForm({ ...intentForm, specificLookingFor: e.target.value })} className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-cyan-500 outline-none resize-none" />
                  </div>

                  <div className="space-y-3 pt-2">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" checked={intentForm.earlyStageFocus} onChange={(e) => setIntentForm({ ...intentForm, earlyStageFocus: e.target.checked })} className="w-4 h-4 rounded border-gray-600 bg-black checked:bg-cyan-500" />
                      <span className="text-[11px] font-bold text-gray-400 group-hover:text-white uppercase tracking-wider">Early Stage Focus</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" checked={intentForm.weekendAvailabilityOnly} onChange={(e) => setIntentForm({ ...intentForm, weekendAvailabilityOnly: e.target.checked })} className="w-4 h-4 rounded border-gray-600 bg-black checked:bg-cyan-500" />
                      <span className="text-[11px] font-bold text-gray-400 group-hover:text-white uppercase tracking-wider">Weekend Availability Only</span>
                    </label>
                  </div>

                  <button disabled={isIntentSubmitting} type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-black py-3.5 rounded-xl text-xs font-bold transition flex justify-center items-center gap-2 mt-4 shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                    {isIntentSubmitting ? <Loader2 size={16} className="animate-spin" /> : <><Zap size={16} /> Initialize Intent Vector</>}
                  </button>
                </form>
              </div>
            )}
          </aside>

          {/* RIGHT COMPONENT: THE OPERATING SYSTEM HUB */}
          <main className="flex-1 bg-transparent flex flex-col relative z-10 p-6 md:p-10 overflow-y-auto">

            {/* OS Navigation Tabs */}
            <div className="flex gap-2 mb-8 bg-[#0a0f1c]/50 p-1.5 rounded-2xl border border-white/5 inline-flex w-max backdrop-blur-md">
              <button onClick={() => setOsTab('agenda')} className={`px-6 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${osTab === 'agenda' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}><CalendarDays size={16} /> Lobby & Agenda</button>
              <button onClick={() => setOsTab('brief')} className={`px-6 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${osTab === 'brief' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.3)]' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}><Radar size={16} /> Mission Brief</button>
              <button onClick={() => setOsTab('deliverables')} className={`px-6 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${osTab === 'deliverables' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}><Layers size={16} /> Workspaces</button>
            </div>

            {/* TAB 1: LOBBY & AGENDA */}
            {osTab === 'agenda' && (
              <div className="animate-in fade-in max-w-4xl">
                <h2 className="text-2xl font-black text-white mb-6">Real-Time Event Timeline</h2>
                {osData.sessions.length === 0 ? (
                  <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl bg-black/30">
                    <Clock size={40} className="mx-auto text-gray-700 mb-4" />
                    <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">No timeline tracks injected into this vector.</p>
                  </div>
                ) : (
                  <div className="relative border-l border-white/10 ml-4 space-y-8 pb-10">
                    {osData.sessions.map((session, idx) => (
                      <div key={idx} className="relative pl-8">
                        <div className="absolute -left-2 top-1.5 w-4 h-4 rounded-full bg-[#050810] border-2 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                        <div className="bg-[#0a0f1c] border border-white/5 rounded-2xl p-6 hover:border-emerald-500/30 transition group">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition">{session.title}</h3>
                            <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded border border-emerald-500/20">{session.roomName}</span>
                          </div>
                          <p className="text-xs text-gray-400 font-mono mb-4">{new Date(session.startTime).toLocaleTimeString()} — {new Date(session.endTime).toLocaleTimeString()}</p>
                          {session.deliverables?.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/5">
                              {session.deliverables.map((d, i) => <span key={i} className="text-[10px] bg-white/5 text-gray-300 px-2 py-1 rounded-md border border-white/10">{d}</span>)}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: MISSION BRIEF */}
            {osTab === 'brief' && (
              <div className="animate-in fade-in max-w-5xl">
                {!userIntent ? (
                  <div className="text-center py-32 border border-dashed border-cyan-500/30 rounded-3xl bg-cyan-900/5 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
                    <Radar size={48} className="mx-auto text-cyan-600 mb-6 animate-spin-slow" />
                    <h3 className="text-xl font-black text-white mb-2">Algorithmic Brief Offline</h3>
                    <p className="text-gray-400 text-sm font-mono uppercase tracking-widest max-w-md mx-auto leading-relaxed">Initialize your Intent Vector on the left to compile your personalized Mission Brief and isolate target connections.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Opportunity Score Graphic */}
                    <div className="bg-[#0a0f1c] border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-cyan-500"></div>
                      <h3 className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-8">Opportunity Match Score</h3>

                      <div className="relative w-48 h-48 flex items-center justify-center shrink-0 mb-6">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                          <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="552" strokeDashoffset={552 - (552 * matchScore) / 100} className="text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.8)] transition-all duration-1000" />
                        </svg>
                        <div className="absolute flex flex-col items-center justify-center">
                          <span className="text-5xl font-black text-white">{matchScore}</span>
                          <span className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest mt-1">/ 100</span>
                        </div>
                      </div>
                      <p className="text-xs text-center text-gray-500 leading-relaxed">System has successfully isolated high-value targets based on your stated directives.</p>
                    </div>

                    {/* Matching Profiles */}
                    <div className="lg:col-span-2 space-y-4">
                      <h3 className="text-lg font-black text-white mb-2 flex items-center gap-2"><Users className="text-blue-400" /> High-Value Target Clusters</h3>
                      {simulatedMatches.length === 0 ? (
                        <div className="p-6 bg-black/40 border border-white/5 rounded-2xl text-center text-xs font-mono text-gray-500 uppercase">Awaiting network nodes to populate matrix.</div>
                      ) : (
                        simulatedMatches.map((match, i) => (
                          <div key={i} className="bg-gradient-to-r from-[#0a0f1c] to-black border border-white/10 p-5 rounded-2xl flex items-center justify-between gap-4 hover:border-blue-500/30 transition group">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-blue-900/30 flex items-center justify-center font-black text-blue-400 text-lg border border-blue-500/20 group-hover:scale-105 transition">
                                {match.user?.name?.charAt(0)}
                              </div>
                              <div>
                                <h4 className="text-sm font-bold text-white leading-tight">{match.user?.name}</h4>
                                <p className="text-[10px] text-blue-400 font-mono uppercase tracking-widest mb-1">{match.user?.role}</p>
                                <p className="text-xs text-gray-400 line-clamp-1">{match.user?.headline || 'Optimized for target directive'}</p>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">99% Match</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: WORKSPACES */}
            {osTab === 'deliverables' && (
              <div className="animate-in fade-in max-w-5xl">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <h2 className="text-2xl font-black text-white mb-1">Deliverables & Workspaces</h2>
                    <p className="text-sm text-gray-400">Establish direct links, coordinate meetings, or launch secure deal rooms with attendees.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  {osData.attendees.filter(a => a.user?._id !== loggedInUser?.id).map((attendee, i) => (
                    <div key={i} className="bg-[#0a0f1c] border border-white/5 p-6 rounded-3xl shadow-lg flex flex-col justify-between">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center font-bold text-white shrink-0">
                          {attendee.user?.name?.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-white">{attendee.user?.name}</h4>
                          <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">{attendee.user?.role}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1">
                          <MessageSquare size={14} /> Request Intro
                        </button>
                        <button className="flex-1 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 text-blue-400 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1">
                          <CalendarDays size={14} /> Book 15min Sync
                        </button>
                        <button onClick={() => navigate('/deals')} className="flex-1 bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1">
                          <Briefcase size={14} /> Compile Workspace
                        </button>
                      </div>
                    </div>
                  ))}
                  {osData.attendees.length <= 1 && (
                    <div className="col-span-full text-center py-10 text-gray-500 text-xs font-mono uppercase tracking-widest">
                      You are the first node to access this Event OS.
                    </div>
                  )}
                </div>
              </div>
            )}

          </main>
        </div>
      </div>
    );
  }

  // --- FALLBACK MOCK ICON FOR THE BUTTONS ---
  const Crosshair = ({ className }) => <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="22" y1="12" x2="18" y2="12" /><line x1="6" y1="12" x2="2" y2="12" /><line x1="12" y1="6" x2="12" y2="2" /><line x1="12" y1="22" x2="12" y2="18" /></svg>;

  return (
    <div className="min-h-screen bg-[#050810] text-gray-200 font-sans selection:bg-blue-500/30 pb-20 relative overflow-hidden">

      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none"></div>

      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#050810]/70 border-b border-white/5 p-4 flex justify-between items-center">
        <Link to="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition group">
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-mono text-xs tracking-widest uppercase">Command Center</span>
        </Link>
        <button onClick={() => setIsCreateOpen(true)} className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-full text-xs font-bold transition shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center gap-2">
          <Plus size={16} /> Deploy Event
        </button>
      </nav>

      <main className="max-w-7xl mx-auto mt-10 px-6 relative z-10">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight flex items-center gap-4 mb-2">
            <Ticket className="text-emerald-400" size={40} /> Global <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">Event Vectors</span>
          </h1>
          <p className="text-gray-400 text-sm">Discover networking opportunities, webinars, and sponsor high-impact industry events.</p>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl bg-[#0a0f1c]/50">
            <ShieldAlert size={48} className="mx-auto text-gray-600 mb-4" />
            <p className="text-gray-500 font-mono text-sm uppercase tracking-widest">No events deployed currently.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map(event => {
              const isFull = event.registeredAttendees?.length >= event.maxCapacity;
              const isRegistered = event.registeredAttendees?.includes(loggedInUser.id);
              const isSponsor = event.sponsors?.includes(loggedInUser.id);
              const isOrganizer = event.organizerId === loggedInUser.id;

              return (
                <div key={event._id} className="bg-[#0a0f1c] border border-white/10 rounded-3xl p-6 hover:border-emerald-500/30 transition-all duration-300 group flex flex-col relative overflow-hidden">

                  {/* Event Type Badge */}
                  <div className="absolute top-0 right-0 bg-white/5 border-b border-l border-white/10 px-4 py-1.5 rounded-bl-xl text-[10px] font-mono uppercase tracking-widest text-emerald-400">
                    {event.type}
                  </div>

                  <h2 className="text-xl font-bold text-white mb-2 pr-16 leading-tight">{event.title}</h2>
                  <p className="text-sm text-gray-400 mb-6 line-clamp-2">{event.description}</p>

                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3 text-xs text-gray-300 font-mono">
                      <Calendar size={14} className="text-blue-400" />
                      {new Date(event.date).toLocaleString()}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-300 font-mono">
                      <MapPin size={14} className="text-purple-400" />
                      <span className="truncate">{event.locationOrLink}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-300 font-mono">
                      <Users size={14} className="text-orange-400" />
                      {event.registeredAttendees?.length || 0} / {event.maxCapacity} Attendees
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="mt-auto pt-4 border-t border-white/5 flex flex-col gap-2">

                    {/* Organizer Manage Button */}
                    {isOrganizer ? (
                      <button onClick={() => handleOpenCommandCenter(event._id)} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl text-xs font-bold transition flex justify-center items-center gap-2 shadow-[0_0_15px_rgba(37,99,235,0.4)]">
                        <Settings size={16} /> Command Center
                      </button>
                    ) : (
                      <>
                        {/* THE NEW OS ACCESS BUTTON */}
                        <button onClick={() => { setActiveOsEvent(event); fetchOperatingSystem(event._id); }} className="w-full bg-white/5 hover:bg-emerald-600/20 border border-white/10 hover:border-emerald-500/50 text-white hover:text-emerald-400 py-3 rounded-xl text-xs font-bold transition flex justify-center items-center gap-2">
                          <Cpu size={16} /> Access Event OS
                        </button>

                        {/* OPTIONAL: Sponsor Button Kept for Escrow Logic */}
                        {event.acceptsSponsors && (
                          isSponsor ? (
                            <button disabled className="w-full bg-purple-500/10 text-purple-400 border border-purple-500/30 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2"><CheckCircle2 size={16} /> Official Sponsor</button>
                          ) : (
                            <button onClick={() => handleSponsor(event)} className="w-full bg-purple-600/20 hover:bg-purple-600 border border-purple-500/30 hover:border-purple-500 text-purple-300 hover:text-white py-3 rounded-xl text-xs font-bold transition flex justify-center items-center gap-2">
                              Sponsor Event <span className="font-mono bg-black/30 px-2 py-0.5 rounded text-[10px]">${event.sponsorshipPrice}</span>
                            </button>
                          )
                        )}
                      </>
                    )}

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* CREATE EVENT MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-[100] flex justify-center items-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl bg-[#0a0f1c] border border-white/10 rounded-3xl shadow-2xl p-8 overflow-y-auto max-h-[90vh] animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-black text-white tracking-tight mb-6">DEPLOY EVENT VECTOR</h2>

            {createError && (
              <div className="mb-6 bg-red-500/10 border border-red-500/50 rounded-xl p-4 flex items-start gap-3 text-sm text-red-200">
                <AlertCircle size={20} className="text-red-400 shrink-0" /> {createError}
              </div>
            )}

            <form onSubmit={handleCreateEvent} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">Event Title</label>
                <input required type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-emerald-500 outline-none transition" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Description</label>
                <textarea required rows="3" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-emerald-500 outline-none resize-none transition" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Format</label>
                  <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-emerald-500 outline-none transition">
                    <option value="Online">Online / Virtual</option>
                    <option value="Offline">Offline / Physical</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Location / Meet Link</label>
                  <input required type="text" value={formData.locationOrLink} onChange={(e) => setFormData({ ...formData, locationOrLink: e.target.value })} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-emerald-500 outline-none transition" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Date & Time</label>
                  <input required type="datetime-local" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-300 focus:border-emerald-500 outline-none transition [color-scheme:dark]" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Ticket ($)</label>
                    <input type="number" min="0" value={formData.ticketPrice} onChange={(e) => setFormData({ ...formData, ticketPrice: e.target.value })} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-emerald-500 outline-none transition font-mono" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Capacity</label>
                    <input required type="number" min="1" value={formData.maxCapacity} onChange={(e) => setFormData({ ...formData, maxCapacity: e.target.value })} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-emerald-500 outline-none transition font-mono" />
                  </div>
                </div>
              </div>

              <div className="p-4 border border-purple-500/30 bg-purple-900/10 rounded-2xl space-y-4 mt-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={formData.acceptsSponsors} onChange={(e) => setFormData({ ...formData, acceptsSponsors: e.target.checked })} className="w-5 h-5 rounded border-gray-600 bg-black checked:bg-purple-600 transition" />
                  <span className="text-sm font-bold text-purple-300">Accept Corporate Sponsorships</span>
                </label>
                {formData.acceptsSponsors && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                    <label className="text-[10px] font-mono text-purple-400 uppercase tracking-widest">Sponsorship Tier Price ($)</label>
                    <div className="relative">
                      <DollarSign size={16} className="absolute left-4 top-3 text-gray-500" />
                      <input type="number" min="0" value={formData.sponsorshipPrice} onChange={(e) => setFormData({ ...formData, sponsorshipPrice: e.target.value })} className="w-full bg-black border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:border-purple-500 outline-none transition font-mono" />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsCreateOpen(false)} className="flex-1 bg-white/5 hover:bg-white/10 text-white py-4 rounded-xl text-sm font-bold transition">Cancel</button>
                <button disabled={isSubmitting} type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-xl text-sm font-bold transition shadow-[0_0_15px_rgba(16,185,129,0.4)] flex justify-center items-center gap-2">
                  {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : 'Launch Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* COMMAND CENTER MODAL */}
      {isManageOpen && manageData && (
        <div className="fixed inset-0 z-[100] flex justify-center items-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-3xl bg-[#0a0f1c] border border-blue-500/30 rounded-3xl shadow-[0_0_50px_rgba(37,99,235,0.15)] p-8 overflow-y-auto max-h-[90vh] animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-6 border-b border-white/5 pb-4">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                  <Settings className="text-blue-400" /> EVENT COMMAND CENTER
                </h2>
                <p className="text-gray-400 text-sm mt-1">{manageData.event.title}</p>
              </div>
              <button onClick={() => setIsManageOpen(false)} className="bg-white/5 hover:bg-white/10 p-2 rounded-full text-white transition">X</button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-2xl">
                <p className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest mb-1">Escrow Revenue</p>
                <p className="text-3xl font-black text-emerald-400">${manageData.revenue}</p>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 p-5 rounded-2xl">
                <p className="text-[10px] font-mono text-blue-500 uppercase tracking-widest mb-1">Registered Nodes</p>
                <p className="text-3xl font-black text-blue-400">{manageData.attendees.length} / {manageData.event.maxCapacity}</p>
              </div>
            </div>

            {/* Broadcast */}
            <div className="bg-black/50 border border-white/5 rounded-2xl p-5 mb-6">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2"><Megaphone size={16} className="text-yellow-400" /> Network Broadcast</h3>
              <form onSubmit={async (e) => {
                e.preventDefault();
                setIsBroadcasting(true);
                try {
                  await apiClient.post(`/events/${manageData.event._id}/broadcast`, {
                    body: JSON.stringify({ message: broadcastMessage })
                  });
                  alert('Message transmitted to all attendees!'); setBroadcastMessage('');
                } catch (err) { console.error(err); } finally { setIsBroadcasting(false); }
              }} className="flex gap-2">
                <input required type="text" placeholder="Send secure update to all attendees..." value={broadcastMessage} onChange={(e) => setBroadcastMessage(e.target.value)} className="flex-1 bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-yellow-500 outline-none transition" />
                <button disabled={isBroadcasting} type="submit" className="bg-yellow-600 hover:bg-yellow-500 text-black px-6 rounded-xl text-sm font-bold transition flex items-center gap-2">{isBroadcasting ? <Loader2 className="animate-spin" size={16} /> : 'Transmit'}</button>
              </form>
            </div>

            {/* Attendee List */}
            <h3 className="text-sm font-bold text-white mb-3">Attendee Manifest</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {manageData.attendees.length === 0 && <p className="text-gray-500 text-xs font-mono uppercase">No registrations yet.</p>}
              {manageData.attendees.map(user => (
                <div key={user._id} className="bg-black border border-white/5 p-3 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-900/30 flex items-center justify-center font-bold text-blue-400 text-xs overflow-hidden">
                      {user.profilePictureUrl ? <img src={user.profilePictureUrl.startsWith('http') ? user.profilePictureUrl : `https://bizferbine-backend.onrender.com/${user.profilePictureUrl}`} className="w-full h-full object-cover" /> : user.name.charAt(0)}
                    </div>
                    <div><p className="text-sm font-bold text-white leading-none">{user.name}</p><p className="text-[10px] text-gray-500 font-mono mt-1">{user.role}</p></div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default EventsPage;
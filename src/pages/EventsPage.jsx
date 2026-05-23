// src/pages/EventsPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Ticket, Calendar, MapPin, Users, DollarSign, Plus, CheckCircle2, ShieldAlert, Loader2, AlertCircle, Settings, Download, Megaphone, CalendarDays } from 'lucide-react';

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
      const response = await fetch('https://bizferbine-backend.onrender.com/api/events', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
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
      const response = await fetch('https://bizferbine-backend.onrender.com/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
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

  // REGISTER AS ATTENDEE
  const handleRegister = async (event) => {
    if (event.ticketPrice > 0) {
      const confirmPay = window.confirm(`This is a premium event. Proceed to secure Razorpay checkout to pay $${event.ticketPrice}?`);
      if (!confirmPay) return;
    }
    try {
      const response = await fetch(`https://bizferbine-backend.onrender.com/api/events/${event._id}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ paymentSuccess: true }) // Simulating successful Razorpay gateway
      });
      const data = await response.json();
      if (data.requiresPayment) {
        alert(data.message); // The webhook response
      } else {
        alert(data.message);
      }
      if (response.ok) fetchEvents();
    } catch (err) { console.error(err); }
  };

  // REGISTER AS SPONSOR
  const handleSponsor = async (event) => {
    if (event.sponsorshipPrice > 0) {
      const confirmPay = window.confirm(`Proceed to Escrow Checkout to secure sponsorship for $${event.sponsorshipPrice}?`);
      if (!confirmPay) return;
    }
    try {
      const response = await fetch(`https://bizferbine-backend.onrender.com/api/events/${event._id}/sponsor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
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
      const response = await fetch(`https://bizferbine-backend.onrender.com/api/events/${eventId}/manage`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
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
                        {/* Attendee Button */}
                        {isRegistered ? (
                          <div className="flex gap-2">
                            <button disabled className="flex-1 bg-blue-500/10 text-blue-400 border border-blue-500/30 py-3 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1"><CheckCircle2 size={14} /> Registered</button>
                            <a href={generateCalendarLink(event)} target="_blank" rel="noreferrer" className="flex-1 bg-white/5 hover:bg-white/10 text-white border border-white/10 py-3 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1 transition"><CalendarDays size={14}/> Sync Cal</a>
                          </div>
                        ) : isFull ? (
                          <button disabled className="w-full bg-red-500/10 text-red-400 border border-red-500/30 py-3 rounded-xl text-xs font-bold uppercase tracking-widest">Sold Out</button>
                        ) : (
                          <button onClick={() => handleRegister(event)} className="w-full bg-white/5 hover:bg-blue-600 border border-white/10 hover:border-blue-500 text-white py-3 rounded-xl text-xs font-bold transition flex justify-center items-center gap-2">
                            Register <span className="font-mono bg-black/30 px-2 py-0.5 rounded text-[10px]">${event.ticketPrice}</span>
                          </button>
                        )}

                        {/* Sponsor Button */}
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
                <input required type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-emerald-500 outline-none transition" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Description</label>
                <textarea required rows="3" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-emerald-500 outline-none resize-none transition" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Format</label>
                  <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-emerald-500 outline-none transition">
                    <option value="Online">Online / Virtual</option>
                    <option value="Offline">Offline / Physical</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Location / Meet Link</label>
                  <input required type="text" value={formData.locationOrLink} onChange={(e) => setFormData({...formData, locationOrLink: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-emerald-500 outline-none transition" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Date & Time</label>
                  <input required type="datetime-local" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-300 focus:border-emerald-500 outline-none transition [color-scheme:dark]" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Ticket ($)</label>
                    <input type="number" min="0" value={formData.ticketPrice} onChange={(e) => setFormData({...formData, ticketPrice: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-emerald-500 outline-none transition font-mono" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Capacity</label>
                    <input required type="number" min="1" value={formData.maxCapacity} onChange={(e) => setFormData({...formData, maxCapacity: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-emerald-500 outline-none transition font-mono" />
                  </div>
                </div>
              </div>

              <div className="p-4 border border-purple-500/30 bg-purple-900/10 rounded-2xl space-y-4 mt-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={formData.acceptsSponsors} onChange={(e) => setFormData({...formData, acceptsSponsors: e.target.checked})} className="w-5 h-5 rounded border-gray-600 bg-black checked:bg-purple-600 transition" />
                  <span className="text-sm font-bold text-purple-300">Accept Corporate Sponsorships</span>
                </label>
                {formData.acceptsSponsors && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                    <label className="text-[10px] font-mono text-purple-400 uppercase tracking-widest">Sponsorship Tier Price ($)</label>
                    <div className="relative">
                      <DollarSign size={16} className="absolute left-4 top-3 text-gray-500" />
                      <input type="number" min="0" value={formData.sponsorshipPrice} onChange={(e) => setFormData({...formData, sponsorshipPrice: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:border-purple-500 outline-none transition font-mono" />
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
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2"><Megaphone size={16} className="text-yellow-400"/> Network Broadcast</h3>
              <form onSubmit={async (e) => {
                e.preventDefault();
                setIsBroadcasting(true);
                try {
                  await fetch(`https://bizferbine-backend.onrender.com/api/events/${manageData.event._id}/broadcast`, {
                    method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                    body: JSON.stringify({ message: broadcastMessage })
                  });
                  alert('Message transmitted to all attendees!'); setBroadcastMessage('');
                } catch (err) { console.error(err); } finally { setIsBroadcasting(false); }
              }} className="flex gap-2">
                <input required type="text" placeholder="Send secure update to all attendees..." value={broadcastMessage} onChange={(e) => setBroadcastMessage(e.target.value)} className="flex-1 bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-yellow-500 outline-none transition" />
                <button disabled={isBroadcasting} type="submit" className="bg-yellow-600 hover:bg-yellow-500 text-black px-6 rounded-xl text-sm font-bold transition flex items-center gap-2">{isBroadcasting ? <Loader2 className="animate-spin" size={16}/> : 'Transmit'}</button>
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
                      {user.profilePictureUrl ? <img src={`https://bizferbine-backend.onrender.com/${user.profilePictureUrl}`} className="w-full h-full object-cover"/> : user.name.charAt(0)}
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
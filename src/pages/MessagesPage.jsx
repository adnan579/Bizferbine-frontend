// src/pages/MessagesPage.jsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Send, MessageSquareLock, Search, UserCheck } from 'lucide-react';

const MessagesPage = () => {
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  
  // NEW: STATE FOR THE SEARCH BAR
  const [searchQuery, setSearchQuery] = useState('');
  
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  let loggedInUser = null;
  try {
    const userStr = localStorage.getItem('user');
    if (userStr && userStr !== "undefined") loggedInUser = JSON.parse(userStr);
  } catch (err) { console.error(err); }

  useEffect(() => {
    if (!loggedInUser?.id) {
      navigate('/login');
      return;
    }
    const fetchContacts = async () => {
      try {
        const res = await fetch('https://bizferbine-backend.onrender.com/api/network/connections', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (res.ok) setContacts(await res.json());
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchContacts();
  }, [navigate]);

  useEffect(() => {
    if (!activeContact) return;
    const fetchMessages = async () => {
      try {
        const res = await fetch(`https://bizferbine-backend.onrender.com/api/messages/${activeContact._id}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (res.ok) setMessages(await res.json());
      } catch (err) { console.error(err); }
    };
    fetchMessages();
  }, [activeContact]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeContact) return;

    try {
      const res = await fetch(`https://bizferbine-backend.onrender.com/api/messages/${activeContact._id}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify({ content: newMessage })
      });
      
      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, data.data]); 
        setNewMessage(''); 
      }
    } catch (err) { console.error(err); }
  };

  // NEW: FILTER THE CONTACTS BASED ON THE SEARCH QUERY
  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (contact.role && contact.role.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) return <div className="min-h-screen bg-[#050810] text-blue-400 flex items-center justify-center font-mono animate-pulse uppercase tracking-widest">Decrypting_Network_Nodes...</div>;

  return (
    <div className="min-h-screen bg-[#050810] text-gray-200 font-sans selection:bg-blue-500/30 flex flex-col h-screen overflow-hidden">
      
      <nav className="shrink-0 z-50 backdrop-blur-xl bg-[#050810]/70 border-b border-white/5 p-4 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="p-2 text-gray-400 hover:text-blue-400 transition bg-white/5 rounded-full">
            <ChevronLeft size={20} />
          </Link>
          <div className="flex items-center gap-3">
            <MessageSquareLock className="text-rose-400" size={24} />
            <h1 className="text-xl font-black text-white tracking-tight uppercase">Encrypted Comm Link</h1>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex overflow-hidden relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-rose-600/5 rounded-full blur-[150px] pointer-events-none"></div>

        <aside className="w-full md:w-1/3 lg:w-1/4 border-r border-white/5 bg-[#0a0f1c]/50 overflow-y-auto z-10 flex flex-col">
          <div className="p-4 border-b border-white/5">
            <div className="relative">
              {/* UPDATED: WIRED THE SEARCH INPUT */}
              <input 
                type="text" 
                placeholder="Search Connections..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-rose-500 transition text-white placeholder-gray-600" 
              />
              <Search size={14} className="absolute left-4 top-3 text-gray-500" />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {filteredContacts.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center gap-3">
                <UserCheck size={32} className="text-gray-700" />
                <p className="text-gray-500 text-xs font-mono uppercase tracking-widest leading-relaxed">No matching connections found.</p>
              </div>
            ) : (
              filteredContacts.map(contact => (
                <button 
                  key={contact._id}
                  onClick={() => setActiveContact(contact)}
                  className={`w-full p-4 flex items-center gap-4 text-left border-b border-white/5 hover:bg-white/5 transition relative ${activeContact?._id === contact._id ? 'bg-rose-500/10 border-l-2 border-l-rose-500' : 'border-l-2 border-l-transparent'}`}
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-rose-600 p-[1px] shrink-0">
                    <div className="w-full h-full rounded-full bg-[#050810] flex items-center justify-center font-bold text-white overflow-hidden">
                     {contact.profilePictureUrl ? <img src={contact.profilePictureUrl.startsWith('http') ? contact.profilePictureUrl : `https://bizferbine-backend.onrender.com/${contact.profilePictureUrl}`} className="w-full h-full object-cover" /> : contact.name.charAt(0)}
                    </div>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <h3 className="font-bold text-white truncate text-sm">{contact.name}</h3>
                    <p className="text-xs text-rose-400 font-mono truncate">{contact.role}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </aside>

        <main className="flex-1 bg-transparent flex flex-col relative z-10">
          {!activeContact ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <MessageSquareLock size={48} className="text-gray-800 mb-6" />
              <h2 className="text-xl font-bold text-white mb-2">Comm Channel Idle</h2>
              <p className="text-sm text-gray-500 font-mono max-w-md">Select a trusted connection from the directory to establish an end-to-end encrypted messaging session.</p>
            </div>
          ) : (
            <>
              <div className="p-4 border-b border-white/5 bg-[#0a0f1c]/80 backdrop-blur-md flex items-center gap-4 shrink-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-rose-600 p-[1px] shrink-0">
                    <div className="w-full h-full rounded-full bg-[#050810] flex items-center justify-center font-bold text-white overflow-hidden">
                   {activeContact.profilePictureUrl ? <img src={activeContact.profilePictureUrl.startsWith('http') ? activeContact.profilePictureUrl : `https://bizferbine-backend.onrender.com/${activeContact.profilePictureUrl}`} className="w-full h-full object-cover" /> : activeContact.name.charAt(0)}
                    </div>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white leading-tight">{activeContact.name}</h2>
                  <Link to={`/profile/${activeContact._id}`} className="text-[10px] text-gray-500 hover:text-rose-400 font-mono uppercase tracking-widest transition">View Identity Vector →</Link>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-600 text-xs font-mono uppercase tracking-widest">
                    Encryption established. Say hello.
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMe = msg.sender === loggedInUser.id;
                    return (
                      <div key={msg._id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                        <div className={`max-w-md px-5 py-3 rounded-2xl ${isMe ? 'bg-rose-600 text-white rounded-br-sm' : 'bg-white/10 text-gray-200 border border-white/5 rounded-bl-sm'}`}>
                          <p className="text-sm">{msg.content}</p>
                        </div>
                        <span className="text-[9px] text-gray-600 font-mono mt-1 px-2 uppercase">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 bg-[#0a0f1c]/90 border-t border-white/5 backdrop-blur-xl shrink-0">
                <form onSubmit={handleSendMessage} className="flex gap-3">
                  <input 
                    type="text" required placeholder="Type an encrypted message..." 
                    value={newMessage} onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 bg-black border border-white/10 rounded-full px-6 py-3 text-sm text-white focus:outline-none focus:border-rose-500 transition"
                  />
                  <button type="submit" className="bg-rose-600 hover:bg-rose-500 text-white p-3 rounded-full flex items-center justify-center transition shadow-[0_0_15px_rgba(225,29,72,0.4)]">
                    <Send size={18} className="ml-1" />
                  </button>
                </form>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default MessagesPage;
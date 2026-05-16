// src/pages/ProfilePage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { MapPin, Link as LinkIcon, Code, Users, Briefcase, Award, Zap, ChevronLeft, ExternalLink, Trash2, ThumbsUp, MessageSquare, UserPlus, Handshake, Star, Settings, Network, ShieldCheck } from 'lucide-react';
import EditProfileModal from './EditProfileModal';
import AddPortfolioModal from './AddPortfolioModal';

const ProfilePage = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(''); // RESTORED
  
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPortfolioOpen, setIsPortfolioOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const navigate = useNavigate();
  const { userId } = useParams(); 
  
  let loggedInUser = null;
  try {
    const userStr = localStorage.getItem('user');
    if (userStr && userStr !== "undefined") loggedInUser = JSON.parse(userStr);
  } catch (err) { console.error(err); }

  const targetProfileId = userId || loggedInUser?.id;
  const isOwnProfile = targetProfileId === loggedInUser?.id;

  const fetchProfile = async () => {
    try {
      const response = await fetch(`https://bizferbine-backend.onrender.com/api/profile/${targetProfileId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      if (response.ok) setProfileData(data);
      else setError(data.message || 'Failed to load profile.');
    } catch (err) { setError('Server connection error.'); } 
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (!loggedInUser?.id) navigate('/login');
    else fetchProfile();
  }, [targetProfileId, navigate]);

  const handleFollowToggle = async () => {
    try {
      const res = await fetch(`https://bizferbine-backend.onrender.com/api/network/follow/${targetProfileId}`, {
        method: 'POST', headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) fetchProfile(); 
    } catch (err) { console.error('Follow error', err); }
  };

  const handleConnectRequest = async () => {
    try {
      const res = await fetch(`https://bizferbine-backend.onrender.com/api/network/connect/${targetProfileId}`, {
        method: 'POST', headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      alert(data.message); 
    } catch (err) { console.error('Connect error', err); }
  };

  // RESTORED: Portfolio Deletion Logic
  const handleDeletePortfolio = async (portfolioId) => {
    if (!window.confirm('Are you sure you want to delete this case study?')) return;
    try {
      const response = await fetch(`https://bizferbine-backend.onrender.com/api/profile/portfolio/${portfolioId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setProfileData(prev => ({ ...prev, profile: { ...prev.profile, portfolio: data.portfolio } }));
      }
    } catch (err) { console.error(err); }
  };

  // RESTORED: Insight Deletion Logic
  const handleDeleteInsight = async (insightId) => {
    if (!window.confirm('Are you sure you want to delete this insight?')) return;
    try {
      const response = await fetch(`https://bizferbine-backend.onrender.com/api/insights/${insightId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const updatedFeed = profileData.thoughtLeadershipFeed.filter(insight => insight._id !== insightId);
        setProfileData(prev => ({ ...prev, thoughtLeadershipFeed: updatedFeed }));
      }
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="min-h-screen bg-[#050810] text-blue-400 flex items-center justify-center font-mono animate-pulse uppercase tracking-widest">Fetching_Network_Node...</div>;

  const profile = profileData?.profile || {};
  const networkPulse = profileData?.networkPulse || { followersCount: 0, followingCount: 0 };
  const reputation = profileData?.reputation || { score: 50, badges: [] };
  const thoughtLeadershipFeed = profileData?.thoughtLeadershipFeed || [];
  const isFollowing = profile.followers?.some(id => id === loggedInUser.id);

  return (
    <div className="min-h-screen bg-[#050810] text-gray-200 font-sans selection:bg-blue-500/30 pb-20">
      
      {isOwnProfile && (
        <>
          <EditProfileModal profile={profile} isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} onUpdate={(upd) => setProfileData({ ...profileData, profile: upd })} />
          <AddPortfolioModal isOpen={isPortfolioOpen} onClose={() => setIsPortfolioOpen(false)} onUpdate={(upd) => setProfileData({ ...profileData, profile: { ...profile, portfolio: upd } })} />
        </>
      )}

      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#050810]/70 border-b border-white/5 p-4 flex justify-between items-center">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition group">
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-mono text-xs tracking-widest uppercase">Go Back</span>
        </button>
      </nav>

      <header className="relative max-w-5xl mx-auto mt-4 md:mt-6 rounded-3xl overflow-visible border border-white/10 bg-[#0a0f1c] shadow-[0_0_40px_rgba(37,99,235,0.1)] mx-4 md:mx-auto">
        
        {isOwnProfile && (
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2 md:gap-3">
            <Link to="/network" className="p-2 md:p-2.5 bg-black/50 hover:bg-black/80 text-white rounded-full backdrop-blur-md transition border border-white/10 shadow-lg" title="Network Core">
              <Network size={20} />
            </Link>

            <div className="relative">
              <button onClick={() => setIsSettingsOpen(!isSettingsOpen)} className={`p-2 md:p-2.5 rounded-full backdrop-blur-md transition border shadow-lg ${isSettingsOpen ? 'bg-blue-600 border-blue-500 text-white' : 'bg-black/50 hover:bg-black/80 border-white/10 text-white'}`}>
                <Settings size={20} className={isSettingsOpen ? 'animate-spin-slow' : ''} />
              </button>
              {isSettingsOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-[#0a0f1c]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in z-50">
                  <button onClick={() => { setIsEditOpen(true); setIsSettingsOpen(false); }} className="w-full text-left px-5 py-3 text-sm font-bold text-gray-300 hover:bg-white/5 hover:text-white transition">Edit Parameters</button>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="h-40 md:h-64 w-full bg-gradient-to-r from-blue-900 to-indigo-900 relative rounded-t-3xl overflow-hidden">
          {profile?.profileBannerUrl && <img src={`https://bizferbine-backend.onrender.com/${profile.profileBannerUrl}`} alt="Banner" className="w-full h-full object-cover opacity-60" />}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1c] to-transparent"></div>
        </div>

        <div className="px-5 md:px-8 pb-6 md:pb-8 relative -mt-16 md:-mt-20 flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 text-center md:text-left">
          
          <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl bg-[#050810] border-2 border-blue-500 p-1 shadow-[0_0_20px_rgba(59,130,246,0.5)] z-10 shrink-0 relative overflow-hidden">
             {profile?.profilePictureUrl ? (
               <img src={`https://bizferbine-backend.onrender.com/${profile.profilePictureUrl}`} alt="Profile" className="w-full h-full object-cover rounded-xl" />
             ) : (
               <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-3xl md:text-4xl font-black text-white">
                 {profile?.name ? profile.name.charAt(0).toUpperCase() : 'U'}
               </div>
             )}
          </div>

          <div className="flex-1 mb-2 z-10 mt-2 w-full">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
               <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight">{profile?.name || 'Unknown User'}</h1>
               <div className="flex flex-wrap justify-center md:justify-start gap-2">
                 {reputation.badges.map(badge => (
                   <span key={badge} className="px-2 py-1 md:px-2.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[9px] md:text-[10px] font-bold uppercase tracking-widest rounded-lg flex items-center gap-1">
                     <ShieldCheck size={12} /> {badge}
                   </span>
                 ))}
               </div>
            </div>

            {profile?.username && <p className="text-blue-500 font-mono text-sm tracking-widest mb-1 mt-1">@{profile.username}</p>}
            <p className="text-gray-400 font-mono text-[9px] md:text-[10px] tracking-widest uppercase mt-2 mb-2">{profile?.role || 'Network User'} • {profile?.industry || 'General'}</p>
            <p className="text-gray-300 text-sm md:text-lg max-w-2xl px-2 md:px-0">{profile?.headline || 'Establishing system branding...'}</p>
            
            {!isOwnProfile && (
              <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-2 md:gap-3 mt-5 w-full">
                <button onClick={handleFollowToggle} className={`w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition ${isFollowing ? 'bg-white/10 text-white hover:bg-red-500/20 hover:text-red-400 border border-white/10' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]'}`}>
                  <UserPlus size={16} /> {isFollowing ? 'Unfollow' : 'Follow Node'}
                </button>
                <button onClick={handleConnectRequest} className="w-full md:w-auto flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition">
                  <Handshake size={16} /> Connect
                </button>
                <Link to={`/messages`} className="w-full md:w-auto flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white p-2.5 rounded-xl transition">
                  <MessageSquare size={16} /> <span className="md:hidden text-xs font-bold">Message</span>
                </Link>
              </div>
            )}
          </div>

          <div className="mt-4 md:mt-0 z-10 shrink-0 bg-black/50 border border-white/10 p-4 rounded-2xl flex flex-col items-center w-full md:w-auto">
             <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2">Reputation Index</div>
             <div className="relative w-16 h-16 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                   <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/5" />
                   <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray="175" strokeDashoffset={175 - (175 * reputation.score) / 100} className="text-blue-500 transition-all duration-1000" />
                </svg>
                <span className="absolute text-xl font-black text-white">{reputation.score}</span>
             </div>
             <div className="text-[9px] text-blue-400 uppercase tracking-widest mt-2">Global Standing</div>
          </div>
        </div>

        <div className="grid grid-cols-3 border-t border-white/5 bg-[#050810]/50 divide-x divide-white/5 rounded-b-3xl">
          <div className="p-3 md:p-4 text-center">
            <div className="text-xl md:text-2xl font-black text-white">{networkPulse?.followersCount || 0}</div>
            <div className="text-[9px] md:text-[10px] text-gray-500 font-mono uppercase tracking-widest mt-1">Followers</div>
          </div>
          <div className="p-3 md:p-4 text-center">
            <div className="text-xl md:text-2xl font-black text-white">{networkPulse?.followingCount || 0}</div>
            <div className="text-[9px] md:text-[10px] text-gray-500 font-mono uppercase tracking-widest mt-1">Following</div>
          </div>
          <div className="p-3 md:p-4 text-center">
            <div className="text-xl md:text-2xl font-black text-white">{profile?.testimonials?.length || 0}</div>
            <div className="text-[9px] md:text-[10px] text-gray-500 font-mono uppercase tracking-widest mt-1">Endorsements</div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto mt-6 md:mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 px-4 md:px-0">
        <div className="space-y-6 md:space-y-8">
          <section className="bg-[#0a0f1c] border border-white/10 rounded-3xl p-5 md:p-6">
            <h2 className="text-white font-bold mb-4 flex items-center gap-2 uppercase tracking-widest text-[10px] font-mono text-gray-500">
              <Briefcase size={14} className="text-blue-400" /> Identity Bio
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed">{profile?.bio || 'Initializing bio vector...'}</p>
            {profile?.location && (
              <div className="flex items-center gap-2 mt-4 text-sm text-gray-400 font-mono">
                <MapPin size={14} className="text-purple-400 shrink-0" /> {profile.location}
              </div>
            )}
          </section>

          <section className="bg-[#0a0f1c] border border-white/10 rounded-3xl p-5 md:p-6">
            <h2 className="text-white font-bold mb-4 flex items-center gap-2 uppercase tracking-widest text-[10px] font-mono text-gray-500">
              <Zap size={14} className="text-yellow-400" /> Skill Matrix
            </h2>
            <div className="flex flex-wrap gap-2">
              {profile?.skills?.length > 0 ? profile.skills.map((skill, index) => (
                <span key={index} className="px-3 py-1.5 bg-black border border-white/10 text-gray-300 rounded-lg text-[10px] font-mono uppercase tracking-tighter">
                  {skill}
                </span>
              )) : <span className="text-xs text-gray-600">No skills identified.</span>}
            </div>
          </section>

          <section className="bg-[#0a0f1c] border border-white/10 rounded-3xl p-5 md:p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-white font-bold flex items-center gap-2 uppercase tracking-widest text-[10px] font-mono text-gray-500">
                <Star size={14} className="text-yellow-400 fill-yellow-400/20" /> Trade Reviews
              </h2>
              {profile?.barterReviews?.length > 0 && (
                <div className="flex items-center gap-1 text-sm font-bold text-yellow-400 bg-yellow-500/10 px-2 py-1 rounded-lg border border-yellow-500/20">
                  <Star size={14} className="fill-yellow-400" />
                  {(profile.barterReviews.reduce((acc, curr) => acc + curr.rating, 0) / profile.barterReviews.length).toFixed(1)}
                </div>
              )}
            </div>

            {profile?.barterReviews?.length > 0 ? (
              <div className="space-y-4">
                {profile.barterReviews.map((review, index) => (
                  <div key={index} className="bg-black border border-white/5 p-4 rounded-2xl">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#050810] border border-white/10 overflow-hidden flex items-center justify-center font-bold text-white text-xs">
                          {review.reviewer?.name?.charAt(0)}
                        </div>
                        <span className="text-xs text-gray-300 font-bold truncate max-w-[100px]">{review.reviewer?.name}</span>
                      </div>
                      <div className="flex gap-0.5 shrink-0">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star key={star} size={10} className={review.rating >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-700"} />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed italic">"{review.text}"</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-600 font-mono uppercase tracking-widest text-center py-4">No trade reviews yet.</p>
            )}
          </section>

          {(profile?.socialLinks?.linkedIn || profile?.socialLinks?.github || profile?.socialLinks?.website) && (
            <section className="bg-[#0a0f1c] border border-white/10 rounded-3xl p-5 md:p-6">
              <h2 className="text-white font-bold mb-4 flex items-center gap-2 uppercase tracking-widest text-[10px] font-mono text-gray-500">
                <LinkIcon size={14} className="text-emerald-400" /> External Nodes
              </h2>
              <div className="space-y-4 mt-2">
                {profile.socialLinks.website && (
                  <a href={profile.socialLinks.website} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm text-gray-300 hover:text-emerald-400 transition group break-all">
                    <LinkIcon size={16} className="text-gray-500 group-hover:text-emerald-400 transition shrink-0" /> Personal Website
                  </a>
                )}
                {profile.socialLinks.linkedIn && (
                  <a href={profile.socialLinks.linkedIn} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm text-gray-300 hover:text-blue-400 transition group break-all">
                    <Users size={16} className="text-gray-500 group-hover:text-blue-400 transition shrink-0" /> LinkedIn Profile
                  </a>
                )}
                {profile.socialLinks.github && (
                  <a href={profile.socialLinks.github} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm text-gray-300 hover:text-purple-400 transition group break-all">
                    <Code size={16} className="text-gray-500 group-hover:text-purple-400 transition shrink-0" /> GitHub Repository
                  </a>
                )}
              </div>
            </section>
          )}

        </div>

        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          <section className="bg-[#0a0f1c] border border-white/10 rounded-3xl p-5 md:p-8 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-[50px] pointer-events-none"></div>
             <div className="flex justify-between items-center mb-6 md:mb-8 relative z-10">
               <h2 className="text-white font-bold flex items-center gap-2 uppercase tracking-widest text-[10px] font-mono text-gray-500"><Award size={14} className="text-blue-400" /> High-Impact Portfolio</h2>
               {isOwnProfile && <button onClick={() => setIsPortfolioOpen(true)} className="text-[9px] md:text-[10px] font-mono text-blue-400 hover:text-blue-300 uppercase tracking-widest border border-blue-500/30 px-3 py-1.5 rounded-full hover:bg-blue-500/10 transition">+ Deploy</button>}
             </div>
            
            {profile?.portfolio && profile.portfolio.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {profile.portfolio.map((item, index) => (
                  <div key={item._id || index} className="bg-black border border-white/5 rounded-2xl overflow-hidden group flex flex-col relative hover:border-blue-500/30 transition-colors">
                    {/* RESTORED: Delete Portfolio Button */}
                    {isOwnProfile && <button onClick={() => handleDeletePortfolio(item._id)} className="absolute top-2 right-2 p-2 bg-black/60 text-gray-400 hover:text-red-400 rounded-full transition z-20 md:opacity-0 md:group-hover:opacity-100"><Trash2 size={16} /></button>}
                    
                    {item.imageUrl ? <div className="h-32 w-full overflow-hidden border-b border-white/5"><img src={`https://bizferbine-backend.onrender.com/${item.imageUrl}`} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" /></div> : <div className="h-2 w-full bg-gradient-to-r from-blue-600 to-indigo-600"></div>}
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                      <p className="text-sm text-gray-400 mb-4">{item.solution}</p>
                      
                      {item.result && <div className="mt-auto mb-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs p-3 rounded-lg font-mono">🚀 Impact: {item.result}</div>}
                      
                      <div className="flex gap-3 text-xs mt-auto">
                        {item.projectUrl && <a href={item.projectUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-blue-400 hover:underline"><ExternalLink size={12}/> Live Link</a>}
                        {item.githubUrl && <a href={item.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-purple-400 hover:underline"><Code size={12}/> Source Code</a>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : <div className="text-center py-10 border border-dashed border-white/5 rounded-2xl"><p className="text-gray-600 text-xs font-mono uppercase tracking-widest">No project vectors deployed</p></div>}
          </section>

          <section className="bg-[#0a0f1c] border border-white/10 rounded-3xl p-5 md:p-8">
             <h2 className="text-white font-bold mb-6 flex items-center gap-2 uppercase tracking-widest text-[10px] font-mono text-gray-500"><Zap size={14} className="text-yellow-400" /> Thought Leadership</h2>
            
            {thoughtLeadershipFeed.length > 0 ? (
              <div className="space-y-6">
                {thoughtLeadershipFeed.map((insight) => {
                  const hasLiked = insight.likes?.includes(loggedInUser?.id);
                  return (
                    <div key={insight._id} className="bg-black border border-white/5 rounded-2xl p-5 relative group">
                      {/* RESTORED: Delete Insight Button */}
                      {isOwnProfile && <button onClick={() => handleDeleteInsight(insight._id)} className="absolute top-4 right-4 p-2 text-gray-500 hover:text-red-400 md:opacity-0 md:group-hover:opacity-100 transition z-20 bg-black/40 rounded-full"><Trash2 size={16} /></button>}
                      
                      {insight.imageUrl && <img src={`https://bizferbine-backend.onrender.com/${insight.imageUrl}`} alt="Insight" className="w-full h-40 object-cover rounded-xl mb-4" />}
                      <h3 className="text-md font-bold text-white mb-2 pr-10">{insight.title}</h3>
                      <p className="text-sm text-gray-400 mb-4">{insight.content}</p>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {insight.tags?.map(tag => <span key={tag} className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-2 py-1 rounded">#{tag}</span>)}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : <div className="text-center py-6"><p className="text-gray-600 text-xs font-mono uppercase tracking-widest">No insights published yet</p></div>}
          </section>

        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
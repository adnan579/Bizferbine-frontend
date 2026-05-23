// src/pages/SearchPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Search, ChevronLeft, MapPin } from 'lucide-react';

const SearchPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('q') || '';

  const [searchInput, setSearchInput] = useState(searchQuery);

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://bizferbine-backend.onrender.com/api/users?q=${searchQuery}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (response.ok) {
          setUsers(await response.json());
        }
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        setLoading(false);
      }
    };

    if (searchQuery) fetchSearchResults();
    else setLoading(false);
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) navigate(`/search?q=${encodeURIComponent(searchInput)}`);
  };

  return (
    <div className="min-h-screen bg-[#050810] text-gray-200 font-sans selection:bg-blue-500/30 pb-20">
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#050810]/70 border-b border-white/5 p-4 flex gap-4 items-center">
        <Link to="/dashboard" className="p-2 text-gray-400 hover:text-blue-400 transition bg-white/5 rounded-full">
          <ChevronLeft size={20} />
        </Link>
        <form onSubmit={handleSearch} className="flex-1 max-w-2xl relative">
          <input 
            type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Query Network..." 
            className="w-full bg-[#0a0f1c] border border-white/10 rounded-full px-12 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50"
          />
          <Search size={16} className="absolute left-5 top-3.5 text-gray-500" />
        </form>
      </nav>

      <main className="max-w-5xl mx-auto mt-8 px-6">
        <h1 className="text-2xl font-black text-white mb-8">
          System Results for: <span className="text-blue-400">"{searchQuery}"</span>
        </h1>

        {loading ? (
          <div className="text-blue-400 font-mono animate-pulse">Scanning Global Network...</div>
        ) : users.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map(user => (
              <div key={user._id} className="bg-[#0a0f1c] border border-white/10 rounded-3xl p-6 hover:border-blue-500/30 transition group flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-[#050810] border-2 border-white/10 p-1 mb-4 overflow-hidden">
                  {user.profilePictureUrl ? (
                <img src={user.profilePictureUrl.startsWith('http') ? user.profilePictureUrl : `https://bizferbine-backend.onrender.com/${user.profilePictureUrl}`} alt={user.name} className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-2xl font-black text-white">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-bold text-white leading-tight">{user.name}</h3>
                {user.username && <p className="text-blue-400 font-mono text-[10px] tracking-widest mt-1 mb-3">@{user.username}</p>}
                <p className="text-xs text-gray-400 mb-4 line-clamp-2">{user.headline || 'Network Node'}</p>
                
                <Link to={`/profile/${user._id}`} className="mt-auto w-full bg-white/5 hover:bg-blue-600/20 text-white hover:text-blue-400 border border-white/10 hover:border-blue-500/50 py-2.5 rounded-xl text-xs font-bold transition uppercase tracking-widest">
                  View Data Profile
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 font-mono">No nodes match your query parameters.</div>
        )}
      </main>
    </div>
  );
};

export default SearchPage;
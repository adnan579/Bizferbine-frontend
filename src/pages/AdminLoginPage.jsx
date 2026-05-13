// src/pages/AdminLoginPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, KeyRound, Loader2, ServerCog } from 'lucide-react';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Hit the standard login route
      const response = await fetch('https://bizferbine-backend.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // BUG FIX: Removed the strict frontend role check. 
        // The backend verifyAdmin middleware will securely protect the actual dashboard data.

        // Success! Save token and log them into the whole platform
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Route directly to the Admin Panel
        navigate('/admin');
      } else {
        setError(data.message || 'Invalid credentials.');
      }
    } catch (err) {
      setError('Server connection failed.');
    } finally {
      setLoading(false);
    }
  };

  // Helper to generate the account for the very first time
  const initializeAdminAccount = async () => {
    try {
      const res = await fetch('https://bizferbine-backend.onrender.com/api/admin/init-overseer', { method: 'POST' });
      const data = await res.json();
      alert(data.message + "\n\nEmail: admin@bizferbine.com\nPassword: Overseer2026!");
    } catch (err) {
      alert("Failed to initialize.");
    }
  };

  return (
    <div className="min-h-screen bg-[#020408] flex flex-col items-center justify-center relative overflow-hidden font-sans">
      
      {/* Security Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-900/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md bg-[#050810] border border-rose-500/30 p-8 rounded-3xl shadow-[0_0_50px_rgba(225,29,72,0.15)] animate-in zoom-in-95">
        
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center justify-center mb-4">
            <ShieldAlert size={32} className="text-rose-500" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-widest uppercase">Overseer Portal</h1>
          <p className="text-xs text-rose-400 font-mono mt-2 tracking-widest uppercase">Restricted Access</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-sm mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleAdminLogin} className="space-y-5">
          <div>
            <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2 block">Admin Identification</label>
            <input 
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-rose-500 outline-none transition" 
              placeholder="admin@bizferbine.com"
            />
          </div>
          <div>
            <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2 block">Security Passkey</label>
            <input 
              type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-rose-500 outline-none transition" 
              placeholder="••••••••••••"
            />
          </div>

          <button disabled={loading} type="submit" className="w-full bg-rose-600 hover:bg-rose-500 text-white py-4 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(225,29,72,0.4)] mt-4">
            {loading ? <Loader2 size={18} className="animate-spin" /> : <><KeyRound size={16} /> Authenticate Session</>}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <button onClick={initializeAdminAccount} className="text-[10px] text-gray-600 hover:text-gray-400 font-mono uppercase tracking-widest flex items-center justify-center gap-1 mx-auto transition">
            <ServerCog size={12} /> Initialize System Admin Node
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
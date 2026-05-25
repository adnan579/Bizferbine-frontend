// src/pages/ForgotPassword.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Loader2, ArrowLeft, CheckCircle2, ShieldAlert } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://bizferbine-backend.onrender.com/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
      } else {
        setError(data.message || 'Failed to initiate password reset.');
      }
    } catch (err) {
      setError('Server connection failed. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020408] flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Security Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md bg-[#050810] border border-blue-500/30 p-8 rounded-3xl shadow-[0_0_50px_rgba(37,99,235,0.15)] animate-in zoom-in-95">
        
        {success ? (
          <div className="flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-500">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
              <CheckCircle2 size={32} className="text-emerald-500" />
            </div>
            <h2 className="text-2xl font-black text-white tracking-widest uppercase mb-2">Recovery Sent</h2>
            <p className="text-sm text-gray-400 mb-8">If an account exists with that address, a secure recovery link has been transmitted.</p>
            <Link to="/login" className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.4)]">
              Return to Login
            </Link>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/30 rounded-2xl flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(37,99,235,0.15)]">
                <ShieldAlert size={32} className="text-blue-500" />
              </div>
              <h1 className="text-2xl font-black text-white tracking-widest uppercase">System Recovery</h1>
              <p className="text-xs text-blue-400 font-mono mt-2 tracking-widest uppercase">Lost Access Protocol</p>
            </div>
            {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-sm mb-6 text-center">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-3.5 text-gray-500" />
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:border-blue-500 outline-none transition" placeholder="Enter registration email" />
              </div>
              <button disabled={loading} type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.4)] disabled:opacity-50">
                {loading ? <Loader2 size={18} className="animate-spin" /> : 'Transmit Recovery Link'}
              </button>
            </form>
          </>
        )}
        {!success && <div className="mt-8 pt-6 border-t border-white/5 text-center"><Link to="/login" className="text-[10px] text-gray-500 hover:text-gray-300 font-mono uppercase tracking-widest flex items-center justify-center gap-1 mx-auto transition"><ArrowLeft size={12} /> Abort Recovery</Link></div>}
      </div>
    </div>
  );
};
export default ForgotPassword;
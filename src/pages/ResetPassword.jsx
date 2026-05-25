// src/pages/ResetPassword.jsx
import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { KeyRound, Lock, Loader2, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError("Security error: Passphrases do not match.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Passphrase must be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`https://bizferbine-backend.onrender.com/api/auth/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
      } else {
        setError(data.message || 'Invalid or expired recovery token.');
      }
    } catch (err) {
      setError('Server connection failed. Cannot execute reset.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020408] flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none transition-colors duration-1000 ${success ? 'bg-emerald-900/10' : 'bg-purple-900/10'}`}></div>

      <div className="relative z-10 w-full max-w-md bg-[#050810] border border-white/5 p-8 rounded-3xl shadow-[0_0_50px_rgba(16,185,129,0.05)] animate-in zoom-in-95">
        
        {success ? (
          <div className="flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-500">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
              <ShieldCheck size={32} className="text-emerald-500" />
            </div>
            <h2 className="text-2xl font-black text-white tracking-widest uppercase mb-2">Access Restored</h2>
            <p className="text-sm text-gray-400 mb-8">Your new security passphrase has been encrypted and saved.</p>
            <button onClick={() => navigate('/login')} className="w-full bg-emerald-600 hover:bg-emerald-500 text-black py-4 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.4)]">
              <KeyRound size={18} /> Access System Portal
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-16 h-16 bg-purple-500/10 border border-purple-500/30 rounded-2xl flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(168,85,247,0.15)]"><KeyRound size={32} className="text-purple-500" /></div>
              <h1 className="text-2xl font-black text-white tracking-widest uppercase">Reset Passphrase</h1>
              <p className="text-xs text-purple-400 font-mono mt-2 tracking-widest uppercase">Encryption override active</p>
            </div>
            {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-sm mb-6 text-center flex items-center justify-center gap-2"><AlertCircle size={16} /> {error}</div>}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative"><Lock size={16} className="absolute left-4 top-3.5 text-gray-500" /><input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:border-purple-500 outline-none transition" placeholder="New Passphrase" /></div>
              <div className="relative"><Lock size={16} className="absolute left-4 top-3.5 text-gray-500" /><input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:border-purple-500 outline-none transition" placeholder="Confirm Passphrase" /></div>
              <button disabled={loading} type="submit" className="w-full bg-purple-600 hover:bg-purple-500 text-white py-4 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.4)] disabled:opacity-50">{loading ? <Loader2 size={18} className="animate-spin" /> : 'Confirm Override'}</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
export default ResetPassword;
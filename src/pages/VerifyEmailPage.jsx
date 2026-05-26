// src/pages/VerifyEmailPage.jsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, Loader2, XOctagon, KeyRound } from 'lucide-react';
import apiClient from '../utils/apiClient';

const VerifyEmailPage = () => {
  const { token } = useParams(); // Grabs the token from the URL
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('Decrypting identity token...');

  useEffect(() => {
    // We only want to run this once when the page loads
    if (token) {
      verifyIdentity();
    }
  }, [token]);

  const verifyIdentity = async () => {
    try {
      const res = await apiClient.get(`/auth/verify/${token}`);
      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage(data.message || 'Identity verified successfully! You may now log in.');
      } else {
        setStatus('error');
        setMessage(data.message || 'Invalid or expired verification link.');
      }
    } catch (err) {
      setStatus('error');
      setMessage('Server connection failed. Could not verify identity.');
    }
  };

  return (
    <div className="min-h-screen bg-[#020408] flex flex-col items-center justify-center relative overflow-hidden font-sans">

      {/* Dynamic Security Glow based on status */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none transition-colors duration-700 ${status === 'verifying' ? 'bg-blue-900/10' :
          status === 'success' ? 'bg-emerald-900/10' :
            'bg-rose-900/10'
        }`}></div>

      <div className="relative z-10 w-full max-w-md bg-[#050810] border border-white/5 p-8 rounded-3xl shadow-2xl animate-in zoom-in-95 text-center">

        {/* STATUS: VERIFYING */}
        {status === 'verifying' && (
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-blue-500/10 border border-blue-500/30 rounded-full flex items-center justify-center mb-6">
              <Loader2 size={36} className="text-blue-500 animate-spin" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-widest uppercase mb-2">Authenticating</h1>
            <p className="text-sm text-gray-400">{message}</p>
          </div>
        )}

        {/* STATUS: SUCCESS */}
        {status === 'success' && (
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
              <ShieldCheck size={36} className="text-emerald-500" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-widest uppercase mb-2">Node Verified</h1>
            <p className="text-sm text-emerald-400 mb-8">{message}</p>

            <Link to="/login" className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.4)]">
              <KeyRound size={18} /> Access System Portal
            </Link>
          </div>
        )}

        {/* STATUS: ERROR */}
        {status === 'error' && (
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-rose-500/10 border border-rose-500/30 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(225,29,72,0.2)]">
              <XOctagon size={36} className="text-rose-500" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-widest uppercase mb-2">Verification Failed</h1>
            <p className="text-sm text-rose-400 mb-8">{message}</p>

            <Link to="/login" className="w-full bg-black border border-white/10 hover:bg-white/5 text-white py-4 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2">
              Return to Login
            </Link>
          </div>
        )}

      </div>
    </div>
  );
};

export default VerifyEmailPage;
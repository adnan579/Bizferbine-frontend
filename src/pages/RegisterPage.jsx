// src/pages/RegisterPage.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Briefcase, ShieldCheck, Zap, Loader2, ArrowRight, CheckCircle2 } from 'lucide-react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    industry: '',
    role: 'Founder' // Default role
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear errors when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://bizferbine-backend.onrender.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        // Automatically redirect to login after 2 seconds
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(data.message || 'System error during initialization.');
      }
    } catch (err) {
      setError('Server connection failed. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050810] flex items-center justify-center p-6 relative overflow-hidden font-sans text-gray-200 selection:bg-blue-500/30">
      
      {/* Background Glowing Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-5xl flex flex-col md:flex-row bg-[#0a0f1c]/80 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(37,99,235,0.1)] overflow-hidden z-10">
        
        {/* LEFT SIDE: Branding / Marketing */}
        <div className="w-full md:w-5/12 bg-gradient-to-br from-blue-900/40 to-purple-900/40 border-r border-white/5 p-10 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle grid pattern over the brand side */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
          
          <div className="relative z-10">
            <Link to="/" className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-800 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:scale-105 transition-transform mb-8">
              <span className="text-white text-2xl font-black">B</span>
            </Link>
            <h2 className="text-3xl font-black text-white leading-tight tracking-tight mb-4">
              Initialize Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">System Node</span>
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed font-mono">
              Join the quantum enterprise network. Access secure deal rooms, algorithmic mentorship, and frictionless skill bartering.
            </p>
          </div>

          <div className="relative z-10 mt-12 space-y-4">
            <div className="flex items-center gap-3 text-xs text-gray-300 font-mono bg-black/30 p-3 rounded-xl border border-white/5">
              <ShieldCheck size={16} className="text-emerald-400" /> End-to-end Encrypted Deals
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-300 font-mono bg-black/30 p-3 rounded-xl border border-white/5">
              <Zap size={16} className="text-yellow-400" /> Algorithmic Matchmaking
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: The Form */}
        <div className="w-full md:w-7/12 p-10 lg:p-14 flex items-center">
          
          {success ? (
            // SUCCESS STATE
            <div className="w-full flex flex-col items-center text-center animate-in zoom-in-95 duration-500">
              <div className="w-20 h-20 bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center rounded-full mb-6 shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                <CheckCircle2 size={40} className="text-emerald-400" />
              </div>
              <h3 className="text-2xl font-black text-white tracking-tight mb-2">Node Initialized</h3>
              <p className="text-gray-400 text-sm font-mono uppercase tracking-widest mb-8">Routing to secure login portal...</p>
              <Loader2 size={24} className="text-blue-500 animate-spin" />
            </div>
          ) : (
            // REGISTRATION FORM
            <div className="w-full">
              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-2">Create Identity Vector</h3>
                <p className="text-xs text-gray-500 font-mono uppercase tracking-widest">Enter parameters to establish connection</p>
              </div>

              {error && (
                <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm flex items-center gap-3 animate-in fade-in">
                  <ShieldCheck size={16} className="shrink-0" /> {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest ml-1">Full Legal Name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-4 top-3.5 text-gray-500" />
                    <input required type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Jane Doe" className="w-full bg-[#050810] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:border-blue-500 focus:bg-white/5 outline-none transition" />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest ml-1">Communication Address (Email)</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-3.5 text-gray-500" />
                    <input required type="email" name="email" value={formData.email} onChange={handleChange} placeholder="jane@example.com" className="w-full bg-[#050810] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:border-blue-500 focus:bg-white/5 outline-none transition" />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest ml-1">Secure Passphrase</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-3.5 text-gray-500" />
                    <input required type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" minLength="6" className="w-full bg-[#050810] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:border-blue-500 focus:bg-white/5 outline-none transition" />
                  </div>
                </div>

                {/* Grid for Industry and Role */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest ml-1">Operating Sector</label>
                    <div className="relative">
                      <Briefcase size={16} className="absolute left-4 top-3.5 text-gray-500" />
                      <input required type="text" name="industry" value={formData.industry} onChange={handleChange} placeholder="e.g. FinTech" className="w-full bg-[#050810] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:border-purple-500 focus:bg-white/5 outline-none transition" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest ml-1">System Role</label>
                    <div className="relative">
                      <Zap size={16} className="absolute left-4 top-3.5 text-gray-500 z-10" />
                      <select required name="role" value={formData.role} onChange={handleChange} className="w-full bg-[#050810] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:border-purple-500 focus:bg-white/5 outline-none transition appearance-none cursor-pointer">
                        <option value="Founder">Founder / CEO</option>
                        <option value="Investor">Investor</option>
                        <option value="Mentor">Expert Mentor</option>
                        <option value="General">General Professional</option>
                      </select>
                    </div>
                  </div>
                </div>

                <button disabled={loading} type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.4)] transition mt-6 disabled:opacity-50">
                  {loading ? <Loader2 size={18} className="animate-spin" /> : (
                    <>Establish Connection <ArrowRight size={18} /></>
                  )}
                </button>
              </form>

              <div className="mt-8 text-center border-t border-white/5 pt-6">
                <p className="text-xs text-gray-400 font-mono">
                  Already initialized a node?{' '}
                  <Link to="/login" className="text-blue-400 hover:text-blue-300 underline underline-offset-4 ml-1">
                    Connect Here
                  </Link>
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
// src/pages/LandingPage.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Rewritten features: Clear, outcome-driven, and jargon-free
  const features = [
    { icon: "🧠", title: "AI Mentorship Matching", desc: "Find mentors and mentees based on skill compatibility and startup goals." },
    { icon: "💼", title: "Secure Deal Rooms", desc: "Pitch investors and manage financial proposals in a private, encrypted environment." },
    { icon: "🤝", title: "Real-Time Networking", desc: "Instantly connect with founders and follow professional profiles." },
    { icon: "⚡", title: "Micro-Blog Publishing", desc: "Share thought leadership and case studies with a targeted professional audience." },
    { icon: "🔍", title: "Global Discovery", desc: "Search across users, events, and skill barters simultaneously with our high-speed engine." },
    { icon: "🎟️", title: "Integrated Payments", desc: "Monetize events, sell tickets, and manage safe transactions effortlessly." },
    { icon: "🔄", title: "Skill Barter Marketplace", desc: "Trade professional skills with other founders without spending cash." },
    { icon: "🏢", title: "Digital Events", desc: "Host, manage, and promote online or offline networking events." },
    { icon: "💬", title: "Encrypted Messaging", desc: "Communicate securely with private, low-latency direct messaging." }
  ];

  const backendFlexTech = ['Node.js', 'Express.js', 'MongoDB Atlas', 'Regex Matchmaking', 'Parallel Queries', 'Barter Logic', 'CORS Security', 'JWT Auth', 'Bcrypt Encryption', 'AWS Architecture', 'Stripe Gateway', 'WebSockets'];

  return (
    <div className="min-h-screen bg-[#020408] text-gray-200 font-sans selection:bg-blue-500/30">
      
      {/* Navbar (Mobile Optimized) */}
      <nav className="fixed w-full z-50 top-0 transition-all backdrop-blur-md bg-[#020408]/80 border-b border-white/5 p-4 md:p-5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-xl md:text-2xl font-black tracking-tighter text-white flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.5)]">
              <span className="text-white font-bold text-sm">BF</span>
            </div>
            BizFerbine
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-8 items-center">
            <a href="#features" className="text-sm font-medium text-gray-400 hover:text-white transition">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-gray-400 hover:text-white transition">How it Works</a>
            <Link to="/login" className="text-sm font-semibold text-gray-300 hover:text-white transition">Sign In</Link>
            <Link to="/register" className="text-sm font-bold bg-white text-black px-6 py-2.5 rounded-full hover:bg-gray-200 transition shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:scale-105">
              Get Started
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <button 
            className="md:hidden text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* Mobile Nav Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-[#050810] border-b border-white/5 p-4 flex flex-col gap-4 shadow-xl">
            <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-300 font-medium p-2">Features</a>
            <a href="#how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-300 font-medium p-2">How it Works</a>
            <Link to="/login" className="text-gray-300 font-medium p-2">Sign In</Link>
            <Link to="/register" className="bg-blue-600 text-white text-center font-bold px-6 py-3 rounded-xl mt-2">Get Started</Link>
          </div>
        )}
      </nav>

      {/* Hero Section (Clear Message, Mobile Stacked CTAs) */}
      <main className="relative pt-32 pb-16 md:pt-48 md:pb-24 overflow-hidden px-4">
        {/* Optimized Glow Backgrounds */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-blue-600/20 rounded-full blur-[100px] md:blur-[150px] pointer-events-none"></div>

        <div className="relative max-w-4xl mx-auto text-center z-10">
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-400 text-xs md:text-sm font-bold tracking-widest uppercase">
            The Ultimate Networking Ecosystem
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] mb-6">
            Connecting founders, mentors, and investors with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">AI matchmaking.</span>
          </h1>
          
          <p className="text-base md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Secure deal rooms, smart skill barter systems, event networking, and professional discovery — all in one unified platform.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto">
            <Link to="/register" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl md:rounded-full text-base md:text-lg font-bold transition shadow-[0_0_20px_rgba(37,99,235,0.4)] flex items-center justify-center">
              Start Building Your Network
            </Link>
            <a href="#how-it-works" className="w-full sm:w-auto bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-4 rounded-xl md:rounded-full text-base md:text-lg font-bold transition backdrop-blur-sm flex items-center justify-center">
              See How It Works
            </a>
          </div>
        </div>
      </main>

      {/* NEW: Social Proof Section */}
      <section className="py-10 border-y border-white/5 bg-white/[0.02] relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/5">
            <div>
              <div className="text-3xl md:text-4xl font-black text-white mb-1">10k+</div>
              <div className="text-xs md:text-sm text-gray-500 uppercase tracking-wider">Connections Made</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-black text-white mb-1">500+</div>
              <div className="text-xs md:text-sm text-gray-500 uppercase tracking-wider">Active Founders</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-black text-white mb-1">$2M+</div>
              <div className="text-xs md:text-sm text-gray-500 uppercase tracking-wider">Deals Facilitated</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-black text-white mb-1">24/7</div>
              <div className="text-xs md:text-sm text-gray-500 uppercase tracking-wider">AI Matchmaking</div>
            </div>
          </div>
        </div>
      </section>

      {/* NEW: How it Works (Simplified Mental Model) */}
      <section id="how-it-works" className="py-20 md:py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">How BizFerbine Works</h2>
            <p className="text-gray-400 text-lg">Three steps to accelerate your professional growth.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Steps */}
            <div className="bg-[#050810] border border-white/5 p-8 rounded-2xl text-center relative z-10">
              <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-xl font-black mx-auto mb-6">1</div>
              <h3 className="text-xl font-bold text-white mb-3">Create Your Profile</h3>
              <p className="text-gray-400 text-sm">Detail your skills, startup goals, and what you are looking for in the ecosystem.</p>
            </div>
            <div className="bg-[#050810] border border-white/5 p-8 rounded-2xl text-center relative z-10">
              <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-xl font-black mx-auto mb-6">2</div>
              <h3 className="text-xl font-bold text-white mb-3">Algorithmic Matching</h3>
              <p className="text-gray-400 text-sm">Our system scans thousands of profiles to instantly introduce you to exact-match mentors and investors.</p>
            </div>
            <div className="bg-[#050810] border border-white/5 p-8 rounded-2xl text-center relative z-10">
              <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-xl font-black mx-auto mb-6">3</div>
              <h3 className="text-xl font-bold text-white mb-3">Collaborate Securely</h3>
              <p className="text-gray-400 text-sm">Open secure deal rooms, barter skills, or direct message your new connections.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid (Mobile single-column, clear benefits) */}
      <section id="features" className="py-20 md:py-32 bg-white/[0.02] border-y border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Everything you need to scale</h2>
            <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">Powerful tools designed specifically for the modern startup ecosystem.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-[#050810] border border-white/5 p-6 md:p-8 rounded-2xl hover:bg-white/5 transition-colors group">
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-2xl mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture Showcase (Technical Trust) */}
      <section className="py-20 md:py-32 relative z-10 bg-[#020408]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">Built on Enterprise Technology</h2>
          <p className="text-gray-500 mb-12">Scalable, secure, and blazingly fast.</p>
          <div className="flex flex-wrap justify-center gap-3 md:gap-4 font-mono text-xs md:text-sm">
            {backendFlexTech.map((tech, i) => (
              <span key={i} className="px-4 py-2 md:px-5 md:py-3 rounded-lg bg-black border border-white/5 text-gray-400 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA & Links */}
      <footer className="border-t border-white/5 bg-[#050810] pt-20 pb-10">
        <div className="max-w-4xl mx-auto text-center px-6 mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to expand your network?</h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">Join thousands of professionals already building their future on BizFerbine.</p>
          <Link to="/register" className="w-full sm:w-auto inline-block bg-white text-black hover:bg-gray-200 px-10 py-4 rounded-xl md:rounded-full text-base md:text-lg font-bold transition shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:scale-105">
            Create Free Account
          </Link>
        </div>
        
        {/* Proper Footer Links */}
        <div className="max-w-7xl mx-auto px-6 border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs md:text-sm text-gray-500">
          <div className="flex items-center gap-2 font-bold text-gray-400">
            <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center text-white text-[10px]">BF</div>
            BizFerbine © {new Date().getFullYear()}
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Terms of Service</a>
            <a href="#" className="hover:text-white transition">Contact Support</a>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
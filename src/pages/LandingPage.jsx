// src/pages/LandingPage.jsx
import { Link } from 'react-router-dom';

const LandingPage = () => {
  // Description of each future-tech illustration for the features
  const featureIllustrations = [
    "A glowing brain network with two human profiles and match-lines, labeled with skill matrices.",
    "A glowing geometric safe with document and handshake icons, secured by laser grids.",
    "A dynamic, pulsing network graph where lines of connection snap between nodes.",
    "A stylized micro-blog feed with animated particle streams representing thought leadership.",
    "A radar dish scanning a multi-layered world, displaying results on a futuristic data screen.",
    "A digital credit card breaking into flowing data streams, with a check-mark coin.",
    "Two glowing hands of light trading abstract skill symbols (circuit board and palette), with a dynamic skill barter flow.",
    "A translucent conference hall made of glowing light-vectors, with abstract attendee figures and a digital stage.",
    "Two speech bubbles made of flowing light, with dynamic, scrolling encrypted text."
  ];

  const features = [
    { title: "AI Mentorship matching", desc: "A customizedRegex matchmaking engine usesSkillMatrices to pair mentees with perfect mentors.", illustration: featureIllustrations[0] },
    { title: "Quantum Deal Rooms", desc: "pitch investors, manage secure financialproposals, and document flows in anencrypted environment.", illustration: featureIllustrations[1] },
    { title: "Connect-Ops Network", desc: "Real-time connection requests and profilefollowing, with a high-scalegraph-basedcore.", illustration: featureIllustrations[2] },
    { title: "Neural Thought Leadership", desc: "a stylized micro-blog vector to publish case studiesand 120-word micro-blogs.", illustration: featureIllustrations[3] },
    { title: "Global Radar (Search)", desc: "A multi-collection parallel query engine usingPromise.all to simultaneouslyscan Users, Posts, Events, and SkillBarters.", illustration: featureIllustrations[4] },
    { title: "Quantum Payment Vectors", desc: "integrated Stripe payment architecture for monetization, event ticketing, and safeTransactions.", illustration: featureIllustrations[5] },
    { title: "Skill barter marketplace", desc: "A two-way marketplace logic for trading professional skills using optimized matchmaking algorithms.", illustration: featureIllustrations[6] },
    { title: "Digital Event Vectors", desc: "an advanced platform life cycle for hosting, monetizing, and managing online/offline events.", illustration: featureIllustrations[7] },
    { title: "Message flux", desc: "Low-latency, encrypted private messaging vector with low-latency delivery.", illustration: featureIllustrations[8] }
  ];

  const backendFlexTech = ['Node.js', 'Express.js', 'MongoDB Atlas', 'Regex Algorithms', 'Multi-query Promise.all', 'Skill Barter Marketplace Logic', 'CORS Security Logic', 'JWT Authentication', 'Bcrypt Security', 'Multer Uploads', 'Integrated Stripe Payments Gateway', 'Global Notification System Core' ];

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-200 font-sans selection:bg-blue-500/30">
      
      {/* Sticky Glass Navbar */}
      <nav className="fixed w-full z-50 top-0 transition-all backdrop-blur-md bg-[#0B0F19]/80 border-b border-white/10 p-5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-black tracking-tighter text-white flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.5)]">
              <span img src="/android-chrome-192x192.png" alt="BizFerbine Logo" className="w-5 h-5" />
            </div>
            BizFerbine
          </div>
          <div className="space-x-6 flex items-center">
            <Link to="/login" className="text-sm font-semibold text-gray-400 hover:text-white transition">Sign In</Link>
            <Link to="/register" className="text-sm font-semibold bg-white text-black px-5 py-2.5 rounded-full hover:bg-gray-200 transition shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:scale-105">
              Join the Network
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Abstract Data Flow Background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          {Array(20).fill(0).map((_, i) => (
            <div key={i} className="absolute h-[1px] bg-blue-500" style={{ left: `${Math.random()*100}%`, top: `${Math.random()*100}%`, width: `${Math.random()*30+10}%`}}></div>
          ))}
        </div>
        {/* Background Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto px-6 text-center z-10">
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-bold tracking-widest uppercase">
            Built for quantum-scale networking
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-[1.1] mb-8">
            The Multi-collection ecosystem <br className="hidden md:block" />
            built with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Regex algorithms.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            BizFerbine is not just a social tool. It is an algorithmic core connecting founders, mentors, and investors. Secure Deal Rooms, complex matchmaking, and decentralized skill bartering.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-8 py-4 rounded-full text-lg font-bold transition shadow-[0_0_30px_rgba(79,70,229,0.4)] hover:shadow-[0_0_40px_rgba(79,70,229,0.6)] hover:-translate-y-1">
              create a new account
            </Link>
            <a href="#flex" className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-4 rounded-full text-lg font-bold transition backdrop-blur-sm">
              Explore algorithmic flex
            </a>
          </div>
        </div>
      </main>

      {/* Feature "Flex Grid" (Total rewritten and upgraded) */}
      <section id="flex" className="py-24 bg-black/50 border-y border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Enterprise Algorithmic Vectors</h2>
            <p className="text-gray-400 text-lg">A subset of our customized multi-query, parallel event system.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 group">
                <div className="mb-6 h-24 w-full bg-white/5 rounded-xl flex items-center justify-center p-3">
                  <div className="text-4xl">
                      {/* Stylized placeholder icon for each illustration. */}
                      {feature.illustration.includes('brain network') && '🧠'}
                      {feature.illustration.includes('Safe') && '💼'}
                      {feature.illustration.includes('Network Graph') && '🤝'}
                      {feature.illustration.includes('blog feed') && '⚡'}
                      {feature.illustration.includes('radar') && '🔍'}
                      {feature.illustration.includes('credit card') && '🎟️'}
                      {feature.illustration.includes('hands of light') && '🔄'}
                      {feature.illustration.includes('conference hall') && '🏢'}
                      {feature.illustration.includes('speech bubbles') && ' Flux'}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 tracking-tighter capitalize">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed capitalize">{feature.desc}</p>
                <div className="text-blue-400 text-xs mt-3 uppercase font-mono tracking-widest">{feature.title.includes('Algorithmic') ? 'Regex-Match Alg' : feature.title.includes('Global Radar') ? ' Promise.all Multiquery' : feature.title.includes('Skill barter') ? ' Marketplace-Match Alg' : ' Core logic vector'}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture Showcase */}
      <section className="py-32 relative z-10 bg-[#0B0F19]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-16">High-Impact Architecture Flex</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 font-mono text-sm">
            {backendFlexTech.map((tech, i) => (
              <span key={i} className="px-5 py-4 rounded-xl bg-black border border-white/5 text-gray-300 shadow-inner hover:border-blue-500 hover:text-white transition group">
                <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-3 shadow-[0_0_10px_rgba(79,70,229,0.8)]"></div>
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="border-t border-white/10 bg-black/50 pt-20 pb-10">
        <div className="max-w-4xl mx-auto text-center px-6 mb-20">
          <h2 className="text-4xl font-bold text-white mb-8 capitalize">Ready to deploy your networking core?</h2>
          <Link to="/register" className="bg-white text-black hover:bg-gray-200 px-10 py-4 rounded-full text-lg font-bold transition shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-105">
            get started with a new account
          </Link>
        </div>
        <div className="text-center text-gray-600 text-sm">
          © {new Date().getFullYear()} BizFerbine. Built from scratch with customized algorithmic logic.
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
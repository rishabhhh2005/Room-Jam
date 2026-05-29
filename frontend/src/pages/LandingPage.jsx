import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * LandingPage Component
 * 
 * The public-facing marketing page for RoomJam.
 */
const LandingPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleGetStarted = () => {
    if (token) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 selection:bg-indigo-500/30 font-sans overflow-y-auto">
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[25%] -left-[10%] w-[70%] h-[70%] bg-indigo-500/10 rounded-full blur-[120px] opacity-50" />
        <div className="absolute top-[10%] -right-[5%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[120px] opacity-30" />
      </div>

      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="font-bold text-white text-lg">R</span>
            </div>
            <span className="text-xl font-semibold tracking-tight text-white">RoomJam</span>
          </div>
          
          <div className="flex items-center gap-6">
            {token ? (
              <button 
                onClick={() => navigate('/dashboard')}
                className="px-5 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-bold shadow-lg shadow-indigo-500/20 transition-all"
              >
                Go to Dashboard
              </button>
            ) : (
              <>
                <button onClick={() => navigate('/login')} className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Sign In</button>
                <button 
                  onClick={handleGetStarted}
                  className="px-5 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-bold shadow-lg shadow-indigo-500/20 transition-all"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="relative z-10 container mx-auto px-6 pt-40 pb-24">
        <div className="max-w-4xl mx-auto text-center mb-32">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Now in Public Beta
          </div>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-white mb-8">
            Collaborative rooms <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">for developers.</span>
          </h1>
          <p className="text-xl md:text-2xl text-zinc-400 leading-relaxed max-w-2xl mx-auto mb-12">
            The all-in-one workspace for technical interviews, team brainstorming, and pair programming. 
            Built for speed and deep focus.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={handleGetStarted}
              className="px-8 py-4 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-lg shadow-xl shadow-indigo-500/25 transition-all flex items-center gap-2"
            >
              Start Building <ArrowRightIcon className="w-5 h-5" />
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="px-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-lg border border-white/10 transition-all"
            >
              Live Demo
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-40">
           <div className="group relative p-8 rounded-3xl bg-zinc-900/50 border border-white/5 hover:border-indigo-500/30 transition-all overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <CodeIcon className="w-24 h-24 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Problem-Centric</h3>
              <p className="text-zinc-400 leading-relaxed">
                Rooms are built around specific problems. Whether it's a LeetCode challenge or a system design interview, RoomJam provides the context you need.
              </p>
           </div>
           <div className="group relative p-8 rounded-3xl bg-zinc-900/50 border border-white/5 hover:border-purple-500/30 transition-all overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <MessageSquareIcon className="w-24 h-24 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Real-time Sync</h3>
              <p className="text-zinc-400 leading-relaxed">
                Low-latency synchronization powered by Yjs. Every keystroke, mouse movement, and sketch is visible to everyone instantly.
              </p>
           </div>
        </div>

        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Everything you need</h2>
          <p className="text-zinc-500 text-lg">A complete toolset for modern engineering collaboration.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          <FeatureCard 
            title="Realtime Editor" 
            desc="Powerful collaborative code editor with syntax highlighting and shared cursor awareness."
            icon={<CodeIcon className="w-6 h-6 text-indigo-400" />}
          />
          <FeatureCard 
            title="Shared Whiteboard" 
            desc="Sketch architecture and complex flows with Excalidraw integration built directly into the room."
            icon={<PenIcon className="w-6 h-6 text-purple-400" />}
          />
          <FeatureCard 
            title="Room Notes" 
            desc="Markdown-ready notes for documenting decisions, technical requirements, and constraints."
            icon={<FileTextIcon className="w-6 h-6 text-pink-400" />}
          />
          <FeatureCard 
            title="Team Chat" 
            desc="Contextual messaging to keep the team aligned without leaving the workspace."
            icon={<MessageSquareIcon className="w-6 h-6 text-emerald-400" />}
          />
        </div>
      </main>

      <footer className="border-t border-white/5 py-12 bg-black/40">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-6 opacity-50">
             <div className="w-6 h-6 bg-white/10 rounded flex items-center justify-center">
               <span className="font-bold text-white text-xs">R</span>
             </div>
             <span className="text-sm font-semibold text-white">RoomJam</span>
          </div>
          <p className="text-zinc-500 text-sm">© 2026 RoomJam. Built for the modern collaborative developer.</p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ title, desc, icon }) => (
  <div className="p-8 rounded-2xl bg-zinc-900/30 border border-white/5 hover:border-white/10 transition-all hover:-translate-y-1">
    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
      {icon}
    </div>
    <h4 className="text-lg font-bold text-white mb-3">{title}</h4>
    <p className="text-sm text-zinc-500 leading-relaxed">{desc}</p>
  </div>
);

/* --- Icons --- */

const ArrowRightIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

const CodeIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
);

const PenIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
  </svg>
);

const FileTextIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const MessageSquareIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
  </svg>
);

export default LandingPage;

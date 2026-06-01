import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Infinite Type & Delete Loop Hook
const useLoopingTypewriter = (words, typingSpeed = 80, deletingSpeed = 40, delay = 2000) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState(words[0]);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer;
    const fullWord = words[currentWordIndex];

    if (isDeleting) {
      timer = setTimeout(() => {
        setCurrentText(fullWord.substring(0, currentText.length - 1));
      }, deletingSpeed);
    } else {
      timer = setTimeout(() => {
        setCurrentText(fullWord.substring(0, currentText.length + 1));
      }, typingSpeed);
    }

    if (!isDeleting && currentText === fullWord) {
      timer = setTimeout(() => setIsDeleting(true), delay);
    } 
    else if (isDeleting && currentText === '') {
      setIsDeleting(false);
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIndex, words, typingSpeed, deletingSpeed, delay]);

  return currentText;
};

const LandingPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const onGetStarted = () => navigate(token ? '/dashboard' : '/register');

  const phrases = [
    'problems are solved.',
    'systems are designed.',
    'teams collaborate.',
  ];

  const animatedText = useLoopingTypewriter(phrases, 80, 40, 2000);

  return (
    <div className="min-h-screen bg-[#080808] text-zinc-100 font-mono overflow-y-auto antialiased">

      {/* Subtle grid texture */}
      <div className="fixed inset-0 pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.015) 1px, transparent 1px)', backgroundSize: '72px 72px' }} />

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[#080808]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-base font-bold tracking-widest text-white uppercase">RoomJam</span>
          <div className="flex items-center gap-6">
            {token ? (
              <button onClick={() => navigate('/dashboard')} className="text-sm tracking-widest uppercase text-white border border-white/20 px-4 py-2 hover:bg-white hover:text-black transition-colors">
                Dashboard
              </button>
            ) : (
              <>
                <button onClick={() => navigate('/login')} className="text-sm tracking-widest uppercase text-zinc-400 hover:text-white transition-colors">
                  Sign In
                </button>
                <button onClick={onGetStarted} className="text-sm tracking-widest uppercase text-white border border-white/20 px-4 py-2 hover:bg-white hover:text-black transition-colors">
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-6xl mx-auto px-6">

        {/* Hero */}
        <section className="pt-52 pb-44 border-b border-white/[0.06]">
          <div className="max-w-4xl">
            <p className="text-xs sm:text-sm tracking-[0.3em] uppercase text-zinc-500 mb-10">
              Prototype 1 — By Rishabh
            </p>
            {/* Height limits slightly adjusted to ensure no layout layout breaking with bigger fonts */}
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold leading-[1.1] tracking-tight text-white mb-8 min-h-[3.3em] sm:min-h-[2.4em]">
              rooms where<br />
              <span className="text-zinc-500 whitespace-nowrap inline-block relative pr-4">
                {animatedText}
                {/* Repositioned cursor slightly to scale well with bigger fonts */}
                <span className="absolute inline-block w-[4px] h-[0.85em] bg-zinc-500 ml-2 top-[12%] animate-pulse" />
              </span>
            </h1>
            <p className="text-base sm:text-lg text-zinc-400 leading-relaxed max-w-xl mb-12">
              Bring your team into one room to design systems, plan projects, write code, and collaborate in real time.
            </p>
            <div className="flex items-center gap-4">
              <button onClick={onGetStarted} className="text-sm tracking-widest uppercase bg-white text-black px-6 py-3.5 font-bold hover:bg-zinc-200 transition-colors">
                Start Building →
              </button>
              <button onClick={() => navigate('/dashboard')} className="text-sm tracking-widest uppercase text-zinc-400 hover:text-white transition-colors px-6 py-3.5 border border-white/10 hover:border-white/30">
                Live Demo
              </button>
            </div>
          </div>
        </section>

        {/* Why section */}
        <section className="py-28 border-b border-white/[0.06]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <div>
              <p className="text-xs sm:text-sm tracking-[0.3em] uppercase text-zinc-500 mb-6">Why RoomJam</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white leading-snug">
                Built around the problem, not the tool.
              </h2>
            </div>
            <div className="space-y-10 pt-2">
              {[
                ['Problem-centric', 'Rooms are scoped to a problem —  System design, or a team sprint. Context stays in the room.'],
                ['Low-latency sync', 'Every keystroke and sketch syncs instantly via Yjs. No lag, no conflicts.'],
              ].map(([title, body]) => (
                <div key={title} className="border-t border-white/[0.06] pt-8">
                  <h4 className="text-base font-bold text-white mb-3">{title}</h4>
                  <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      <footer className="border-t border-white/[0.06] py-10">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <span className="text-sm tracking-widest uppercase text-zinc-500">RoomJam</span>
          <span className="text-sm text-zinc-600">© 2026</span>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import api from '../api/axios';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [userRes, roomsRes] = await Promise.all([
        api.get('/auth/me'),
        api.get('/rooms')
      ]);
      setUser(userRes.data);
      setRooms(roomsRes.data || []); // Added fallback array protection here
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    toast.success('Logged out');
  };

  const handleDeleteRoom = async (e, roomKey) => {
    e.stopPropagation();
    toast.warning('Delete this workspace?', {
      description: 'This cannot be undone.',
      duration: Infinity,
      action: {
        label: 'Delete',
        onClick: async () => {
          try {
            await api.delete(`/rooms/${roomKey}`);
            setRooms(prev => prev.filter(r => r.room_key !== roomKey));
            toast.success('Workspace deleted');
          } catch (error) {
            toast.error(error.response?.data?.detail || 'Failed to delete room.');
          }
        },
      },
      cancel: { label: 'Cancel', onClick: () => toast.dismiss() }
    });
  };

  const sampleProblems = [
    {
      title: 'LRU Cache Implementation',
      problem_statement: 'Design a data structure following LRU cache constraints with O(1) get and put.',
      tags: ['Data Structures', 'Hash Map']
    },
    {
      title: 'Snake Game Logic',
      problem_statement: 'Implement core logic for a Snake game — grid, collision, growth.',
      tags: ['Games', 'Algorithms']
    },
    {
      title: 'Rate Limiter Service',
      problem_statement: 'Design a scalable rate limiter using Token Bucket or Leaky Bucket.',
      tags: ['System Design', 'Backend']
    }
  ];

  const handleProblemClick = (problem) => navigate('/create-room', { state: { template: problem } });

  return (
    <div className="min-h-screen bg-[#050506] text-zinc-200 antialiased font-sans selection:bg-zinc-800 selection:text-white flex flex-col">
      <Navbar user={user} onLogout={handleLogout} />

      {/* Main Container */}
      <main className="max-w-6xl w-full mx-auto px-6 pt-16 md:pt-36 pb-24 flex-1 flex flex-col justify-center md:justify-start">

        {/* Hero Section */}
        <section className="md:mb-14 py-12 md:py-0">
          {loading ? (
            <div className="space-y-4 flex flex-col items-center md:items-start">
              <div className="h-3 w-32 bg-zinc-900/80 rounded animate-pulse" />
              <div className="h-12 w-64 md:w-96 bg-zinc-900/80 rounded animate-pulse" />
            </div>
          ) : (
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10 md:border-b md:border-zinc-900 md:pb-10 items-center text-center md:text-left">
              <div className="space-y-4 md:space-y-3 flex flex-col items-center md:items-start">
                <p className="text-[11px] font-mono tracking-[0.45em] text-zinc-500 uppercase font-bold">Dashboard</p>
                <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight md:leading-none">
                  Welcome back,<br className="md:hidden"/> <span className="text-zinc-300 font-medium font-mono block mt-2 md:inline md:mt-0">{user?.username}</span>
                </h1>
                
                {/* Stats row */}
                <div className="flex flex-col sm:flex-row items-center gap-x-5 gap-y-2 pt-1 text-sm text-zinc-400 font-mono tracking-wide">
                  <span className="text-zinc-500">{user?.email}</span>
                  <span className="hidden sm:inline text-zinc-800 text-lg select-none">•</span>
                  
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.6)]" />
                    <span className="text-emerald-400 font-medium">Authenticated</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-4 shrink-0 w-full max-w-sm md:max-w-none md:w-auto">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigate('/create-room')}
                    className="flex-1 md:flex-none h-11 px-6 bg-white text-black text-xs font-bold font-mono uppercase tracking-widest hover:bg-zinc-200 shadow-xl transition-all rounded active:scale-[0.98]"
                  >
                    + New Room
                  </button>
                  <button
                    onClick={() => navigate('/join-room')}
                    className="flex-1 md:flex-none h-11 px-6 bg-transparent text-zinc-200 text-xs font-bold font-mono uppercase tracking-widest border border-zinc-800 hover:border-zinc-500 hover:text-white hover:bg-zinc-900/20 transition-all rounded active:scale-[0.98]"
                  >
                    Join Room
                  </button>
                </div>
                
                {/* Mobile-only Quick Access Buttons */}
                <div className="flex md:hidden items-center gap-3">
                  <button
                    onClick={() => navigate('/workspaces')}
                    className="flex-1 h-11 px-4 bg-zinc-900/50 text-zinc-300 text-[10px] font-bold font-mono uppercase tracking-widest border border-zinc-800 hover:border-zinc-500 transition-all rounded flex items-center justify-center gap-2"
                  >
                    <FolderIcon className="w-4 h-4" /> Workspaces
                  </button>
                  <button
                    onClick={() => navigate('/problem-library')}
                    className="flex-1 h-11 px-4 bg-zinc-900/50 text-zinc-300 text-[10px] font-bold font-mono uppercase tracking-widest border border-zinc-800 hover:border-zinc-500 transition-all rounded flex items-center justify-center gap-2"
                  >
                    <BookIcon className="w-4 h-4" /> Library
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* 3-Column Proportional Layout */}
        <div className="hidden md:grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* Recent Workspaces Glass Panel */}
          <section className="lg:col-span-2 bg-gradient-to-b from-zinc-900/20 to-zinc-950/5 border border-zinc-900/80 backdrop-blur-xl p-6 rounded-2xl shadow-2xl space-y-5">
            <div className="flex items-baseline justify-between">
              {/* FIXED LINE 158: Added safety checking fallback to prevent counting errors */}
              <SectionHeader label=" Recent Workspaces" count={rooms?.length || 0} />
              {(rooms?.length || 0) > 4 && (
                <button
                  onClick={() => navigate('/workspaces')}
                  className="text-xs text-zinc-500 hover:text-white font-mono tracking-wider transition-colors"
                >
                  View All →
                </button>
              )}
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2].map(i => (
                  <div key={i} className="h-28 bg-zinc-900/40 animate-pulse rounded-xl" />
                ))}
              </div>
            ) : rooms && rooms.length > 0 ? (
              <ul className="space-y-3.5">
                {rooms.slice(0, 2).map((room) => (
                  <RoomCard
                    key={room.room_key}
                    room={room}
                    onClick={() => navigate(`/room/${room.room_key}`)}
                    onDelete={(e) => handleDeleteRoom(e, room.room_key)}
                  />
                ))}
              </ul>
            ) : (
              <EmptyState
                label="No active rooms found in this registry"
                action={() => navigate('/create-room')}
                actionLabel="Provision First Workspace"
              />
            )}
          </section>

          {/* Problem Library Glass Panel */}
          <section className="bg-gradient-to-b from-zinc-900/30 to-zinc-950/10 border border-zinc-800/50 backdrop-blur-xl p-6 rounded-2xl shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <SectionHeader label=" Problem Library" />
              <button
                onClick={() => navigate('/problem-library')}
                className="text-[11px] text-zinc-500 hover:text-zinc-300 font-mono tracking-widest uppercase font-bold transition-colors"
              >
                More Problems →
              </button>
            </div>

            <ul className="space-y-4">
              {sampleProblems.map((p) => (
                <ProblemCard key={p.title} problem={p} onClick={() => handleProblemClick(p)} />
              ))}
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
};

/* ─── Premium Sub-components ──────────────────────────────────────────── */

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  return (
    <nav className="fixed top-0 inset-x-0 z-50 border-b border-zinc-900/80 bg-[#050506]/75 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <button
          onClick={() => navigate('/dashboard')}
          className="text-xs font-black font-mono tracking-[0.4em] uppercase text-white hover:text-zinc-400 transition-colors"
        >
          ROOMJAM
        </button>

        <div className="flex items-center gap-2 sm:gap-6">
          <button
            onClick={() => navigate('/workspaces')}
            className="flex items-center justify-center w-10 h-10 md:w-auto md:h-auto md:px-3 md:py-1.5 text-zinc-500 hover:text-white transition-all group"
            title="Workspaces"
          >
            <FolderIcon className="w-5 h-5 md:hidden" />
            <span className="hidden md:block text-[11px] font-mono uppercase tracking-[0.25em]">Workspaces</span>
          </button>
          
          <button
            onClick={() => navigate('/problem-library')}
            className="flex items-center justify-center w-10 h-10 md:w-auto md:h-auto md:px-3 md:py-1.5 text-zinc-500 hover:text-white transition-all group"
            title="Problem Library"
          >
            <BookIcon className="w-5 h-5 md:hidden" />
            <span className="hidden md:block text-[11px] font-mono uppercase tracking-[0.25em]">Library</span>
          </button>
          
          <button
            onClick={onLogout}
            className="flex items-center justify-center w-10 h-10 md:w-auto md:h-auto text-zinc-500 hover:text-red-400 transition-colors"
            title="Logout"
          >
            <LogoutIcon className="w-5 h-5 md:hidden" />
            <span className="hidden md:block text-[11px] font-mono uppercase tracking-widest font-bold">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

const SectionHeader = ({ label, count }) => (
  <div className="flex items-center gap-3">
    <h2 className="text-xs font-bold font-mono uppercase tracking-widest text-zinc-400">{label}</h2>
    {count != null && (
      <span className="text-[10px] font-mono font-bold text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">{count}</span>
    )}
  </div>
);

const RoomCard = ({ room, onClick, onDelete }) => (
  <li
    onClick={onClick}
    className="group flex items-start gap-4 p-5 border border-zinc-900/80 bg-zinc-950/40 hover:bg-zinc-950/90 hover:border-zinc-700 transition-all rounded-xl cursor-pointer relative active:scale-[0.995]"
  >
    <div className="mt-2 shrink-0 flex items-center justify-center relative">
      <span className={`w-2.5 h-2.5 rounded-full ${room.is_public ? 'bg-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.6)]' : 'bg-purple-400 shadow-[0_0_12px_rgba(192,132,252,0.6)]'}`} />
    </div>

    <div className="flex-1 min-w-0 space-y-1.5">
      <div className="flex items-center gap-3 flex-wrap">
        <span className="font-semibold text-base text-white group-hover:text-zinc-100 transition-colors tracking-tight">{room.title}</span>
        <span className="text-[10px] font-mono text-zinc-500 shrink-0 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800/60">{room.room_key}</span>
      </div>
      <p className="text-sm text-zinc-400 max-w-xl font-normal leading-relaxed">{room.problem_statement || 'Environment ready for initialization.'}</p>
      
      {room.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1.5">
          {room.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-[9px] font-mono font-bold text-zinc-400 bg-zinc-900 border border-zinc-800/80 px-2 py-0.5 rounded uppercase tracking-wide">{tag}</span>
          ))}
        </div>
      )}
    </div>

    <button
      onClick={onDelete}
      className="shrink-0 opacity-0 group-hover:opacity-100 p-2 text-zinc-600 hover:text-red-400 rounded transition-all mt-1"
      title="Destroy Room"
    >
      <TrashIcon className="w-4 h-4" />
    </button>
  </li>
);

const ProblemCard = ({ problem, onClick }) => (
  <li className="list-none">
    <button
      onClick={onClick}
      className="group w-full text-left p-5 bg-zinc-950/60 border border-zinc-900/60 hover:border-zinc-700 hover:bg-zinc-950 transition-all rounded-xl space-y-3 shadow-md"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors truncate tracking-wide">{problem.title}</p>
        <span className="text-zinc-600 group-hover:text-zinc-300 text-sm transition-transform group-hover:translate-x-0.5 shrink-0">→</span>
      </div>
      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed font-normal">{problem.problem_statement}</p>
      
      {problem.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {problem.tags.map(tag => (
            <span key={tag} className="text-[9px] font-mono font-bold text-zinc-500 bg-zinc-900/50 border border-zinc-800/50 px-2 py-0.5 rounded uppercase">{tag}</span>
          ))}
        </div>
      )}
    </button>
  </li>
);

const EmptyState = ({ label, action, actionLabel }) => (
  <div className="py-14 border border-dashed border-zinc-800 text-center rounded-xl bg-zinc-950/20 flex flex-col items-center justify-center">
    <p className="text-sm text-zinc-500 font-mono uppercase tracking-widest mb-5">{label}</p>
    <button
      onClick={action}
      className="h-10 px-5 bg-transparent text-zinc-300 text-xs font-bold font-mono border border-zinc-800 hover:border-zinc-400 hover:bg-white hover:text-black rounded transition-all active:scale-[0.98]"
    >
      {actionLabel}
    </button>
  </div>
);

const TrashIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const FolderIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
  </svg>
);

const BookIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const LogoutIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

export default DashboardPage;
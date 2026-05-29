import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

/**
 * DashboardPage Component
 * * Main user dashboard showing user profile, recent rooms and problem library preview.
 */
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
      setRooms(roomsRes.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleDeleteRoom = async (e, roomKey) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this room? This action cannot be undone.')) return;
    
    try {
      await api.delete(`/rooms/${roomKey}`);
      setRooms(prev => prev.filter(r => r.room_key !== roomKey));
    } catch (error) {
      console.error("Error deleting room:", error);
      alert(error.response?.data?.detail || 'Failed to delete room.');
    }
  };

  const sampleProblems = [
    {
      title: 'LRU Cache Implementation',
      problem_statement: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.',
      context: 'Implement the LRUCache class with get and put methods in O(1) time complexity.',
      tags: ['Data Structures', 'Hash Map'],
      icon: '🧠'
    },
    {
      title: 'Snake Game Logic',
      problem_statement: 'Implement the core logic for a classic Snake game.',
      context: 'Focus on grid management, collision detection, and growth mechanics.',
      tags: ['Games', 'Algorithms'],
      icon: '🐍'
    },
    {
      title: 'Rate Limiter Service',
      problem_statement: 'Design a scalable rate limiter for an API gateway.',
      context: 'Consider Token Bucket or Leaky Bucket algorithms.',
      tags: ['System Design', 'Backend'],
      icon: '🚦'
    }
  ];

  const handleProblemClick = (problem) => {
    navigate('/create-room', { state: { template: problem } });
  };

  return (
    <div className="min-h-screen bg-[#080808] text-zinc-100 font-mono overflow-hidden relative selection:bg-white selection:text-black">
      {/* Grid Background */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.015) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
      />

      <Navbar user={user} onLogout={handleLogout} />

      <main className="relative z-10 container mx-auto max-w-7xl px-6 pt-24 pb-24">
        {/* User Profile Section */}
        <div className="mb-14 border border-white/[0.06] bg-black/20 p-8 relative">
          <div className="absolute top-0 right-0 p-8 opacity-5 hidden md:block">
            <UserIcon className="w-32 h-32 text-white" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 border border-white/[0.1] bg-zinc-900 text-white flex items-center justify-center text-xl font-bold">
                {user?.username?.[0].toUpperCase() || 'U'}
              </div>
              <div>
                <p className="text-xs tracking-[0.3em] uppercase text-zinc-600 mb-1">Authenticated Account</p>
                <h1 className="text-3xl font-bold tracking-tight text-white">
                  Welcome, {user?.username || 'Developer'}
                </h1>
                <div className="flex items-center gap-4 mt-3">
                  <span className="text-xs text-zinc-500">{user?.email}</span>
                  <div className="text-[10px] uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-500"></span>
                    {rooms.length} Active Workspaces
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <button 
                onClick={() => navigate('/create-room')}
                className="px-5 py-3 bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-black hover:text-white border border-white transition-all flex items-center gap-2"
              >
                <PlusIcon className="w-4 h-4" /> Create Room
              </button>
              <button 
                onClick={() => navigate('/join-room')}
                className="px-5 py-3 bg-transparent text-white font-bold text-xs uppercase tracking-wider hover:bg-white hover:text-black border border-white/[0.08] hover:border-white transition-all flex items-center gap-2"
              >
                <EnterIcon className="w-4 h-4" /> Connect To Room
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Grid split layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_380px] gap-12 items-start">
          
          {/* Recent Rooms Column */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.25em] text-zinc-600">Overview</p>
                <h2 className="text-lg font-bold uppercase tracking-wider text-white mt-0.5">Recent Workspaces</h2>
              </div>
              <button className="text-xs uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">View All →</button>
            </div>
            
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-28 border border-white/[0.06] bg-black/20 animate-pulse" />
                ))}
              </div>
            ) : rooms.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {rooms.map((room) => (
                  <div 
                    key={room.room_key} 
                    onClick={() => navigate(`/room/${room.room_key}`)}
                    className="group p-5 border border-white/[0.06] bg-black/10 hover:bg-white/[0.02] hover:border-white/20 transition-all flex items-center gap-5 text-left w-full cursor-pointer relative"
                  >
                    <div className="w-12 h-12 border border-white/[0.08] bg-zinc-950 flex items-center justify-center text-lg group-hover:bg-white group-hover:text-black transition-colors shrink-0">
                      {room.is_public ? '🌐' : '🔒'}
                    </div>
                    <div className="flex-1 min-w-0 pr-12">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                        <h4 className="font-bold text-white transition-colors truncate text-base">{room.title}</h4>
                        <span className="text-[10px] text-zinc-500 bg-white/[0.04] px-2 py-0.5 border border-white/[0.06] tracking-widest uppercase shrink-0 w-fit">{room.room_key}</span>
                      </div>
                      <p className="text-xs text-zinc-500 line-clamp-1 mt-1 font-sans">{room.problem_statement}</p>
                      <div className="flex items-center gap-2 mt-3">
                        {room.tags && room.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="text-[9px] text-zinc-400 border border-white/[0.08] px-2 py-0.5 uppercase tracking-wider bg-zinc-900/50">{tag}</span>
                        ))}
                        {room.tags?.length > 3 && <span className="text-[10px] text-zinc-600">+{room.tags.length - 3}</span>}
                      </div>
                    </div>
                    
                    <button 
                      onClick={(e) => handleDeleteRoom(e, room.room_key)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 p-2.5 border border-transparent text-zinc-700 hover:text-red-400 hover:border-red-500/20 hover:bg-red-500/5 transition-all z-20"
                      title="Destroy Workspace"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 border border-dashed border-white/[0.08] bg-black/10">
                <p className="text-xs tracking-[0.2em] uppercase text-zinc-600 mb-2">No active matrixes</p>
                <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-6">No active environments found</h3>
                <button 
                  onClick={() => navigate('/create-room')}
                  className="px-4 py-2 bg-white text-black text-xs uppercase tracking-wider font-bold hover:bg-black hover:text-white border border-white transition-all"
                >
                  Initialize Room
                </button>
              </div>
            )}
          </div>

          {/* VERICAL DIVIDER */}
          <div className="hidden lg:block h-full w-px bg-white/[0.06] self-stretch" />

          {/* Problem Library Preview Column */}
          <div className="space-y-6 w-full">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.25em] text-zinc-600">Modules</p>
                <h2 className="text-lg font-bold uppercase tracking-wider text-white mt-0.5">Problem Library</h2>
              </div>
              <button 
                onClick={() => navigate('/problem-library')}
                className="text-xs uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
              >
                Explore All →
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {sampleProblems.map((p) => (
                <button 
                  key={p.title} 
                  onClick={() => handleProblemClick(p)}
                  className="p-5 border border-white/[0.06] bg-black/10 hover:bg-white/[0.02] hover:border-white/20 transition-all flex flex-col gap-4 text-left group w-full"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="w-9 h-9 border border-white/[0.08] bg-zinc-950 flex items-center justify-center text-xl transition-transform group-hover:border-white/30">
                      {p.icon}
                    </div>
                    <ArrowRightIcon className="w-4 h-4 text-zinc-700 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm uppercase tracking-wide group-hover:text-zinc-300 transition-colors">{p.title}</h4>
                    <p className="text-xs text-zinc-500 mt-2 line-clamp-2 leading-relaxed font-sans">{p.problem_statement}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

/* --- Sub-Components --- */

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[#080808]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <span className="text-sm font-bold tracking-widest uppercase text-white hover:text-zinc-300 transition-colors">
            RoomJam
          </span>
        </div>
        
        <div className="flex items-center gap-6">
          {user && (
            <div className="hidden md:flex items-center gap-2 text-xs uppercase tracking-widest text-zinc-400">
              <span className="text-zinc-600">[user]</span>
              <span className="font-bold text-white">{user.username}</span>
            </div>
          )}
          <button 
            onClick={onLogout}
            className="text-xs uppercase tracking-widest text-zinc-500 hover:text-red-400 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

/* --- Icons --- */

const PlusIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
  </svg>
);

const EnterIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
  </svg>
);

const UserIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const ArrowRightIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

const TrashIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

export default DashboardPage;
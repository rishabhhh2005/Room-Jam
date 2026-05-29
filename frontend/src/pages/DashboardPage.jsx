import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

/**
 * DashboardPage Component
 * 
 * Main user dashboard showing user profile, recent rooms and problem library preview.
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
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 selection:bg-indigo-500/30 font-sans">
      <Navbar user={user} onLogout={handleLogout} />

      <main className="container mx-auto px-6 pt-24 pb-24">
        {/* User Stats/Profile Section */}
        <div className="mb-12 p-8 rounded-3xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <UserIcon className="w-32 h-32 text-white" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl font-bold shadow-xl shadow-indigo-500/20">
                {user?.username?.[0].toUpperCase() || 'U'}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Welcome, {user?.username || 'Developer'}</h1>
                <p className="text-zinc-400 mt-1">{user?.email}</p>
                <div className="flex items-center gap-4 mt-4">
                  <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-zinc-300 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    {rooms.length} Active Rooms
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate('/create-room')}
                className="px-6 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold transition-all flex items-center gap-2"
              >
                <PlusIcon className="w-5 h-5" /> New Room
              </button>
              <button 
                onClick={() => navigate('/join-room')}
                className="px-6 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold border border-white/5 transition-all flex items-center gap-2"
              >
                <EnterIcon className="w-5 h-5" /> Join Room
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Recent Rooms Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Recent Workspaces</h2>
              <button className="text-indigo-400 text-sm font-medium hover:underline">View All</button>
            </div>
            
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 rounded-2xl border border-white/5 bg-white/5 animate-pulse" />
                ))}
              </div>
            ) : rooms.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {rooms.map((room) => (
                  <div 
                    key={room.room_key} 
                    onClick={() => navigate(`/room/${room.room_key}`)}
                    className="group p-5 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-indigo-500/30 transition-all flex items-center gap-5 text-left w-full cursor-pointer relative"
                  >
                    <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center text-xl group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-colors shrink-0">
                      {room.is_public ? '🌐' : '🔒'}
                    </div>
                    <div className="flex-1 min-w-0 pr-12">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-bold text-white group-hover:text-indigo-400 transition-colors truncate text-lg">{room.title}</h4>
                        <span className="text-xs font-mono text-zinc-500 bg-white/5 px-2 py-1 rounded uppercase tracking-widest shrink-0">{room.room_key}</span>
                      </div>
                      <p className="text-sm text-zinc-500 line-clamp-1 mt-1">{room.problem_statement}</p>
                      <div className="flex items-center gap-2 mt-3">
                        {room.tags && room.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="text-[10px] text-zinc-400 bg-white/5 px-2 py-1 rounded uppercase tracking-wider">{tag}</span>
                        ))}
                        {room.tags?.length > 3 && <span className="text-[10px] text-zinc-500">+{room.tags.length - 3}</span>}
                      </div>
                    </div>
                    
                    <button 
                      onClick={(e) => handleDeleteRoom(e, room.room_key)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 p-3 rounded-xl bg-red-500/0 text-red-500/0 group-hover:bg-red-500/10 group-hover:text-red-500 hover:!bg-red-500 hover:!text-white transition-all z-20"
                      title="Delete Room"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 border-2 border-dashed border-white/5 rounded-3xl">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <PlusIcon className="w-8 h-8 text-zinc-500" />
                </div>
                <h3 className="text-white font-bold text-lg">No active rooms</h3>
                <p className="text-zinc-500 text-sm mt-1 mb-6">Create your first room to start collaborating.</p>
                <button 
                  onClick={() => navigate('/create-room')}
                  className="px-6 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-bold transition-all"
                >
                  Create Room
                </button>
              </div>
            )}
          </div>

          {/* Problem Library Preview Column */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Problem Library</h2>
              <button 
                onClick={() => navigate('/problem-library')}
                className="text-indigo-400 text-sm font-medium hover:underline"
              >
                Explore All
              </button>
            </div>
            <p className="text-zinc-500 text-sm">Don't have an idea? Choose from our curated library.</p>
            
            <div className="grid grid-cols-1 gap-4">
              {sampleProblems.map((p) => (
                <button 
                  key={p.title} 
                  onClick={() => handleProblemClick(p)}
                  className="p-5 rounded-2xl border border-white/5 bg-zinc-900/50 hover:bg-white/5 hover:border-white/10 transition-all flex flex-col gap-4 text-left group"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                      {p.icon}
                    </div>
                    <ArrowRightIcon className="w-5 h-5 text-zinc-700 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm group-hover:text-indigo-400 transition-colors">{p.title}</h4>
                    <p className="text-xs text-zinc-500 mt-2 line-clamp-2 leading-relaxed">{p.problem_statement}</p>
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
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="font-bold text-white text-lg">R</span>
          </div>
          <span className="text-xl font-semibold tracking-tight text-white">RoomJam</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 mr-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white">
              {user?.username?.[0].toUpperCase() || 'U'}
            </div>
            <span className="text-sm font-medium text-zinc-300">{user?.username}</span>
          </div>
          <button 
            onClick={onLogout}
            className="text-sm font-bold text-red-500 hover:text-red-400 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 transition-all flex items-center gap-2"
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
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const EnterIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
  </svg>
);

const UserIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const ArrowRightIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

const TrashIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

export default DashboardPage;

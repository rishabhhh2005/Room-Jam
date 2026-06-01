import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import api from '../api/axios';
import Navbar from '../components/layout/Navbar';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [userRes, roomsRes] = await Promise.all([
        api.get('/auth/me'),
        api.get('/rooms')
      ]);
      setUser(userRes.data);
      setRooms(roomsRes.data || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => { fetchData(); }, [fetchData]);

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
      title: 'Slow API Response During Traffic Spikes',
      problem_statement: 'Company’s customer dashboard becomes extremely slow whenever traffic increases during peak hours.',
      tags: [' Backend', 'Performance']
    },
    {
  title: 'Production Database Scaling',
  problem_statement: 'A rapidly growing SaaS product is approaching the limits of its primary database.',
  tags: ['Databases', 'Scaling', 'Architecture']
    },
    {
  title: 'Design an Internal Notification Platform',
  problem_statement: 'Multiple teams need a unified system for sending emails, SMS, and push notifications.',
  tags: ['Backend', 'System Design', 'Messaging']
    }
  ];

  const handleProblemClick = (problem) => navigate('/create-room', { state: { template: problem } });

  return (
    <div className="min-h-screen bg-black text-zinc-200 antialiased flex flex-col">
      {/* Note: If the centered navigation isn't applying, make sure to update your 
        Navbar component to align its children or handle layout centering internally.
      */}
      <Navbar user={user} onLogout={handleLogout} />

      <main className="max-w-7xl w-full mx-auto px-6 pt-24 pb-20 flex-1">

        {/* Header section with defined hierarchy */}
        <header className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-zinc-800 pb-8">
          <div className="space-y-2">
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">System Dashboard</p>
            {loading ? (
              <div className="h-12 w-80 bg-zinc-900/50 animate-pulse rounded-lg border border-zinc-800" />
            ) : (
              <h1 className="text-4xl font-bold text-white tracking-tight">
                Welcome, <span className="text-zinc-500">{user?.username}</span>
              </h1>
            )}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/create-room')}
              className="px-6 h-12 bg-zinc-100 text-black hover:bg-zinc-200 font-medium rounded-xl transition-colors"
            >
              New Workspace
            </button>
            <button
              onClick={() => navigate('/join-room')}
              className="px-6 h-12 bg-zinc-900 border border-zinc-800 text-zinc-200 hover:bg-zinc-800 hover:text-white font-medium rounded-xl transition-all"
            >
              Join Room
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* Main Content Area - Workspaces */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                Recent Workspaces {rooms.length > 0 && <span className="ml-2 text-zinc-600">({rooms.length})</span>}
              </h2>
              {rooms.length > 3 && (
                <button 
                  onClick={() => navigate('/workspaces')}
                  className="text-xs font-bold text-zinc-500 hover:text-white transition-colors uppercase tracking-widest"
                >
                  View All →
                </button>
              )}
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-28 bg-zinc-900/30 animate-pulse rounded-2xl border border-zinc-800" />
                ))}
              </div>
            ) : rooms.length > 0 ? (
              <div className="space-y-4">
                {rooms.slice(0, 3).map((room) => (
                  <RoomCard
                    key={room.room_key}
                    room={room}
                    onClick={() => navigate(`/room/${room.room_key}`)}
                    onDelete={(e) => handleDeleteRoom(e, room.room_key)}
                  />
                ))}
              </div>
            ) : (
              <EmptyState 
                label="No active workspaces" 
                actionLabel="Create your first room"
                action={() => navigate('/create-room')}
              />
            )}
          </div>

          {/* Sidebar Area - Problems */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Problem Library</h2>
              <button 
                onClick={() => navigate('/problem-library')}
                className="text-xs font-bold text-zinc-500 hover:text-white transition-colors uppercase tracking-widest"
              >
                Explore →
              </button>
            </div>

            <div className="space-y-4">
              {sampleProblems.map((p) => (
                <ProblemCard key={p.title} problem={p} onClick={() => handleProblemClick(p)} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

/* ─── Premium UI Components with Added Gray/Black Borders ─────────────────── */

const RoomCard = ({ room, onClick, onDelete }) => (
  <div
    onClick={onClick}
    className="group bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-700/80 p-6 rounded-2xl cursor-pointer flex items-center justify-between gap-6 transition-all"
  >
    <div className="flex items-center gap-6 min-w-0">
      <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${room.is_public ? 'bg-sky-500' : 'bg-purple-500'} opacity-80`} />
      <div className="min-w-0 space-y-1.5">
        <div className="flex items-center gap-4">
          <h3 className="text-zinc-200 font-semibold group-hover:text-white transition-colors truncate">{room.title}</h3>
          <span className="text-[11px] font-mono font-bold text-zinc-600 uppercase tracking-widest">{room.room_key}</span>
        </div>
        <p className="text-sm text-zinc-400 truncate">{room.problem_statement || 'Standard workspace environment.'}</p>
      </div>
    </div>

    <div className="flex items-center gap-4 shrink-0 md:opacity-0 group-hover:opacity-100 transition-opacity">
      <button
        onClick={onDelete}
        className="p-2 text-zinc-600 hover:text-red-400 transition-colors"
      >
        <TrashIcon className="w-5 h-5" />
      </button>
      <span className="text-zinc-600 group-hover:text-zinc-400 transition-colors">→</span>
    </div>
  </div>
);

const ProblemCard = ({ problem, onClick }) => (
  <button
    onClick={onClick}
    className="w-full text-left bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-700/80 p-6 rounded-2xl group transition-all"
  >
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-sm font-bold text-zinc-300 group-hover:text-white transition-colors">{problem.title}</h3>
      <span className="text-zinc-600 group-hover:text-zinc-400 transition-colors">→</span>
    </div>
    <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">{problem.problem_statement}</p>
    <div className="flex flex-wrap gap-2 mt-4">
      {problem.tags?.map(tag => (
        <span key={tag} className="text-[10px] font-bold text-zinc-400 bg-zinc-800 border border-zinc-700/50 px-2 py-1 rounded-md uppercase tracking-wider">{tag}</span>
      ))}
    </div>
  </button>
);

const EmptyState = ({ label, actionLabel, action }) => (
  <div className="py-20 border border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center bg-zinc-900/10">
    <p className="text-xs font-bold text-zinc-600 uppercase tracking-[0.25em] mb-8">{label}</p>
    <button
      onClick={action}
      className="px-6 py-3 bg-zinc-900 border border-zinc-800 text-xs font-bold uppercase tracking-widest text-zinc-300 hover:bg-white hover:text-black transition-all rounded-xl"
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

export default DashboardPage;
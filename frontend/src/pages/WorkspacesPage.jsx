import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import api from '../api/axios';

const WorkspacesPage = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

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
      console.error('Error fetching workspaces:', error);
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

  const filteredRooms = rooms.filter(room => 
    room.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.problem_statement?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.room_key.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#080808] text-zinc-300 antialiased font-sans relative selection:bg-white selection:text-black">
      {/* Grid Background */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.01) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.01) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <nav className="fixed top-0 inset-x-0 z-50 border-b border-zinc-900 bg-[#080808]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-xs font-bold font-mono tracking-[0.25em] uppercase text-white hover:text-zinc-400 transition-colors"
          >
            RoomJam
          </button>

          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-xs font-mono text-zinc-500 hover:text-white transition-colors"
            >
              Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="text-xs font-mono text-zinc-500 hover:text-red-400 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-28 pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight uppercase">All Workspaces</h1>
            <p className="text-sm text-zinc-500 mt-1 font-mono uppercase tracking-widest">
              Manage your deployed Workspaces ({rooms.length})
            </p>
          </div>
          
          <div className="relative w-full md:w-80">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
            <input 
              type="text"
              placeholder="SEARCH WORKSPACES..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-md py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-white transition-all font-mono uppercase tracking-wider"
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-40 bg-zinc-900/50 animate-pulse rounded-lg border border-zinc-800" />
            ))}
          </div>
        ) : filteredRooms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRooms.map((room) => (
              <WorkspaceCard
                key={room.room_key}
                room={room}
                onClick={() => navigate(`/room/${room.room_key}`)}
                onDelete={(e) => handleDeleteRoom(e, room.room_key)}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border border-dashed border-zinc-800 rounded-lg bg-zinc-900/5">
            <p className="text-sm text-zinc-500 font-mono uppercase tracking-widest">
              {searchQuery ? `No workspaces matching "${searchQuery}"` : "No workspaces found"}
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

const WorkspaceCard = ({ room, onClick, onDelete }) => (
  <div
    onClick={onClick}
    className="group flex flex-col p-5 border border-zinc-900 bg-zinc-900/10 hover:bg-zinc-900/30 hover:border-zinc-700 transition-all rounded-lg cursor-pointer relative min-h-[160px]"
  >
    <div className="flex items-start justify-between gap-4 mb-3">
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-white group-hover:text-emerald-400 transition-colors truncate uppercase tracking-tight">
          {room.title}
        </h3>
        <p className="text-[10px] font-mono text-zinc-600 tracking-wider mt-0.5 uppercase">
          {room.room_key}
        </p>
      </div>
      <div className={`w-2 h-2 rounded-full mt-1.5 ${room.is_public ? 'bg-sky-500/40 shadow-[0_0_8px_rgba(14,165,233,0.3)]' : 'bg-purple-500/40 shadow-[0_0_8px_rgba(168,85,247,0.3)]'}`} />
    </div>

    <p className="text-xs text-zinc-500 line-clamp-3 leading-relaxed mb-4 flex-1 font-normal">
      {room.problem_statement || 'No environment loaded.'}
    </p>

    <div className="flex items-center justify-between mt-auto pt-3 border-t border-zinc-900/50">
      <div className="flex flex-wrap gap-1.5 min-w-0">
        {room.tags?.slice(0, 2).map(tag => (
          <span key={tag} className="text-[9px] font-mono text-zinc-500 border border-zinc-800 px-1.5 py-0.5 rounded uppercase">
            {tag}
          </span>
        ))}
        {room.tags?.length > 2 && (
          <span className="text-[9px] font-mono text-zinc-600 px-1 py-0.5">+{room.tags.length - 2}</span>
        )}
      </div>
      
      <button
        onClick={onDelete}
        className="p-1.5 text-zinc-700 hover:text-red-500 transition-colors"
        title="Delete Workspace"
      >
        <TrashIcon className="w-4 h-4" />
      </button>
    </div>
  </div>
);

const SearchIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const TrashIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

export default WorkspacesPage;

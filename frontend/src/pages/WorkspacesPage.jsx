import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import api from '../api/axios';
import Navbar from '../components/layout/Navbar';

const WorkspacesPage = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

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
      console.error('Error fetching workspaces:', error);
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

  const filteredRooms = rooms.filter(room => 
    room.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.problem_statement?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.room_key.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-black text-zinc-200 antialiased flex flex-col">
      <Navbar user={user} onLogout={handleLogout} />

      <main className="max-w-7xl w-full mx-auto px-6 pt-24 pb-20 flex-1">
        {/* Header Section with bottom border line split */}
        <header className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-zinc-800 pb-8">
          <div className="space-y-2">
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Registry</p>
            <h1 className="text-4xl font-bold text-white tracking-tight">Workspaces</h1>
            <p className="text-sm text-zinc-500">Manage and deploy your collaborative environments.</p>
          </div>
          
          {/* Filter Input Frame */}
          <div className="relative w-full md:w-96">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
            <input 
              type="text"
              placeholder="Filter by name, key or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900/40 border border-zinc-800 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-zinc-600 transition-all placeholder:text-zinc-600"
            />
          </div>
        </header>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-56 bg-zinc-900/30 animate-pulse rounded-2xl border border-zinc-800" />
            ))}
          </div>
        ) : filteredRooms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          /* Empty Border State */
          <div className="py-32 border border-dashed border-zinc-800 rounded-3xl flex flex-col items-center justify-center bg-zinc-900/10">
            <p className="text-xs font-bold text-zinc-600 uppercase tracking-[0.25em]">
              {searchQuery ? `No results for "${searchQuery}"` : "Start By Creating Your First Workspace"}
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
    className="group bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-700/80 p-8 rounded-2xl cursor-pointer flex flex-col h-full transition-all"
  >
    <div className="flex items-start justify-between mb-6">
      <div className="min-w-0 space-y-1.5">
        <h3 className="text-lg font-bold text-zinc-300 group-hover:text-white transition-colors truncate">
          {room.title}
        </h3>
        <p className="text-[11px] font-mono font-bold text-zinc-600 tracking-[0.15em] uppercase">
          {room.room_key}
        </p>
      </div>
      <div className={`w-2.5 h-2.5 rounded-full shrink-0 mt-2 ${room.is_public ? 'bg-sky-500' : 'bg-purple-500'} opacity-80`} />
    </div>

    <p className="text-sm text-zinc-400 leading-relaxed line-clamp-3 mb-8 flex-1">
      {room.problem_statement || 'Standard collaborative workspace.'}
    </p>

    <div className="flex items-center justify-between pt-6 border-t border-zinc-800/80">
      <div className="flex flex-wrap gap-2 overflow-hidden">
        {room.tags?.slice(0, 2).map(tag => (
          <span key={tag} className="text-[10px] font-bold text-zinc-400 bg-zinc-800 border border-zinc-700/50 px-2 py-1 rounded-md uppercase tracking-wider">
            {tag}
          </span>
        ))}
        {room.tags?.length > 2 && (
          <span className="text-xs text-zinc-500 font-bold ml-1">+{room.tags.length - 2}</span>
        )}
      </div>
      
      <button
        onClick={onDelete}
        className="p-2 text-zinc-600 hover:text-red-400 transition-colors"
        title="Delete Workspace"
      >
        <TrashIcon className="w-5 h-5" />
      </button>
    </div>
  </div>
);

const SearchIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const TrashIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

export default WorkspacesPage;
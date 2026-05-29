import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const JoinRoomPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [roomKey, setRoomKey] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!roomKey.trim()) return;

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/rooms/join', { room_key: roomKey.trim() });
      navigate(`/room/${response.data.room_key}`);
    } catch (err) {
      console.error("Error joining room:", err);
      setError(err.response?.data?.detail || 'Room not found or failed to join.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 selection:bg-indigo-500/30 font-sans">
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] -right-[5%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[120px] opacity-30" />
      </div>

      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="font-bold text-white text-lg">R</span>
            </div>
            <span className="text-xl font-semibold tracking-tight text-white">RoomJam</span>
          </div>
          
          <div className="flex items-center gap-6">
            <button onClick={() => navigate('/dashboard')} className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Dashboard</button>
            <div className="w-px h-4 bg-white/10 mx-1" />
            <button onClick={() => navigate('/dashboard')} className="w-9 h-9 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center hover:bg-zinc-800 transition-all">
              <UserIcon className="w-5 h-5 text-zinc-400" />
            </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 container mx-auto px-6 pt-32 pb-24 max-w-md">
        <div className="mb-10 text-center">
          <button 
            onClick={() => navigate('/dashboard')}
            className="text-zinc-500 hover:text-white inline-flex items-center gap-2 mb-6 transition-colors mx-auto"
          >
            <ArrowLeftIcon className="w-4 h-4" /> Back to Dashboard
          </button>
          <h1 className="text-4xl font-bold text-white mb-2">Join Room</h1>
          <p className="text-zinc-400">Enter a room key to start collaborating.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Room Key</label>
            <input 
              type="text"
              required
              value={roomKey}
              onChange={(e) => setRoomKey(e.target.value.toUpperCase())}
              placeholder="e.g., RJ-XXXX-XXXX"
              className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-4 text-center text-2xl font-mono tracking-widest text-white focus:outline-none focus:border-indigo-500/50 transition-colors uppercase"
              maxLength={12}
            />
          </div>

          <button 
            type="submit"
            disabled={loading || !roomKey.trim()}
            className="w-full py-4 rounded-xl bg-zinc-100 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed text-zinc-900 font-bold shadow-lg transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-zinc-900/30 border-t-zinc-900 rounded-full animate-spin" />
            ) : (
              <>Join Workspace <EnterIcon className="w-4 h-4" /></>
            )}
          </button>
        </form>

        <div className="mt-12 p-6 rounded-2xl bg-white/5 border border-white/5 text-center">
          <p className="text-sm text-zinc-500">
            Don't have a key? Ask your teammates or <button onClick={() => navigate('/create-room')} className="text-indigo-400 hover:underline">create your own room</button>.
          </p>
        </div>
      </main>
    </div>
  );
};

const ArrowLeftIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
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

export default JoinRoomPage;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
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
      toast.success('Joined workspace successfully!');
      navigate(`/room/${response.data.room_key}`);
    } catch (err) {
      console.error("Error joining room:", err);
      const errorMessage = err.response?.data?.detail || 'Room not found or failed to join.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] text-zinc-100 font-mono overflow-y-auto relative selection:bg-white selection:text-black">
      {/* Grid Background */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.015) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[#080808]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-sm font-bold tracking-widest uppercase text-white hover:text-zinc-300 transition-colors"
          >
            RoomJam
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-xs uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
          >
            Dashboard
          </button>
        </div>
      </nav>

      <main className="relative z-10 min-h-screen flex items-center justify-center px-6 pt-24 pb-12">
        <div className="w-full max-w-md">
          
          <div className="mb-8 text-center">
            <button 
              onClick={() => navigate('/dashboard')}
              className="text-xs uppercase tracking-widest text-zinc-600 hover:text-white inline-flex items-center gap-2 mb-6 transition-colors"
            >
              <ArrowLeftIcon className="w-3.5 h-3.5" /> Back to DashBoard
            </button>
            <p className="text-xs tracking-[0.3em] uppercase text-zinc-600 mb-2">Gate Access — Establish Link</p>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white uppercase">Join Room</h1>
          </div>

          <div className="border border-white/[0.06] bg-black/20 p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="border border-red-500/20 bg-red-500/5 p-4 text-xs text-red-400 text-center uppercase tracking-wider">
                  {error}
                </div>
              )}

              <div>
                <label className="block mb-3 text-[11px] uppercase tracking-[0.25em] text-zinc-600">
                  Target Room Key
                </label>
                <input 
                  type="text"
                  required
                  value={roomKey}
                  onChange={(e) => setRoomKey(e.target.value.toUpperCase())}
                  placeholder="RJ-XXXX-XXXX"
                  className="w-full bg-transparent border border-white/[0.08] px-4 py-4 text-center text-lg md:text-xl font-bold tracking-[0.2em] text-white placeholder:text-zinc-800 focus:outline-none focus:border-white/30 transition-colors uppercase"
                  maxLength={12}
                />
              </div>

              <div className="border-t border-white/[0.06]" />

              <button 
                type="submit"
                disabled={loading || !roomKey.trim()}
                className="w-full bg-white text-black py-3.5 text-xs uppercase tracking-[0.2em] font-bold hover:bg-black hover:text-white border border-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  'Connecting...'
                ) : (
                  <>Connect to Matrix →</>
                )}
              </button>
            </form>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-zinc-600 tracking-wide">
              Missing access token? Ask peers or{" "}
              <button 
                onClick={() => navigate('/create-room')} 
                className="text-zinc-400 hover:text-white transition-colors underline underline-offset-4"
              >
                initialize environment
              </button>
            </p>
          </div>

        </div>
      </main>
    </div>
  );
};

/* --- Icons --- */

const ArrowLeftIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

export default JoinRoomPage;
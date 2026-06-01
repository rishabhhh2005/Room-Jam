import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import api from '../api/axios';
import Navbar from '../components/layout/Navbar';

const JoinRoomPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [roomKey, setRoomKey] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/auth/me');
        setUser(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, []);

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

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-black text-zinc-200 antialiased flex flex-col">
      <Navbar user={user} onLogout={handleLogout} />

      <main className="max-w-7xl w-full mx-auto px-6 flex-1 flex items-center justify-center">
        <div className="w-full max-w-md">
          <header className="mb-10 text-center">
            <button 
              onClick={() => navigate('/dashboard')}
              className="text-[10px] uppercase tracking-widest text-zinc-500 hover:text-white inline-flex items-center gap-2 mb-6 transition-colors"
            >
              ← Back to DashBoard
            </button>
            <div className="space-y-1">
              <p className="text-[10px] font-bold tracking-[0.2em] text-zinc-500 uppercase">Access Protocol</p>
              <h1 className="text-3xl font-semibold text-white tracking-tight">Join Workspace</h1>
            </div>
          </header>

          <div className="premium-card rounded-2xl p-8 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <div className="p-4 border border-red-500/20 bg-red-500/5 text-xs text-red-400 rounded-lg text-center">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 text-center">
                  Room Key
                </label>
                <input 
                  type="text"
                  required
                  value={roomKey}
                  onChange={(e) => setRoomKey(e.target.value.toUpperCase())}
                  placeholder="RJ-XXXX-XXXX"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-5 text-center text-xl font-bold tracking-[0.2em] text-white focus:outline-none focus:border-white/20 transition-all placeholder:text-zinc-800"
                  maxLength={12}
                />
              </div>

              <button 
                type="submit"
                disabled={loading || !roomKey.trim()}
                className="w-full h-12 premium-button-primary rounded-xl text-xs uppercase tracking-[0.2em] font-bold disabled:opacity-50"
              >
                {loading ? 'Connecting...' : 'Connect to Workspace →'}
              </button>
            </form>
          </div>

          <div className="mt-8 text-center">
            <p className="text-[11px] text-zinc-600">
              Need a new environment?{" "}
              <button 
                onClick={() => navigate('/create-room')} 
                className="text-zinc-400 hover:text-white transition-colors font-medium underline underline-offset-4"
              >
                Initialize one here
              </button>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default JoinRoomPage;
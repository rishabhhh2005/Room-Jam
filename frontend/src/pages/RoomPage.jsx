import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CollaborativeCodeEditor from "../features/editor/CollaborativeCodeEditor";
import api from "../api/axios";

function RoomPage() {
  const { roomKey } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [room, setRoom] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchInitialData = async () => {
      const delay = new Promise((resolve) => setTimeout(resolve, 1200));

      try {
        const [responses] = await Promise.all([
          Promise.all([api.get('/auth/me'), api.get(`/rooms/${roomKey}`)]),
          delay
        ]);

        if (!isMounted) return;

        setUser(responses[0].data);
        setRoom(responses[1].data);
        setLoading(false);
      } catch (error) {
        console.error("Error entering room:", error);
        if (isMounted) navigate('/dashboard');
      }
    };

    fetchInitialData();

    return () => {
      isMounted = false;
    };
  }, [roomKey, navigate]);

  if (loading) {
    return (
      <div className="min-h-dvh w-full max-w-full bg-[#050505] text-zinc-400 font-mono relative flex flex-col justify-between p-4 sm:p-8 md:p-16 select-none">
        <div
          className="fixed inset-0 pointer-events-none z-0 opacity-40"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.01) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.01) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <header className="relative z-10 flex justify-between items-start border-b border-zinc-900 pb-6 min-w-0">
          <div>
            <h1 className="text-white text-xs tracking-[0.4em] uppercase font-bold flex items-center gap-2">
              <span className="w-2 h-2 bg-white rounded-full animate-ping" />
              ROOMJAM
            </h1>
          </div>
        </header>

        <main className="relative z-10 flex-1 grid md:grid-cols-2 gap-8 md:gap-12 items-center my-8 md:my-12 min-w-0">
          <div className="space-y-6 min-w-0">
            <div className="space-y-2">
              <h2 className="text-4xl sm:text-6xl font-black tracking-tighter text-white uppercase select-none">
                Joining<br />
                Workspace
                <span className="text-zinc-600 animate-pulse">...</span>
              </h2>
            </div>
            
            <div className="max-w-xs pt-2">
              <div className="h-[2px] bg-zinc-900 w-full overflow-hidden relative">
                <div className="absolute top-0 bottom-0 bg-white w-1/4 animate-[stream_2s_infinite_linear]" />
              </div>
            </div>
          </div>

          <div className="flex flex-col md:items-end justify-center md:text-right border-t md:border-t-0 md:border-l border-zinc-900 pt-8 md:pt-0 md:pl-12 h-full min-w-0">
            <span className="text-[10px] tracking-[0.4em] text-zinc-600 uppercase block mb-2">TARGET_WORKSPACE</span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-widest text-white uppercase break-all bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-400 to-zinc-700">
              {roomKey}
            </h2>
            <p className="text-[10px] tracking-[0.2em] text-zinc-500 mt-4 uppercase">Preparing collaborative canvas...</p>
          </div>
        </main>

        <style>{`
          @keyframes stream {
            0% { left: -25%; }
            100% { left: 100%; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="h-dvh w-full max-w-full bg-[#0a0a0a] text-white flex flex-col min-w-0">
      <main className="flex-1 w-full min-w-0 relative bg-black">
        {/* Pass downstream safely to the feature canvas */}
        <CollaborativeCodeEditor roomKey={roomKey} currentUser={user} roomData={room} />
      </main>
    </div>
  );
}

export default RoomPage;  

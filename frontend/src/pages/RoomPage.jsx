import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CollaborativeCodeEditor from "../features/editor/CollaborativeCodeEditor";
import api from "../api/axios";

function RoomPage() {
  const { roomKey } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(true);
  const [user, setUser] = useState(null);
  const [room, setRoom] = useState(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [userRes, roomRes] = await Promise.all([
          api.get('/auth/me'),
          api.get(`/rooms/${roomKey}`)
        ]);
        setUser(userRes.data);
        setRoom(roomRes.data);
      } catch (error) {
        console.error("Error entering room:", error);
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();

    // Joining animation timer
    const timer = setTimeout(() => {
      setJoining(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, [roomKey, navigate]);

  if (loading || joining) {
    return (
      <div className="h-screen bg-[#080808] flex flex-col items-center justify-center text-white font-mono relative overflow-hidden selection:bg-white selection:text-black">
        {/* Grid Background */}
        <div
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.015) 1px, transparent 1px)',
            backgroundSize: '72px 72px',
          }}
        />

        <div className="relative z-10 w-full max-w-sm border border-white/[0.06] bg-black/40 p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 border border-white/20 flex items-center justify-center bg-zinc-900 animate-pulse">
              <span className="text-xl font-bold tracking-tighter">R</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-[10px] tracking-[0.3em] uppercase text-zinc-600">Initialization Sequence</p>
            <h2 className="text-lg font-bold tracking-widest uppercase text-white">Joining Workspace</h2>
            
            {/* Terminal Style Static Loader Bar */}
            <div className="w-32 mx-auto pt-2">
              <div className="h-1 bg-white/[0.08] w-full overflow-hidden relative">
                <div className="absolute top-0 bottom-0 bg-white w-1/3 animate-[loading_1.5s_infinite_ease-in-out]" 
                     style={{
                       animationName: 'loading',
                       animationDuration: '1.5s',
                       animationIterationCount: 'infinite',
                       animationTimingFunction: 'ease-in-out'
                     }} 
                />
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-white/[0.04]">
            <p className="text-zinc-500 text-xs tracking-[0.25em] uppercase">Target Address</p>
            <p className="text-white text-sm font-bold tracking-widest mt-1 uppercase">{roomKey}</p>
          </div>
        </div>

        <div className="fixed bottom-12 text-zinc-600 text-[10px] tracking-[0.3em] uppercase z-10">
          Syncing Environment Core Matrix...
        </div>

        {/* Global style definition inline injection for minimalist custom ticker width translate */}
        <style>{`
          @keyframes loading {
            0% { left: -35%; right: 100%; }
            50% { left: 100%; right: -35%; }
            100% { left: -35%; right: 100%; }
          }
        `}</style>
      </div>
    );
  }

  return <CollaborativeCodeEditor roomKey={roomKey} currentUser={user} roomData={room} />;
}

export default RoomPage;
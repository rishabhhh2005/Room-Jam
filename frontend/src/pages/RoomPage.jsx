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
      <div className="h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-white">
        <div className="relative">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 animate-pulse flex items-center justify-center shadow-2xl shadow-indigo-500/20">
            <span className="text-4xl font-bold">R</span>
          </div>
          <div className="absolute -inset-4 border-2 border-indigo-500/20 rounded-3xl animate-ping" />
        </div>
        
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold tracking-tight mb-2">Joining Workspace</h2>
          <div className="flex items-center justify-center gap-1.5">
             <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.3s]" />
             <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.15s]" />
             <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" />
          </div>
          <p className="text-zinc-500 text-sm mt-6 font-mono uppercase tracking-[0.2em]">{roomKey}</p>
        </div>

        <div className="fixed bottom-12 text-zinc-600 text-xs font-medium tracking-widest uppercase">
          Establishing Secure Connection...
        </div>
      </div>
    );
  }

  return <CollaborativeCodeEditor roomKey={roomKey} currentUser={user} roomData={room} />;
}

export default RoomPage;

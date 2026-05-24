import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { createRoomConnection } from "../features/editor/useYRoom";

function RoomPage() {
  const { roomId } = useParams();

  useEffect(() => {
    const conn = createRoomConnection(roomId);

    const handleStatusChange = ({ status }) => {
      console.log(`Room ${roomId} websocket status: ${status}`);
    };

    conn.awareness.setLocalStateField("user", {
      name: "Rishabh",
    });
    conn.provider.on("status", handleStatusChange);

    return () => {
      conn.provider.off("status", handleStatusChange);
      conn.release();
    };
  }, [roomId]);

  return <div>Connected to collaborative room: {roomId}</div>;
}

export default RoomPage;

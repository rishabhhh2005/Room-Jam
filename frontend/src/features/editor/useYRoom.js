import { useState, useEffect, useMemo } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

export function createRoomConnection(roomKey, userId) {
  const ydoc = new Y.Doc();

  const provider = new WebsocketProvider(
    import.meta.env.VITE_COLLAB_WS_URL || "ws://localhost:1234",
    userId ? `${roomKey}?userId=${userId}` : roomKey,
    ydoc
  );

  return {
    ydoc,
    provider,
    awareness: provider.awareness,
  };
}

export function useYRoom(roomKey, currentUser) {
  const [connection, setConnection] = useState({
    ydoc: null,
    provider: null,
    awareness: null,
  });

  useEffect(() => {
    if (!roomKey) return;

    const { ydoc, provider, awareness } = createRoomConnection(roomKey, currentUser?.id);
    setConnection({ ydoc, provider, awareness });

    return () => {
      provider.disconnect();
      ydoc.destroy();
    };
  }, [roomKey, currentUser?.id]);

  return connection;
}
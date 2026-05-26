import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

export function createRoomConnection(roomKey) {
  const ydoc = new Y.Doc();

  const provider = new WebsocketProvider(
    import.meta.env.VITE_COLLAB_WS_URL || "ws://localhost:1234",
    roomKey,
    ydoc
  );

  return {
    ydoc,
    provider,
    awareness: provider.awareness,
  };
}
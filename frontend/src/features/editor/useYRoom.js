import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

const DEFAULT_WS_URL = "ws://localhost:1234";
const connections = new Map();

function getWebsocketUrl() {
  return import.meta.env.VITE_COLLAB_WS_URL || DEFAULT_WS_URL;
}

export function createRoomConnection(roomKey) {
  const existingConnection = connections.get(roomKey);

  if (existingConnection) {
    clearTimeout(existingConnection.destroyTimer);
    existingConnection.refs += 1;
    existingConnection.provider.connect();
    return existingConnection;
  }

  const ydoc = new Y.Doc();
  const provider = new WebsocketProvider(
    getWebsocketUrl(),
    roomKey,
    ydoc
  );

  const connection = {
    ydoc,
    provider,
    awareness: provider.awareness,
    destroyTimer: null,
    refs: 1,
    release() {
      connection.refs -= 1;

      if (connection.refs > 0) {
        return;
      }

      connection.destroyTimer = setTimeout(() => {
        if (connection.refs > 0) {
          return;
        }

        provider.disconnect();
        ydoc.destroy();
        connections.delete(roomKey);
      }, 250);
    },
  };

  connections.set(roomKey, connection);
  return connection;
}

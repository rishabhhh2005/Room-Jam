import { useEffect, useRef, useState } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

export function useRoomChat(roomKey, userId) {
  const [messages, setMessages] = useState([]);

  const yMessagesRef = useRef(null);

  useEffect(() => {
    const ydoc = new Y.Doc();

    const provider = new WebsocketProvider(
      import.meta.env.VITE_COLLAB_WS_URL || "ws://localhost:1234",
      userId ? `${roomKey}-chat?userId=${userId}` : `${roomKey}-chat`,
      ydoc
    );

    const yMessages = ydoc.getArray("messages");

    yMessagesRef.current = yMessages;

    const syncMessages = () => {
      setMessages(yMessages.toArray());
    };

    yMessages.observe(syncMessages);

    const handleMessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "kicked") {
          window.location.href = "/dashboard";
        }
      } catch (e) {
        // Not a JSON message
      }
    };

    provider.ws.addEventListener("message", handleMessage);

    syncMessages();

    return () => {
      yMessages.unobserve(syncMessages);
      provider.ws.removeEventListener("message", handleMessage);
      provider.destroy();
      ydoc.destroy();
    };
  }, [roomKey, userId]);

  const sendMessage = (message) => {
    if (!yMessagesRef.current) return;

    yMessagesRef.current.push([message]);
  };

  return {
    messages,
    sendMessage,
  };
}
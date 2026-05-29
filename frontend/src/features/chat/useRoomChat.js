import { useEffect, useRef, useState } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

export function useRoomChat(roomKey) {
  const [messages, setMessages] = useState([]);

  const yMessagesRef = useRef(null);

  useEffect(() => {
    const ydoc = new Y.Doc();

    const provider = new WebsocketProvider(
      "ws://localhost:1234",
      `${roomKey}-chat`,
      ydoc
    );

    const yMessages = ydoc.getArray("messages");

    yMessagesRef.current = yMessages;

    const syncMessages = () => {
      setMessages(yMessages.toArray());
    };

    yMessages.observe(syncMessages);

    syncMessages();

    return () => {
      yMessages.unobserve(syncMessages);

      provider.destroy();
      ydoc.destroy();
    };
  }, [roomKey]);

  const sendMessage = (message) => {
    if (!yMessagesRef.current) return;

    yMessagesRef.current.push([message]);
  };

  return {
    messages,
    sendMessage,
  };
}
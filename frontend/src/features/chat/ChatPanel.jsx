import { useEffect, useRef, useState } from "react";
import { useRoomChat } from "./useRoomChat";

function ChatPanel({ roomKey, currentUser }) {
  const [text, setText] = useState("");

  const { messages, sendMessage } = useRoomChat(roomKey);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const handleSend = () => {
    if (!text.trim()) return;

    sendMessage({
      id: crypto.randomUUID(),
      sender: currentUser.username,
      text,
      timestamp: Date.now(),
    });

    setText("");
  };

  return (
    <div className="h-full flex flex-col bg-zinc-900 border-l border-zinc-800">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800">
        <h2 className="font-semibold text-white">
          Chat
        </h2>
      </div>

      {/* Messages */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => {
          const isMine =
            message.sender === currentUser.username;

          return (
            <div
              key={message.id}
              className={`flex ${
                isMine
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] rounded-lg px-3 py-2 ${
                  isMine
                    ? "bg-blue-600 text-white"
                    : "bg-zinc-800 text-white"
                }`}
              >
                <div className="text-xs opacity-70 mb-1">
                  {message.sender}
                </div>

                <div>{message.text}</div>

                <div className="text-[10px] opacity-60 mt-1">
                  {new Date(
                    message.timestamp
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-zinc-800 flex gap-2">
        <input
          value={text}
          onChange={(e) =>
            setText(e.target.value)
          }
          placeholder="Send a message..."
          className="flex-1 bg-zinc-800 text-white rounded px-3 py-2 outline-none"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSend();
            }
          }}
        />

        <button
          onClick={handleSend}
          className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500 text-white"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatPanel;   
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
    <div className="h-full w-full max-w-full min-w-0 flex flex-col bg-[#080808] font-mono">
      {/* Header */}
      <div className="p-4 border-b border-white/[0.06] bg-black/20 min-w-0">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-600">
          // COMMS_CHANNEL
        </h2>
      </div>

      {/* Messages */}
      <div className="flex-1 min-h-0 min-w-0 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {messages.map((message) => {
          const isMine =
            message.sender === currentUser.username;

          return (
            <div
              key={message.id}
              className={`flex flex-col ${
                isMine
                  ? "items-end"
                  : "items-start"
              }`}
            >
              <div className="flex items-center gap-2 mb-1 px-1 max-w-full min-w-0">
                <span className={`text-[10px] font-bold uppercase tracking-wider truncate ${isMine ? 'text-zinc-500' : 'text-emerald-500'}`}>
                  {message.sender}
                </span>
                <span className="text-[9px] text-zinc-700">
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div
                className={`max-w-[90%] px-3 py-2 border ${
                  isMine
                    ? "bg-white/[0.02] border-white/10 text-white"
                    : "bg-emerald-500/[0.02] border-emerald-500/10 text-emerald-500/90"
                }`}
              >
                <div className="text-xs leading-relaxed break-words min-w-0">{message.text}</div>
              </div>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-white/[0.06] bg-black/20 min-w-0">
        <div className="flex flex-col gap-2">
           <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="TYPE_MESSAGE..."
            className="w-full min-w-0 bg-transparent border border-white/10 px-3 py-2.5 text-xs text-white placeholder:text-zinc-800 outline-none focus:border-white/30 transition-colors uppercase"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSend();
              }
            }}
          />
          <button
            onClick={handleSend}
            className="w-full min-w-0 py-2 bg-white text-black text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-black hover:text-white border border-white transition-all touch-manipulation"
          >
            Transmit -&gt;
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatPanel;   

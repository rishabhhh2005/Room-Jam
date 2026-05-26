import { useState } from "react";
import Editor from "@monaco-editor/react";
import { useCollaborativeEditor } from "./useCollaborativeEditor";
import { useRoomPresence } from "../presence/useRoomPresence";

function CollaborativeCodeEditor({ roomKey }) {
  const [editor, setEditor] = useState(null);

  const currentUser = {
    id: crypto.randomUUID(),
    username: "Rishabh",
  };

  const { awareness } = useCollaborativeEditor(roomKey, editor);

  const participants = useRoomPresence(awareness, currentUser);

  return (
    <div className="flex h-screen">
      <div className="w-64 bg-zinc-900 border-r border-zinc-800 p-4">
        <h2 className="text-white font-semibold mb-4">
          Participants ({participants.length})
        </h2>

        <div className="space-y-2">
          {participants.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-2 text-white"
            >
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span>{user.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1">
        <Editor
          height="100vh"
          language="javascript"
          defaultValue="// RoomJam collaborative editor"
          theme="vs-dark"
          onMount={setEditor}
        />
      </div>
    </div>
  );
}

export default CollaborativeCodeEditor;
import { useState } from "react";
import Editor from "@monaco-editor/react";
import { useCollaborativeEditor } from "./useCollaborativeEditor";
import { useRoomPresence } from "../presence/useRoomPresence";
import RoomWorkspaceLayout from "../room/RoomWorkspaceLayout";
import CollaborativeWhiteboard from "../whiteboard/CollaborativeWhiteboard";
import CollaborativeNotes from "../notes/CollaborativeNotes";
import ChatPanel from "../chat/ChatPanel";


function CollaborativeCodeEditor({ roomKey, currentUser, roomData }) {
  const [editor, setEditor] = useState(null);
  const [activeTab, setActiveTab] = useState("editor");

  const { awareness } = useCollaborativeEditor(roomKey, editor, currentUser, "Code");
  const participants = useRoomPresence(awareness, currentUser);

  const kickParticipant = (targetId) => {
    // We need to send a kick message via the websocket.
    // The websocket is inside useCollaborativeEditor, but we can't easily access it here.
    // However, createRoomConnection returns the provider.
    // For now, I'll use a custom event or a shared awareness field to signal the kick.
    // But since I modified the server to listen to JSON messages, I should send one.
    
    // I'll use a hacky way to find the provider or just use a shared map.
    // Actually, I'll modify useCollaborativeEditor to expose the kick function.
    window.dispatchEvent(new CustomEvent('kick-user', { detail: { targetId, roomKey } }));
  };

  return (
    <RoomWorkspaceLayout
      roomId={roomKey}
      participants={participants}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      roomData={roomData}
      currentUser={currentUser}
      onKick={kickParticipant}
    >
      <div className="flex-1 min-w-0 w-full max-w-full h-full overflow-hidden relative">
        {activeTab === "editor" ? (
          <Editor
            height="100%"
            width="100%"
            language="javascript"
            defaultValue={`// RoomJam: ${roomData?.title || 'Collaborative Workspace'}\n\n// Start solving: ${roomData?.problem_statement || ''}`}
            theme="vs-dark"
            onMount={setEditor}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              lineNumbers: 'on',
              roundedSelection: true,
              padding: { top: 20 },
              automaticLayout: true,
              wordWrap: "on",
              scrollbar: {
                horizontal: "auto",
                alwaysConsumeMouseWheel: false,
              },
            }}
          />
        ) : activeTab === "whiteboard" ? (
          <CollaborativeWhiteboard roomKey={roomKey} currentUser={currentUser} />
        ) : activeTab === "notes" ? (
          <CollaborativeNotes roomKey={roomKey} currentUser={currentUser} />
        ) : null}
      </div>

      <div className="w-full h-full shrink-0 min-w-0">
        <ChatPanel
          roomKey={roomKey}
          currentUser={currentUser}
        />
      </div>
    </RoomWorkspaceLayout>
  );
}

export default CollaborativeCodeEditor;

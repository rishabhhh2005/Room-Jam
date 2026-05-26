import { useState } from "react";
import Editor from "@monaco-editor/react";
import { useCollaborativeEditor } from "./useCollaborativeEditor";
import { useRoomPresence } from "../presence/useRoomPresence";
import RoomWorkspaceLayout from "../room/RoomWorkspaceLayout";
import CollaborativeWhiteboard from "../whiteboard/CollaborativeWhiteboard";

function CollaborativeCodeEditor({ roomKey }) {
  const [editor, setEditor] = useState(null);
  const [activeTab, setActiveTab] = useState("editor");

  const currentUser = {
    id: crypto.randomUUID(),
    username: "Rishabh",
  };

  const { awareness } = useCollaborativeEditor(roomKey, editor);

  const participants = useRoomPresence(awareness, currentUser);

  return (
    <RoomWorkspaceLayout
      roomId={roomKey}
      participants={participants}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    >
      {activeTab === "editor" ? (
        <div className="flex-1 h-full min-h-0">
          <Editor
            height="100%"
            language="javascript"
            defaultValue="// RoomJam collaborative editor"
            theme="vs-dark"
            onMount={setEditor}
          />
        </div>
      ) : (
        <div style={{ flex: 1, width: "100%", height: "100%", minHeight: 0 }}>
          <CollaborativeWhiteboard roomKey={roomKey} />
        </div>
      )}
    </RoomWorkspaceLayout>
  );
}

export default CollaborativeCodeEditor;
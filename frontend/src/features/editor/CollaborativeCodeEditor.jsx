import { useState } from "react";
import Editor from "@monaco-editor/react";
import { useCollaborativeEditor } from "./useCollaborativeEditor";
import { useRoomPresence } from "../presence/useRoomPresence";
import RoomWorkspaceLayout from "../room/RoomWorkspaceLayout";
import CollaborativeWhiteboard from "../whiteboard/CollaborativeWhiteboard";
import CollaborativeNotes from "../notes/CollaborativeNotes";

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
  <Editor
    height="100%"
    language="javascript"
    defaultValue="// RoomJam collaborative editor"
    theme="vs-dark"
    onMount={setEditor}
  />
) : activeTab === "whiteboard" ? (
  <CollaborativeWhiteboard roomKey={roomKey} />
) : activeTab === "notes" ? (
  <CollaborativeNotes roomKey={roomKey} />
) : null}
    </RoomWorkspaceLayout>
  );
}

export default CollaborativeCodeEditor;
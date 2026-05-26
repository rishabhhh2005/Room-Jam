import { useState } from "react";
import Editor from "@monaco-editor/react";
import { useCollaborativeEditor } from "./useCollaborativeEditor";
import { useRoomPresence } from "../presence/useRoomPresence";
import RoomWorkspaceLayout from "../room/RoomWorkspaceLayout";

function CollaborativeCodeEditor({ roomKey }) {
  const [editor, setEditor] = useState(null);

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
    >
      <Editor
        height="100%"
        language="javascript"
        defaultValue="// RoomJam collaborative editor"
        theme="vs-dark"
        onMount={setEditor}
      />
    </RoomWorkspaceLayout>
  );
}

export default CollaborativeCodeEditor;
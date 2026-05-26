import { useState } from "react";
import Editor from "@monaco-editor/react";
import { useCollaborativeEditor } from "./useCollaborativeEditor";

function CollaborativeCodeEditor({ roomKey }) {
  const [editor, setEditor] = useState(null);

  useCollaborativeEditor(roomKey, editor);

  return (
    <div className="h-screen w-screen">
      <Editor
        height="100vh"
        language="javascript"
        defaultValue="// RoomJam collaborative editor"
        theme="vs-dark"
        onMount={(editorInstance) => {
          setEditor(editorInstance);
        }}
      />
    </div>
  );
}

export default CollaborativeCodeEditor;
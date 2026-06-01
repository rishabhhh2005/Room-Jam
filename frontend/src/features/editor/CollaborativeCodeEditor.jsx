import { useState, useEffect, useMemo } from "react";
import Editor from "@monaco-editor/react";
import { useCollaborativeEditor } from "./useCollaborativeEditor";
import { useRoomPresence } from "../presence/useRoomPresence";
import RoomWorkspaceLayout from "../room/RoomWorkspaceLayout";
import CollaborativeWhiteboard from "../whiteboard/CollaborativeWhiteboard";
import CollaborativeNotes from "../notes/CollaborativeNotes";
import ChatPanel from "../chat/ChatPanel";
import { useYRoom } from "./useYRoom";
import WorkspaceExplorer from "../room/WorkspaceExplorer";

const getLanguageFromFilename = (filename) => {
  if (!filename) return "javascript";
  const ext = filename.split(".").pop().toLowerCase();
  switch (ext) {
    case "js":
    case "jsx":
      return "javascript";
    case "ts":
    case "tsx":
      return "typescript";
    case "py":
      return "python";
    case "java":
      return "java";
    case "cpp":
    case "cc":
    case "h":
      return "cpp";
    case "c":
      return "c";
    case "go":
      return "go";
    case "rs":
      return "rust";
    case "html":
      return "html";
    case "css":
      return "css";
    case "json":
      return "json";
    case "md":
      return "markdown";
    default:
      return "javascript";
  }
};

function CollaborativeCodeEditor({ roomKey, currentUser, roomData }) {
  const [editor, setEditor] = useState(null);
  const [activeTab, setActiveTab] = useState("editor");
  const [activeFileId, setActiveFileId] = useState(null);

  // Clear editor instance when file is deselected or unmounted
  useEffect(() => {
    if (!activeFileId) {
      setEditor(null);
    }
  }, [activeFileId]);

  const connection = useYRoom(roomKey, currentUser);
  const { awareness, ydoc } = connection;
  
  const { awareness: editorAwareness } = useCollaborativeEditor(connection, editor, roomKey, activeFileId, "Code");
  const participants = useRoomPresence(editorAwareness || awareness, currentUser);

  const activeFileName = useMemo(() => {
    if (!ydoc || !activeFileId) return null;
    const workspaceMap = ydoc.getMap("workspace");
    const file = workspaceMap.get(activeFileId);
    return file?.name;
  }, [ydoc, activeFileId]);

  const editorLanguage = useMemo(() => getLanguageFromFilename(activeFileName), [activeFileName]);

  const kickParticipant = (targetId) => {
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
      workspaceExplorer={ydoc ? (
        <WorkspaceExplorer 
          ydoc={ydoc} 
          activeFileId={activeFileId} 
          onFileSelect={setActiveFileId} 
        />
      ) : null}
    >
      <div className="flex-1 min-w-0 w-full max-w-full h-full overflow-hidden relative">
        {activeTab === "editor" ? (
          activeFileId ? (
            <Editor
              height="100%"
              width="100%"
              language={editorLanguage}
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
          ) : (
            <div className="flex items-center justify-center h-full text-zinc-500 font-sans uppercase tracking-widest text-xs">
              Select a file from the explorer to start coding
            </div>
          )
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

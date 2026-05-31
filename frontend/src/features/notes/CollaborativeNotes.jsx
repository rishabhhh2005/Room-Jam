import { useState } from "react";
import Editor from "@monaco-editor/react";
import { useCollaborativeEditor } from "../editor/useCollaborativeEditor";

function CollaborativeNotes({ roomKey, currentUser }) {
  const [editor, setEditor] = useState(null);

  useCollaborativeEditor(`${roomKey}-notes`, editor, currentUser, "Notes");

  return (
    <div className="h-full w-full max-w-full min-w-0 bg-zinc-950 flex flex-col">
      <div className="min-h-14 border-b border-zinc-800 px-4 sm:px-6 py-2 flex items-center justify-between gap-3 min-w-0">
        <div className="min-w-0">
          <h2 className="text-white font-semibold">
            Shared Notes
          </h2>
          <p className="text-xs text-zinc-400 truncate">
            Collaborative markdown document
          </p>
        </div>

        
      </div>

      <div className="flex-1 min-h-0 min-w-0 px-3 sm:px-6 lg:px-12 py-3 sm:py-6 lg:py-8">
        <div className="h-full w-full max-w-4xl mx-auto border border-zinc-800 sm:rounded-lg overflow-hidden shadow-2xl">
          <Editor
            height="100%"
            width="100%"
            language="markdown"
            theme="vs-dark"
            onMount={setEditor}
            defaultValue={`# Room Notes

## Agenda
- Discussion points
- Decisions
- Action items

## Notes

Start writing here...
`}
            options={{
              minimap: { enabled: false },
              fontSize: 16,
              lineHeight: 26,
              wordWrap: "on",
              scrollBeyondLastLine: false,
              glyphMargin: false,
              folding: false,
              lineNumbers: "off",
              renderLineHighlight: "none",
              overviewRulerBorder: false,
              automaticLayout: true,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default CollaborativeNotes;

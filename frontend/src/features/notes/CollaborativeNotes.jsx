import { useState } from "react";
import Editor from "@monaco-editor/react";
import { useCollaborativeEditor } from "../editor/useCollaborativeEditor";

function CollaborativeNotes({ roomKey }) {
  const [editor, setEditor] = useState(null);

  useCollaborativeEditor(`${roomKey}-notes`, editor);

  return (
    <div className="h-full bg-zinc-950 flex flex-col">
      <div className="h-14 border-b border-zinc-800 px-6 flex items-center justify-between">
        <div>
          <h2 className="text-white font-semibold">
            Shared Notes
          </h2>
          <p className="text-xs text-zinc-400">
            Collaborative markdown document
          </p>
        </div>

        <div className="text-xs text-emerald-400">
          Live Sync
        </div>
      </div>

      <div className="flex-1 px-12 py-8 overflow-hidden">
        <div className="h-full max-w-4xl mx-auto border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
          <Editor
            height="100%"
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
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default CollaborativeNotes;
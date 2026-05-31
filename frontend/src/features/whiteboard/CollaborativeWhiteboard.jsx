import { useCallback, useState } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import { useWhiteboardSync } from "./useWhiteboardSync";

function CollaborativeWhiteboard({ roomKey }) {
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);

  const { handleChange, handlePointerDown, handlePointerUp } =
    useWhiteboardSync(roomKey, excalidrawAPI);

  const onMount = useCallback((api) => {
    setExcalidrawAPI(api);
    // Force Excalidraw to re-measure its container after mount
    requestAnimationFrame(() => api.refresh());
  }, []);

  return (
    <div className="whiteboard-container w-full h-full relative overflow-hidden flex flex-col bg-[#0c0c0c]">
      <div className="flex-1 h-full min-h-0 relative w-full">
        <Excalidraw
          excalidrawAPI={onMount}
          onChange={handleChange}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          isCollaborating
          theme="dark"
          viewModeEnabled={false}
          zenModeEnabled={false}
          gridModeEnabled={false}
          UIOptions={{
            canvasActions: {
              loadScene: false,
              export: false,
              saveAsImage: false,
              toggleTheme: false,
            },
          }}
        />
      </div>
      
      {/* Custom CSS to fix Excalidraw mobile UI issues */}
      <style>{`
        .excalidraw-wrapper, .excalidraw {
          width: 100% !important;
          height: 100% !important;
          max-width: 100vw !important;
        }
        /* Fix for toolbar clipping on very small screens */
        @media (max-width: 768px) {
          .excalidraw .App-bottom-content {
            bottom: 20px;
          }
          .excalidraw .layer-ui__wrapper {
            padding: 0;
          }
        }
      `}</style>
    </div>
  );
}

export default CollaborativeWhiteboard;

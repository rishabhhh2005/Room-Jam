import { useCallback, useEffect, useRef, useState } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import { useWhiteboardSync } from "./useWhiteboardSync";

function CollaborativeWhiteboard({ roomKey, currentUser }) {
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);
  const containerRef = useRef(null);

  const { handleChange, handlePointerDown, handlePointerUp } =
    useWhiteboardSync(roomKey, excalidrawAPI, currentUser);

  const onMount = useCallback((api) => {
    setExcalidrawAPI(api);
    // Force Excalidraw to re-measure its container after mount
    requestAnimationFrame(() => api.refresh());
  }, []);

  useEffect(() => {
    if (!excalidrawAPI || !containerRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(() => excalidrawAPI.refresh());
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [excalidrawAPI]);

  return (
    <div ref={containerRef} className="whiteboard-container w-full max-w-full min-w-0 h-full relative overflow-hidden flex flex-col bg-[#0c0c0c] touch-none">
      <div className="flex-1 h-full min-h-0 min-w-0 relative w-full max-w-full">
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
          max-width: 100% !important;
          min-width: 0 !important;
          touch-action: none;
        }
        .excalidraw .layer-ui__wrapper,
        .excalidraw .App-menu_top,
        .excalidraw .App-toolbar,
        .excalidraw .Island {
          max-width: 100%;
          min-width: 0;
        }
        /* Fix for toolbar clipping on very small screens */
        @media (max-width: 768px) {
          .excalidraw {
            --lg-button-size: 2.25rem;
          }
          .excalidraw .App-bottom-content {
            bottom: 12px;
            max-width: calc(100% - 16px);
          }
          .excalidraw .layer-ui__wrapper {
            padding: 4px;
            width: 100%;
            max-width: 100%;
          }
          .excalidraw .App-menu_top {
            width: 100%;
            max-width: 100%;
          }
          .excalidraw .App-toolbar {
            max-width: calc(100% - 8px);
            overflow-x: auto;
            scrollbar-width: none;
          }
        }
      `}</style>
    </div>
  );
}

export default CollaborativeWhiteboard;

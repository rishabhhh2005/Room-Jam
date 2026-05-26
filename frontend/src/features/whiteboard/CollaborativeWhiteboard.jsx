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
    <div style={{ width: "100%", height: "100%", position: "relative", minHeight: 0 }}>
      <Excalidraw
        excalidrawAPI={onMount}
        onChange={handleChange}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        isCollaborating
        theme="dark"
        viewModeEnabled={false}
        zenModeEnabled={false}
      />
    </div>
  );
}

export default CollaborativeWhiteboard;

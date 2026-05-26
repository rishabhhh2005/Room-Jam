import { useEffect, useRef } from "react";
import { MonacoBinding } from "y-monaco";
import { createRoomConnection } from "./useYRoom";

export function useCollaborativeEditor(roomKey, editor) {
  const bindingRef = useRef(null);

  useEffect(() => {
    if (!editor || !roomKey) return;

    const { ydoc, provider, awareness } = createRoomConnection(roomKey);

    const yText = ydoc.getText("monaco");

    bindingRef.current = new MonacoBinding(
      yText,
      editor.getModel(),
      new Set([editor]),
      awareness
    );

    awareness.setLocalStateField("user", {
      name: "Rishabh",
      color: "#00ff88",
    });

    return () => {
      bindingRef.current?.destroy();
      provider.disconnect();
      ydoc.destroy();
    };
  }, [roomKey, editor]);
}
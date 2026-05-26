import { useEffect, useRef, useState } from "react";
import { MonacoBinding } from "y-monaco";
import { createRoomConnection } from "./useYRoom";

export function useCollaborativeEditor(roomKey, editor) {
  const bindingRef = useRef(null);
  const [awareness, setAwareness] = useState(null);

  useEffect(() => {
    if (!editor || !roomKey) return;

    const { ydoc, provider, awareness } = createRoomConnection(roomKey);

    setAwareness(awareness);

    const yText = ydoc.getText("monaco");

    bindingRef.current = new MonacoBinding(
      yText,
      editor.getModel(),
      new Set([editor]),
      awareness
    );

    return () => {
      bindingRef.current?.destroy();
      provider.disconnect();
      ydoc.destroy();
    };
  }, [roomKey, editor]);

  return { awareness };
}
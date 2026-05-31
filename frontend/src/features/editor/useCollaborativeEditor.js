import { useEffect, useRef, useState } from "react";
import { MonacoBinding } from "y-monaco";
import { createRoomConnection } from "./useYRoom";
import { toast } from "sonner";

export function useCollaborativeEditor(roomKey, editor, currentUser, type = "Code") {
  const bindingRef = useRef(null);
  const [awareness, setAwareness] = useState(null);
  const lastToastRef = useRef(0);

  useEffect(() => {
    if (!editor || !roomKey) return;

    const { ydoc, provider, awareness: connAwareness } = createRoomConnection(roomKey, currentUser?.id);

    setAwareness(connAwareness);

    const yText = ydoc.getText("monaco");

    const toastDebounced = (msg) => {
      const now = Date.now();
      if (now - lastToastRef.current > 3000) {
        toast.info(msg);
        lastToastRef.current = now;
      }
    };

    yText.observe((event) => {
      if (event.transaction.local) return;
      toastDebounced(`${type} updated`);
    });

    bindingRef.current = new MonacoBinding(
      yText,
      editor.getModel(),
      new Set([editor]),
      connAwareness
    );

    // Listen for custom server messages (like kicked or notifications)
    const handleMessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "kicked") {
          toast.error(data.message || "You have been removed from this room.");
          window.location.href = "/dashboard";
        } else if (data.type === "notification" && data.category === "kick") {
          toast.info(data.content);
        }
      } catch (e) {
        // Not a JSON message
      }
    };

    const handleKickUser = (event) => {
      const { targetId, roomKey: kickRoomKey } = event.detail;
      if (kickRoomKey === roomKey) {
        provider.ws.send(JSON.stringify({ type: "kick", targetId, roomKey }));
      }
    };

    window.addEventListener("kick-user", handleKickUser);
    provider.ws.addEventListener("message", handleMessage);

    return () => {
      bindingRef.current?.destroy();
      window.removeEventListener("kick-user", handleKickUser);
      provider.ws.removeEventListener("message", handleMessage);
      provider.disconnect();
      ydoc.destroy();
    };
  }, [roomKey, editor, currentUser?.id, type]);

  return { awareness };
}

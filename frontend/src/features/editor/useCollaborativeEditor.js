import { useEffect, useRef } from "react";
import { MonacoBinding } from "y-monaco";
import { toast } from "sonner";

export function useCollaborativeEditor(connection, editor, roomKey, activeFileId, type = "Code") {
  const { ydoc, provider, awareness } = connection;
  const bindingRef = useRef(null);
  const lastToastRef = useRef(0);

  useEffect(() => {
    if (!editor || !ydoc || !provider || !awareness || !activeFileId) return;

    const yText = ydoc.getText(activeFileId);

    const toastDebounced = (msg) => {
      const now = Date.now();
      if (now - lastToastRef.current > 3000) {
        toast.info(msg);
        lastToastRef.current = now;
      }
    };

    const observer = (event) => {
      if (event.transaction.local) return;
      toastDebounced(`${type} updated`);
    };

    yText.observe(observer);

    const model = editor.getModel();
    if (model) {
      bindingRef.current = new MonacoBinding(
        yText,
        model,
        new Set([editor]),
        awareness
      );
    }

    return () => {
      bindingRef.current?.destroy();
      yText.unobserve(observer);
    };
  }, [editor, ydoc, provider, awareness, activeFileId, type]);

  useEffect(() => {
    if (!provider || !roomKey) return;

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
      if (kickRoomKey === roomKey && provider.ws && provider.ws.readyState === WebSocket.OPEN) {
        provider.ws.send(JSON.stringify({ type: "kick", targetId, roomKey }));
      }
    };

    window.addEventListener("kick-user", handleKickUser);
    provider.ws.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("kick-user", handleKickUser);
      provider.ws.removeEventListener("message", handleMessage);
    };
  }, [provider, roomKey]);

  return { awareness };
}

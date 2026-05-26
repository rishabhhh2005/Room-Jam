import { useCallback, useEffect, useRef } from "react";
import {
  CaptureUpdateAction,
  reconcileElements,
  restoreElements,
} from "@excalidraw/excalidraw";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

const SYNC_THROTTLE_MS = 80;

export function useWhiteboardSync(roomKey, excalidrawAPI) {
  const clientId = useRef(crypto.randomUUID());
  const isApplyingRemote = useRef(false);
  const isPointerDown = useRef(false);
  const pendingRemoteElements = useRef(null);
  const sceneMapRef = useRef(null);
  const latestElementsRef = useRef(null);
  const flushTimerRef = useRef(null);
  const lastSentSnapshotRef = useRef("");

  const applyRemoteElements = useCallback(
    (remoteElements) => {
      if (!excalidrawAPI || !remoteElements) return;

      const restoredElements = restoreElements(
        remoteElements,
        excalidrawAPI.getSceneElementsIncludingDeleted()
      );

      const reconciledElements = reconcileElements(
        excalidrawAPI.getSceneElementsIncludingDeleted(),
        restoredElements,
        excalidrawAPI.getAppState()
      );

      isApplyingRemote.current = true;
      excalidrawAPI.updateScene({
        elements: reconciledElements,
        captureUpdate: CaptureUpdateAction.NEVER,
      });

      queueMicrotask(() => {
        isApplyingRemote.current = false;
      });
    },
    [excalidrawAPI]
  );

  const flushLocalChanges = useCallback(() => {
    flushTimerRef.current = null;

    const sceneMap = sceneMapRef.current;
    const elements = latestElementsRef.current;

    if (!sceneMap || !elements || isApplyingRemote.current) return;

    const snapshot = JSON.stringify(elements);
    if (snapshot === lastSentSnapshotRef.current) return;

    lastSentSnapshotRef.current = snapshot;
    sceneMap.doc.transact(() => {
      sceneMap.set("elements", elements);
      sceneMap.set("updatedBy", clientId.current);
      sceneMap.set("updatedAt", Date.now());
    }, clientId.current);
  }, []);

  useEffect(() => {
    if (!roomKey || !excalidrawAPI) return;

    const ydoc = new Y.Doc();

    const provider = new WebsocketProvider(
      "ws://localhost:1234",
      `${roomKey}-whiteboard`,
      ydoc
    );

    const sceneMap = ydoc.getMap("scene");
    sceneMapRef.current = sceneMap;

    const syncRemoteToCanvas = (event) => {
      if (event?.transaction.origin === clientId.current) return;
      if (sceneMap.get("updatedBy") === clientId.current) return;

      const elements = sceneMap.get("elements");

      if (!elements) return;

      if (isPointerDown.current) {
        pendingRemoteElements.current = elements;
        return;
      }

      applyRemoteElements(elements);
    };

    sceneMap.observe(syncRemoteToCanvas);

    syncRemoteToCanvas();

    return () => {
      if (flushTimerRef.current) {
        clearTimeout(flushTimerRef.current);
        flushTimerRef.current = null;
      }

      sceneMap.unobserve(syncRemoteToCanvas);
      sceneMapRef.current = null;
      provider.destroy();
      ydoc.destroy();
    };
  }, [roomKey, excalidrawAPI, applyRemoteElements]);

  const handleChange = useCallback(
    (elements) => {
      if (isApplyingRemote.current) return;

      latestElementsRef.current = elements;

      if (!flushTimerRef.current) {
        flushTimerRef.current = setTimeout(
          flushLocalChanges,
          SYNC_THROTTLE_MS
        );
      }
    },
    [flushLocalChanges]
  );

  const handlePointerDown = useCallback(() => {
    isPointerDown.current = true;
  }, []);

  const handlePointerUp = useCallback(() => {
    isPointerDown.current = false;

    flushLocalChanges();

    if (pendingRemoteElements.current) {
      const elements = pendingRemoteElements.current;
      pendingRemoteElements.current = null;
      applyRemoteElements(elements);
    }
  }, [applyRemoteElements, flushLocalChanges]);

  return {
    handleChange,
    handlePointerDown,
    handlePointerUp,
  };
}

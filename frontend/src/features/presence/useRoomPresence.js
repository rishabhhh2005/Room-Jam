import { useEffect, useState } from "react";

export function useRoomPresence(awareness, currentUser) {
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    if (!awareness || !currentUser) return;

    awareness.setLocalStateField("user", {
      id: currentUser.id,
      name: currentUser.username,
      color: "#22c55e",
    });

    const updateParticipants = () => {
      const states = Array.from(awareness.getStates().values());

      const users = states
        .map((state) => state.user)
        .filter(Boolean);

      const uniqueUsers = Array.from(
        new Map(users.map((user) => [user.id, user])).values()
      );

      setParticipants(uniqueUsers);
    };

    awareness.on("change", updateParticipants);

    updateParticipants();

    return () => {
      awareness.off("change", updateParticipants);
    };
  }, [awareness, currentUser]);

  return participants;
}
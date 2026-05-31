import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";

export function useRoomPresence(awareness, currentUser) {
  const [participants, setParticipants] = useState([]);
  const prevParticipantsRef = useRef([]);

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

      // Activity Feed: Join/Leave notifications
      const prevUsers = prevParticipantsRef.current;
      
      // New users (joined)
      uniqueUsers.forEach(user => {
        if (user.id !== currentUser.id && !prevUsers.find(u => u.id === user.id)) {
          toast.info(`${user.name || 'A user'} joined the room`);
        }
      });

      // Users who left
      prevUsers.forEach(user => {
        if (user.id !== currentUser.id && !uniqueUsers.find(u => u.id === user.id)) {
          toast.info(`${user.name || 'A user'} left the room`);
        }
      });

      prevParticipantsRef.current = uniqueUsers;
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

import { useParams } from "react-router-dom";
import CollaborativeCodeEditor from "../features/editor/CollaborativeCodeEditor";

function RoomPage() {
  const { roomId } = useParams();

  return <CollaborativeCodeEditor roomKey={roomId} />;
}

export default RoomPage;
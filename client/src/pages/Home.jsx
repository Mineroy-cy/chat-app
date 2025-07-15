import { useEffect, useState } from "react";
import { getRooms, getMessages, socket } from "../services/backenint";
import ChatRoom from "../components/ChatRoom";

// Helpers
const stringToColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 60%)`;
};

const getInitials = (name) =>
  name?.split(" ").map((word) => word[0]).join("").toUpperCase();

export default function Home({ user }) {
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetchRooms();
    socket.connect();
    return () => socket.disconnect();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await getRooms();
      setRooms(res.data);
    } catch (error) {
      console.error("Failed to fetch rooms", error.message);
    }
  };

  const handleJoinRoom = async (room) => {
    socket.emit("joinRoom", { username: user.username, roomId: room._id });
    setCurrentRoom(room);
    const res = await getMessages(room._id);
    setMessages(res.data);
  };

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <aside className="w-1/4 min-w-[240px] bg-gray-100 dark:bg-gray-800 border-r p-4 overflow-y-auto">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Rooms</h2>
        </div>

        <ul className="space-y-3">
          {rooms.map((room) => (
            <li key={room._id}>
              <button
                onClick={() => handleJoinRoom(room)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition ${
                  currentRoom?._id === room._id
                    ? "bg-blue-600 text-white"
                    : "bg-white dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white shadow-sm"
                  style={{ backgroundColor: stringToColor(room.name) }}
                >
                  {getInitials(room.name)}
                </div>
                <span className="text-sm font-medium">{room.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <main className="flex-1 p-6 overflow-hidden">
        {currentRoom ? (
          <ChatRoom
            room={currentRoom}
            messages={messages}
            user={user}
            socket={socket}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500 text-lg">
            Select a room to join
          </div>
        )}
      </main>
    </div>
  );
}

import { useEffect, useState } from "react";
import { getRooms, getMessages, createRoom, socket } from "../services/backenint";
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");

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
    setMenuOpen(false); // close sidebar on mobile
  };

  const handleCreateRoom = async () => {
    if (!newRoomName.trim()) return;
    try {
      const res = await createRoom(newRoomName);
      setNewRoomName("");
      setCreating(false);
      fetchRooms();
    } catch (err) {
      console.error("Room creation failed:", err.message);
    }
  };

  return (
    <div className="flex h-screen flex-col md:flex-row bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Mobile Menu Toggle */}
      <button
        className="md:hidden p-3 text-left bg-gray-100 dark:bg-gray-800 border-b"
        onClick={() => setMenuOpen((prev) => !prev)}
      >
        ☰ {currentRoom ? currentRoom.name : "Select Room"}
      </button>

      {/* Sidebar */}
      <aside
        className={`md:block md:w-1/4 min-w-[240px] bg-gray-100 dark:bg-gray-800 border-r p-4 overflow-y-auto transition-all duration-200 z-10 ${
          menuOpen ? "block" : "hidden"
        } md:relative absolute w-full h-full top-0 left-0`}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Rooms</h2>
          <button
            onClick={() => setCreating((prev) => !prev)}
            className="text-sm px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            + New
          </button>
        </div>

        {/* Create Room Form */}
        {creating && (
          <div className="mb-4 flex items-center gap-2">
            <input
              className="flex-1 p-2 border rounded bg-white dark:bg-gray-700 dark:text-white text-sm"
              placeholder="Room name"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
            />
            <button
              onClick={handleCreateRoom}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
            >
              Create
            </button>
          </div>
        )}

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

      {/* Chat Section */}
      <main className="flex-1 p-2 md:p-6 overflow-hidden">
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

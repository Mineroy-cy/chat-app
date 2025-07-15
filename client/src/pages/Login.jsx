import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/backenint";

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

export default function Login({ setUser }) {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username.trim()) return;
    const res = await registerUser(username);
    setUser(res.data);
    navigate("/");
  };

  const avatarColor = stringToColor(username || "Guest");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-200 to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-sm text-center">
        <div
          className="mx-auto mb-4 w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg shadow"
          style={{ backgroundColor: avatarColor }}
        >
          {getInitials(username || "Guest")}
        </div>
        <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Join the Chat</h1>

        <input
          className="w-full p-3 mb-4 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded transition font-medium"
        >
          Enter
        </button>
      </div>
    </div>
  );
}

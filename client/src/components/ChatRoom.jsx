import { useEffect, useRef, useState } from "react";

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

const formatTime = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const emojiList = ["😀", "😂", "😍", "👍", "🎉", "😎", "❤️", "🔥", "🙏", "💡"];

export default function ChatRoom({ room, messages, user, socket }) {
  const [chat, setChat] = useState("");
  const [typingUser, setTypingUser] = useState("");
  const [liveMessages, setLiveMessages] = useState([]);
  const [showEmojis, setShowEmojis] = useState(false);
  const msgRef = useRef(null);

  useEffect(() => {
    socket.on("newMessage", (msg) => {
      setLiveMessages((prev) => [...prev, msg]);
    });

    socket.on("typing", (username) => {
      setTypingUser(username);
    });

    socket.on("stopTyping", () => {
      setTypingUser("");
    });

    return () => {
      socket.off("newMessage");
      socket.off("typing");
      socket.off("stopTyping");
    };
  }, []);

  useEffect(() => {
    if (msgRef.current) {
      msgRef.current.scrollTop = msgRef.current.scrollHeight;
    }
  }, [messages, liveMessages]);

  const handleTyping = () => {
    socket.emit("typing");
    setTimeout(() => socket.emit("stopTyping"), 1000);
  };

  const handleSend = () => {
    if (chat.trim() === "") return;
    socket.emit("sendMessage", chat);
    setChat("");
    setShowEmojis(false);
  };

  const handleEmojiClick = (emoji) => {
    setChat((prev) => prev + emoji);
    setShowEmojis(false);
  };

  const allMessages = [...messages, ...liveMessages];

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <header className="pb-4 border-b mb-4">
        <h2 className="text-2xl font-semibold">{room.name}</h2>
      </header>

      <div
        className="flex-1 overflow-y-auto space-y-4 bg-gray-100 dark:bg-gray-800 p-4 rounded border"
        ref={msgRef}
      >
        {allMessages.map((msg, i) => {
          const senderName = msg.sender?.username || "Unknown";
          const isSelf = senderName === user.username;
          const isLastOwnMessage =
            isSelf &&
            i === allMessages
              .map((m) => m.sender?.username)
              .lastIndexOf(user.username);

          return (
            <div
              key={msg._id || i}
              className={`flex items-start gap-3 ${
                isSelf ? "justify-end flex-row-reverse" : "justify-start"
              }`}
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white"
                style={{ backgroundColor: stringToColor(senderName) }}
              >
                {getInitials(senderName)}
              </div>

              <div className="max-w-sm">
                <div
                  className={`text-sm rounded-lg p-3 shadow ${
                    isSelf
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 dark:bg-gray-700 dark:text-white"
                  }`}
                >
                  {msg.content}
                </div>

                <div className="flex items-center justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
                  <span>{!isSelf && senderName}</span>
                  <span>{formatTime(msg.createdAt)}</span>
                </div>

                {isLastOwnMessage && (
                  <div className="text-right text-xs text-green-500 mt-1">Seen</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {typingUser && (
        <div className="text-sm text-gray-500 italic mt-1 mb-2">
          {typingUser} is typing...
        </div>
      )}

      <div className="relative mt-2 flex items-center gap-2">
        <button
          onClick={() => setShowEmojis(!showEmojis)}
          className="text-xl bg-gray-200 dark:bg-gray-700 rounded p-2 hover:scale-105"
        >
          😊
        </button>

        <input
          className="flex-1 p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 dark:bg-gray-700 dark:text-white"
          value={chat}
          onChange={(e) => setChat(e.target.value)}
          onKeyDown={handleTyping}
          placeholder="Type a message..."
        />

        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
          onClick={handleSend}
        >
          Send
        </button>

        {showEmojis && (
          <div className="absolute bottom-14 left-0 bg-white dark:bg-gray-700 border rounded shadow p-2 flex flex-wrap gap-2 z-50">
            {emojiList.map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleEmojiClick(emoji)}
                className="text-2xl hover:scale-110 transition"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

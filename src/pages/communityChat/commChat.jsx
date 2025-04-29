import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";

const SOCKET_SERVER_URL = "http://3.145.109.156:5001";
const API_URL = "http://3.145.109.156:5001/api";

const currentUserId = Number(sessionStorage.getItem("userId"));
const currentUserRole = sessionStorage.getItem("role");

const socket = io(SOCKET_SERVER_URL, { withCredentials: true });

const ChatApp = () => {
  // Store ALL messages by userId: { userId: [msg, msg, ...], ... }
  const [allMessages, setAllMessages] = useState({});
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [input, setInput] = useState("");
  const [unread, setUnread] = useState({}); // { userId: count }
  const messagesEndRef = useRef();

  // Fetch all users except yourself
  useEffect(() => {
    axios.get(`${API_URL}/chat`)
      .then(res => setUsers(res.data.filter(u => u.id !== currentUserId)));
  }, [currentUserId]);

  // Register socket and handle incoming messages
  useEffect(() => {
    socket.emit("register", currentUserId);

    socket.on("receive_message", (msg) => {
      // Find the chat partner (not yourself)
      const chatUserId = msg.sender_id === currentUserId ? msg.receiver_id : msg.sender_id;
      setAllMessages(prev => ({
        ...prev,
        [chatUserId]: [...(prev[chatUserId] || []), msg]
      }));
      // If you're not viewing this chat, mark as unread
      if (!selectedUser || chatUserId !== selectedUser.id) {
        setUnread(prev => ({
          ...prev,
          [chatUserId]: (prev[chatUserId] || 0) + 1
        }));
      }
    });

    return () => {
      socket.off("receive_message");
    };
  }, [currentUserId, selectedUser]);

  // Load chat history when selecting a user
  useEffect(() => {
    if (!selectedUser) return;
    axios
      .get(`${API_URL}/chat/${selectedUser.id}?userId=${currentUserId}`)
      .then((res) => {
        setAllMessages(prev => ({
          ...prev,
          [selectedUser.id]: res.data
        }));
        // Mark this user as read
        setUnread(prev => ({
          ...prev,
          [selectedUser.id]: 0
        }));
      });
  }, [selectedUser, currentUserId]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages, selectedUser]);

  // Send message via API and socket (do NOT optimistically add to UI)
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !selectedUser) return;
    await axios.post(`${API_URL}/chat/send`, {
      sender_id: currentUserId,
      receiver_id: selectedUser.id,
      message: input,
    });
    socket.emit("send_message", {
      sender_id: currentUserId,
      receiver_id: selectedUser.id,
      message: input,
      sent_at: new Date().toISOString(),
    });
    setInput("");
  };

  // Messages for selected chat
  const messages = selectedUser ? (allMessages[selectedUser.id] || []) : [];
  const sortedUsers = [...users].sort((a, b) => {
    const unreadA = unread[a.id] || 0;
    const unreadB = unread[b.id] || 0;
    if (unreadA !== unreadB) return unreadB - unreadA;
    return a.username.localeCompare(b.username);
  });
  
  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-100 rounded-lg shadow overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r flex flex-col">
        <div className="px-6 py-5 border-b font-bold text-xl text-black">Chats</div>
        <div className="flex-1 overflow-y-auto">
          {users.length === 0 && (
            <div className="text-gray-400 text-center mt-10">No users found.</div>
          )}
          {sortedUsers.map((user) => (
            <button
              key={user.id}
              className={`flex items-center w-full px-5 py-3 text-left transition-colors border-b
                ${
                  selectedUser?.id === user.id
                    ? "bg-gray-900 text-white"
                    : "hover:bg-gray-200 text-gray-800"
                }`}
              onClick={() => setSelectedUser(user)}
            >
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-lg font-bold mr-4">
                {user.username[0]?.toUpperCase() || "?"}
              </div>
              <div className="flex-1">
                <div className="font-medium">{user.username}</div>
                <div className="text-xs text-gray-500 capitalize">{user.role}</div>
              </div>
              {unread[user.id] > 0 && (
                <span className="ml-auto bg-red-600 text-white text-xs rounded-full px-2 py-1">
                  {unread[user.id]}
                </span>
              )}
            </button>
          ))}
        </div>
      </aside>

      {/* Chat Area */}
      <main className="flex-1 flex flex-col relative">
        {/* Chat Header */}
        <div className="h-20 bg-white border-b flex items-center px-8">
          {selectedUser ? (
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-xl font-bold">
                {selectedUser.username[0]?.toUpperCase() || "?"}
              </div>
              <div>
                <div className="font-semibold text-lg">{selectedUser.username}</div>
                <div className="text-sm text-gray-500">{selectedUser.role}</div>
              </div>
            </div>
          ) : (
            <span className="text-gray-400">Select a user to start chatting</span>
          )}
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
          {selectedUser ? (
            <>
              {messages.length === 0 && (
                <div className="text-gray-400 text-center mt-10">No messages yet.</div>
              )}
              <div className="flex flex-col gap-2">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${
                      msg.sender_id === currentUserId ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`px-4 py-2 rounded-2xl max-w-xl break-words shadow ${
                        msg.sender_id === currentUserId
                          ? "bg-blue-600 text-white rounded-br-none"
                          : "bg-gray-200 text-gray-900 rounded-bl-none"
                      }`}
                    >
                      {msg.message}
                      <div className="text-xs text-gray-300 mt-1 text-right">
                        {new Date(msg.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef}></div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              Select a user to chat.
            </div>
          )}
        </div>

        {/* Chat Input */}
        {selectedUser && (
          <form
            onSubmit={handleSend}
            className="absolute left-0 right-0 bottom-0 flex bg-white p-4 border-t"
          >
            <input
              className="flex-1 border border-gray-300 rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 mr-3"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              autoFocus
            />
            <button
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-full shadow hover:bg-blue-700 transition"
              type="submit"
            >
              Send
            </button>
          </form>
        )}
      </main>
    </div>
  );
};

export default ChatApp;

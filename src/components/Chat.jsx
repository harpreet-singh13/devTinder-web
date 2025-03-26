import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { formatDistanceToNow, isValid } from "date-fns";

const Chat = () => {
  const { targetUserId } = useParams();
  const user = useSelector((store) => store.user);
  const userId = user?._id;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  const formatMessageTime = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return isValid(date)
        ? formatDistanceToNow(date, { addSuffix: true })
        : "Just now";
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Just now";
    }
  };

  const fetchChatMessages = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const chat = await axios.get(BASE_URL + "/chat/" + targetUserId, {
        withCredentials: true,
      });

      const chatMessages =
        chat?.data?.messages?.map((msg) => ({
          id: msg._id,
          firstName: msg?.senderId?.firstName,
          text: msg?.text,
          timestamp: msg?.createdAt,
          isCurrentUser: msg?.senderId?._id === userId,
          isOptimistic: false,
        })) || [];

      setMessages(chatMessages);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
      setError("Failed to load messages. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChatMessages();

    socketRef.current = createSocketConnection();
    socketRef.current.emit("joinChat", {
      firstName: user?.firstName,
      userId,
      targetUserId,
    });

    socketRef.current.on("messageReceived", (message) => {
      setMessages((prev) => {
        // Check if this message already exists (for optimistic updates)
        const messageExists = prev.some(
          (msg) =>
            (msg.isOptimistic && msg.text === message.text) ||
            msg.id === message._id
        );

        if (!messageExists) {
          return [
            ...prev,
            {
              id: message._id,
              firstName: message.firstName,
              text: message.text,
              timestamp: message.timestamp,
              isCurrentUser: message.userId === userId,
              isOptimistic: false,
            },
          ];
        }
        return prev;
      });
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [userId, targetUserId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!newMessage.trim()) return;

    // Generate a temporary ID that follows the same format as server IDs
    const tempId = `temp-${Date.now()}`;
    const timestamp = new Date().toISOString();

    setMessages((prev) => [
      ...prev,
      {
        id: tempId,
        firstName: user?.firstName,
        text: newMessage,
        timestamp,
        isCurrentUser: true,
        isOptimistic: true,
      },
    ]);

    socketRef.current.emit("sendMessage", {
      firstName: user?.firstName,
      userId,
      targetUserId,
      text: newMessage,
      tempId, // Send the temporary ID to the server
      timestamp,
    });

    setNewMessage("");
    setTimeout(scrollToBottom, 100);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
      {/* Chat Header */}
      <div className="bg-indigo-600 dark:bg-indigo-800 text-white p-4 shadow-md">
        <h1 className="text-xl font-semibold">
          Chat with {messages.length > 0 ? messages[0]?.firstName : "User"}
        </h1>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-red-500">{error}</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-500 dark:text-gray-400">
              No messages yet. Start the conversation!
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.isCurrentUser ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2 ${
                  msg.isCurrentUser
                    ? "bg-indigo-600 text-white rounded-br-none"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none"
                }`}
              >
                {!msg.isCurrentUser && (
                  <p className="font-semibold text-sm">{msg.firstName}</p>
                )}
                <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                <p className="text-xs opacity-70 mt-1 text-right">
                  {formatMessageTime(msg.timestamp)}
                  {msg.isOptimistic && (
                    <span className="ml-1">(Sending...)</span>
                  )}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={sendMessage}
        className="border-t border-gray-300 dark:border-gray-700 p-3 bg-white dark:bg-gray-800"
      >
        <div className="flex items-center space-x-2">
          <textarea
            className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg p-3 
                      focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 
                      dark:text-white resize-none"
            placeholder="Type your message..."
            rows="1"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 py-3 
                      transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!newMessage.trim()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;

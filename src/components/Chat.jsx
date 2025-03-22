import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Chat = () => {
  const { targetUserId } = useParams();
  const user = useSelector((store) => store.user);
  const userId = user?._id;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const fetchChatMessages = async () => {
    const chat = await axios.get(BASE_URL + "/chat/" + targetUserId, {
      withCredentials: true,
    });

    console.log(chat?.data?.messages);

    const chatMesssages = chat?.data?.messages.map((msg) => {
      return {
        firstName: msg?.senderId?.firstName,
        text: msg?.text,
      };
    });

    setMessages(chatMesssages);
  };

  useEffect(() => {
    fetchChatMessages();
  }, []);

  useEffect(() => {
    const socket = createSocketConnection();
    socket.emit("joinChat", {
      firstName: user?.firstName,
      userId,
      targetUserId,
    });

    socket.on("messageReceived", ({ firstName, text }) => {
      console.log(firstName + ": " + text);

      setMessages((messages) => [...messages, { firstName, text }]);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, targetUserId]);

  const sendMessage = () => {
    const socket = createSocketConnection();

    socket.emit("sendMessage", {
      firstName: user?.firstName,
      userId,
      targetUserId,
      text: newMessage,
    });
    setNewMessage("");
  };

  return (
    <div className="w-1/2 mx-auto border border-gray-600 m-5 h-[70vh] flex flex-col">
      <h1 className="p-5 border-b border-gray-600">Chat</h1>
      <div className="flex-1 overflow-y-scroll p-5">
        {messages.map((msg, index) => {
          return (
            <div
              key={index}
              className={
                user?.firstName == msg.firstName
                  ? "chat chat-end"
                  : "chat chat-start"
              }
            >
              <div className="chat-header">
                {msg.firstName}
                <time className="text-xs opacity-50">2 hours ago</time>
              </div>
              <div className="chat-bubble chat-end">{msg.text}</div>
              <div className="chat-footer opacity-50">Seen</div>
            </div>
          );
        })}
      </div>
      <div className="p-5 border-t border-gray-600 flex items-center gap-2">
        <input
          className="flex-1 border border-gray-500 text-white rounded p-2"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        ></input>
        <button className="btn btn-secondary" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;

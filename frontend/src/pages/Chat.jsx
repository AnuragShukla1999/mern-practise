import React, { useEffect, useState } from "react";
import "./styles/Chat.css";
import {
  FaArrowLeft,
  FaPaperPlane,
  FaEllipsisV,
} from "react-icons/fa";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import socket from "../socket";

const Chat = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();

  const user = useSelector((state) => state.auth.user);

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const onlineUser = state?.onlineUser;

  console.log("chatId    ================>  ", chatId);

  useEffect(() => {
    socket.connect();

    socket.emit("join_room", chatId);

    loadMessages();

    socket.on("receive_message", (msg) => {
      if (msg.conversationId === Number(chatId)) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socket.off("receive_message");
      socket.disconnect();
    };
  }, [chatId]);

  const loadMessages = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `http://10.94.229.198:3006/api/v1/message/${chatId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessages(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://10.94.229.198:3006/api/v1/message",
        {
          conversationId: Number(chatId),
          senderId: user.id,
          text: message,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      socket.emit("send_message", res.data);

      setMessages((prev) => [...prev, res.data]);

      setMessage("");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="chat-page">

      <div className="chat-header">

        <button
          className="back-btn"
          onClick={() => navigate("/chat")}
        >
          <FaArrowLeft />
        </button>

        <div className="header-user">

          <div className="avatar">
            {onlineUser?.name?.charAt(0).toUpperCase()}
          </div>

          <div>
            <h3>{onlineUser?.name}</h3>
            <small>Online</small>
          </div>

        </div>

        <FaEllipsisV />

      </div>

      <div className="chat-body">

        {messages.map((msg) => (

          <div
            key={msg.id}
            className={
              msg.senderId === user.id
                ? "message sent"
                : "message received"
            }
          >
            {msg.text}
          </div>

        ))}

      </div>

      <form
        className="chat-input"
        onSubmit={sendMessage}
      >

        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button type="submit">
          <FaPaperPlane />
        </button>

      </form>

    </div>
  );
};

export default Chat;
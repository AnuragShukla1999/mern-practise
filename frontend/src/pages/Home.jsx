// import React, { useEffect, useState } from "react";
// import "./styles/Home.css";
// import { FaSearch, FaPaperPlane, FaEllipsisV } from "react-icons/fa";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import socket from "../socket";

// const Home = () => {
//   const user = useSelector((state) => state.auth.user);
//   console.log("socket ------------> ", socket);

//   const [conversations, setConversations] = useState([]);
//   const [selectedChat, setSelectedChat] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [message, setMessage] = useState("");
//   const [onlineUsers, setOnlineUsers] = useState([]);

//   const [showChat, setShowChat] = useState(false);

//   console.log("onlineUsers ------------> ", onlineUsers);
//   console.log("conversations ------------> ", conversations);
//   console.log("selectedChat ------------> ", selectedChat);

//   useEffect(() => {
//     socket.connect();

//     socket.on("receive_message", (msg) => {
//       if (msg.conversationId === selectedChat?.id) {
//         setMessages((prev) => [...prev, msg]);
//       }
//     });

//     return () => {
//       socket.off("receive_message");
//       socket.disconnect();
//     };
//   }, [selectedChat]);

//   const getConversations = async () => {
//     try {
//       if (!user) return;

//       const token = localStorage.getItem("token");

//       const res = await axios.get(
//         `http://10.94.229.198:3006/api/v1/chat/${user.id}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setConversations(res.data);
//     } catch (err) {
//       console.log(err);
//     }
//   };


//   const getOnlineUsers = async () => {
//     try {
//       if (!user) return;

//       const token = localStorage.getItem("token");

//       const res = await axios.get(
//         `http://10.94.229.198:3006/api/v1/user/${user.id}/online-users`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );


//       // console.log("res ==============> ", res);

//       if (res.data.success) {
//         setOnlineUsers(res.data.onlineUsers)
//       }

//       // setConversations(res.data);
//     } catch (err) {
//       console.log(err);
//     }
//   };


//   useEffect(() => {
//     if (user) {
//       getConversations();

//       socket.emit("user_online", user.id);
//       getOnlineUsers();
//     }
//   }, [user]);

//   const loadMessages = async (chat) => {
//     try {
//       setSelectedChat(chat);

//       const token = localStorage.getItem("token");

//       const res = await axios.get(
//         `http://10.94.229.198:3006/api/v1/message/${chat.id}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setMessages(res.data);

//       socket.emit("join_room", chat.id.toString());

//       setSelectedChat(chat);
// setShowChat(true);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const sendMessage = async (e) => {
//     e.preventDefault();

//     if (!message.trim() || !selectedChat) return;

//     try {
//       const token = localStorage.getItem("token");

//       const res = await axios.post(
//         "http://10.94.229.198:3006/api/v1/message",
//         {
//           conversationId: selectedChat.id,
//           senderId: user.id,
//           text: message,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       socket.emit("send_message", res.data);

//       setMessages((prev) => [...prev, res.data]);

//       setMessage("");

//       setSelectedChat(chat);
// setShowChat(true);
//     } catch (err) {
//       console.log(err);
//     }
//   };



//   const startChat = async (onlineUser) => {
//     try {
//       const token = localStorage.getItem("token");

//       // Create or get conversation
//       const chatRes = await axios.post(
//         "http://10.94.229.198:3006/api/v1/chat",
//         {
//           user1: user.id,
//           user2: onlineUser.id,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const chat = chatRes.data;

//       console.log("chat ==============> ", chat);

//       setSelectedChat(chat);

//       // Join socket room
//       socket.emit("join_room", chat.id.toString());

//       // Load previous messages
//       const msgRes = await axios.get(
//         `http://10.94.229.198:3006/api/v1/message/${chat.id}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setMessages(msgRes.data);

//       // Refresh conversation list
//       getConversations();

//     } catch (err) {
//       console.log(err);
//     }
//   };


//   console.log("selectedChat ==============> ", selectedChat);



//   return (
//     <div className="home">
//       {/* Sidebar */}

//       {!showChat && (
//       <div className="sidebar">
//         <div className="sidebar-header">
//           <div className="profile">
//             <div className="avatar">
//               {user?.name?.charAt(0).toUpperCase()}
//             </div>
//             <span>{user?.name}</span>
//           </div>
//         </div>

//         <div className="search-box">
//           <FaSearch />
//           <input placeholder="Search..." />
//         </div>

//         <div className="online-users">
//           <h4>Online Users</h4>

//           {onlineUsers.length === 0 ? (
//             <p>No users online</p>
//           ) : (
//             onlineUsers.map((onlineUser) => (
//               <div
//                 key={onlineUser.id}
//                 className="chat-item"
//                 onClick={() => startChat(onlineUser)}
//               >
//                 <div
//                   className="avatar"
//                   style={{ position: "relative" }}
//                 >
//                   {onlineUser.name.charAt(0).toUpperCase()}

//                   <span
//                     style={{
//                       position: "absolute",
//                       bottom: 2,
//                       right: 2,
//                       width: 10,
//                       height: 10,
//                       background: "green",
//                       borderRadius: "50%",
//                       border: "2px solid white",
//                     }}
//                   />
//                 </div>

//                 <div className="chat-info">
//                   <h4>{onlineUser.name}</h4>
//                   <small style={{ color: "green" }}>Online</small>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>

//         <div className="chat-list">
//           {conversations.map((chat) => {
//             const otherUser = chat.participants.find(
//               (p) => p.user.id !== user.id
//             )?.user;

//             const lastMessage = chat.messages[0];

//             return (
//               <div
//                 key={chat.id}
//                 className="chat-item"
//                 onClick={() => loadMessages(chat)}
//               >
//                 <div className="avatar">
//                   {otherUser?.name?.charAt(0).toUpperCase()}
//                 </div>

//                 <div className="chat-info">
//                   <h4>{otherUser?.name}</h4>

//                   <p>
//                     {lastMessage
//                       ? lastMessage.text
//                       : "Start Conversation"}
//                   </p>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//       )}

//       {/* Chat Section */}

//       {showChat && (
//       <div className="chat-section">
//         {selectedChat ? (
//           <>
//             <div className="chat-header">
//               <div className="header-user">
//                 <div className="avatar">
//                   {/* {selectedChat.participants
//                     .find((p) => p.userId !== user.id)
//                     ?.user.name.charAt(0)} */}
//                 </div>

//                 {/* <div>
//                   <h3>
//                     {
//                       selectedChat.participants.find(
//                         (p) => p.userId !== user.id
//                       )?.user.name
//                     }
//                   </h3>

//                   <small>Online</small>
//                 </div> */}


//               </div>

//               <FaEllipsisV />
//             </div>

//             <div className="chat-body">
//               {messages.map((msg) => (
//                 <div
//                   key={msg.id}
//                   className={
//                     msg.senderId === user.id
//                       ? "message sent"
//                       : "message received"
//                   }
//                 >
//                   {msg.text}
//                 </div>
//               ))}
//             </div>

//             <form className="chat-input" onSubmit={sendMessage}>
//               <input
//                 placeholder="Type a message..."
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//               />

//               <button type="submit">
//                 <FaPaperPlane />
//               </button>
//             </form>
//           </>
//         ) : (
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               height: "100%",
//               fontSize: "22px",
//               color: "#666",
//             }}
//           >
//             Select a conversation
//           </div>
//         )}
//       </div>
//       )}
//     </div>
//   );
// };

// export default Home;



import React, { useEffect, useState } from "react";
import "./styles/Home.css";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import socket from "../socket";

const Home = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (!user) return;

    socket.connect();
    socket.emit("user_online", user.id);

    getOnlineUsers();

    return () => {
      socket.disconnect();
    };
  }, [user]);



  const getOnlineUsers = async () => {
    try {
      if (!user) return;

      const token = localStorage.getItem("token");

      const res = await axios.get(
        `http://10.94.229.198:3006/api/v1/user/${user.id}/online-users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setOnlineUsers(res.data.onlineUsers);
      }
    } catch (err) {
      console.log(err);
    }
  };


  const startChat = async (onlineUser) => {
    try {
      const token = localStorage.getItem("token");

      const chatRes = await axios.post(
        "http://10.94.229.198:3006/api/v1/chat",
        {
          user1: user.id,
          user2: onlineUser.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const chat = chatRes.data;

      console.log("chat ==============> ", chat);

      navigate(`/chat/${chat.id}`, {
        state: {
          chat,
          onlineUser,
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="home">
      <div className="sidebar">
        {/* Header */}
        <div className="sidebar-header">
          <div className="profile">
            <div className="avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>

            <span>{user?.name}</span>
          </div>
        </div>

        {/* Search */}
        <div className="search-box">
          <FaSearch />
          <input type="text" placeholder="Search users..." />
        </div>

        {/* Online Users */}
        <div className="online-users">
          <h4>Online Users</h4>

          {onlineUsers.length === 0 ? (
            <p style={{ padding: "10px" }}>No users online</p>
          ) : (
            onlineUsers.map((onlineUser) => (
              <div
                key={onlineUser.id}
                className="chat-item"
                onClick={() => startChat(onlineUser)}
              >
                <div
                  className="avatar"
                  style={{ position: "relative" }}
                >
                  {onlineUser.name.charAt(0).toUpperCase()}

                  <span
                    style={{
                      position: "absolute",
                      bottom: 2,
                      right: 2,
                      width: 10,
                      height: 10,
                      background: "#28a745",
                      borderRadius: "50%",
                      border: "2px solid white",
                    }}
                  />
                </div>

                <div className="chat-info">
                  <h4>{onlineUser.name}</h4>
                  <small style={{ color: "#28a745" }}>
                    Online
                  </small>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
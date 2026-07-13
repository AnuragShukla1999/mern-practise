// import React, { useEffect, useState } from 'react'

// import { io } from 'socket.io-client';

// const socket = io("http://localhost:3006");

// const App = () => {

//   const [message, setMessage] = useState("");
//   const [messageList, setMessageList] = useState([]);

//   const sendMessage = () => {
//     console.log("message ", message)
//     socket.emit("send_messgae", message)
//   }

//   // useEffect(() => {
//   //   socket.on("receive_message", (data) => {
//   //     setMessageList((list) => [...list, data])
//   //   })

//   //   return socket.off("receive_message");
//   // }, []);

//   useEffect(() => {
//     const handler = (data) => {
//       setMessageList((list) => [...list, data]);
//     };

//     socket.on("receive_message", handler);

//     return () => {
//       socket.off("receive_message", handler);
//     };
//   }, []);

//   return (
//     <div>
//       <input
//         type="text"
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//       />
//       <button onClick={sendMessage}>Send Message</button>

//       <h2>Message: </h2>

//       {messageList.map((msg, index) => (
//         <p key={index}>{msg}</p>
//       ))}
//     </div>
//   )
// }

// export default App





import { BrowserRouter, Routes, Route } from "react-router-dom";

import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Signin from "./pages/Signin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/chat" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
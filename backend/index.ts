import express, { Express, json } from "express";
import http from "http";
import cors from "cors";
import { Server, Socket } from "socket.io";

import routes from "./routes/route"
import { initializeSocket } from "./socket";

const app: Express = express();

app.use(cors());

app.use(json());
app.use("/api/v1", routes);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    // origin: "http://localhost:5174",
    origin: "http://localhost:5173",
    // origin: "http://192.168.29.93:5173",
    methods: ["GET", "POST"],
  },
});

// interface MessageData {
//   message: string;
//   sender?: string;
//   room?: string;
// }

// io.on("connection", (socket: Socket) => {
//   console.log("User connected:", socket.id);

//   socket.on("send_message", (data: MessageData) => {
//     console.log("Message from frontend:", data);

//     io.emit("receive_message", data);
//   });

//   socket.on("disconnect", () => {
//     console.log("User disconnected:", socket.id);
//   });
// });

initializeSocket(io);


const PORT = 3006;

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
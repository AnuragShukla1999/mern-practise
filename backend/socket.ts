import { Server, Socket } from "socket.io";

interface MessageData {
  message: string;
  sender?: string;
  room?: string;
}

export const onlineUsers = new Map<number, string>();

export const initializeSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log("User connected:", socket.id);


    // User comes online
    socket.on("user_online", (userId: number) => {
      onlineUsers.set(userId, socket.id);

      io.emit("online_users", [...onlineUsers.keys()]);
    });


    socket.on("join_room", (room: string) => {
      socket.join(room);
      console.log(`${socket.id} joined ${room}`);
    });

    socket.on("send_message", (data: MessageData) => {
      console.log("Message:", data);

      if (data.room) {
        io.to(data.room).emit("receive_message", data);
      } else {
        socket.broadcast.emit("receive_message", data);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);

      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }

      io.emit("online_users", [...onlineUsers.keys()]);

    });
  });
};


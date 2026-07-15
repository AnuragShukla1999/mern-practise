import { io } from "socket.io-client";

const socket = io("http://10.94.229.198:3006");

export default socket;
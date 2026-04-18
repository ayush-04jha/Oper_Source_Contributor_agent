import { Server } from "socket.io";
import { chatHandler } from "./sockets/chatSocket.js";
let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on("connect", (socket) => {
    console.log("Connected:", socket.id);
    chatHandler(socket);
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket not initialized!");
  }
  return io;
};
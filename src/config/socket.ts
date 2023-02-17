import { Server as HttpServer } from "http";
import { Server } from "socket.io";

export const initSocketIO = (server: HttpServer) => {
  const io = new Server(server);

  io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });

  return io;
};

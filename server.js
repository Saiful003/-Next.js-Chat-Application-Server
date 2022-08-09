const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");
require("dotenv").config();
const port = process.env.PORT ?? 8000;

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  /* options */
  cors: {
    origin: "https://next-js-chat-application-client.vercel.app",
    methods: ["GET", "POST"],
  },
});

// for handiling some event that are rising anywhere we are use io.on method

io.on("connection", (socket) => {
  socket.on("connectingUser", (data) => {
    socket.join(data.room);
    // sent a welcoming message to this user
    socket.emit("welcomingMessage", { wlcMsg: `${data.user} is joined` });
  });

  socket.on("sendingMessage", (data) => {
    socket.broadcast.emit("receivingMessage", data);
  });
});

httpServer.listen(port, () => console.log(`Server is running on ${port} port`));

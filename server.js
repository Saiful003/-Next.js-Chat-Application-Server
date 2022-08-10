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
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("connectingUser", (data) => {
    socket.join(data.room);
    // sent a welcoming message to this user
    socket.broadcast.emit("welcomingMessage", {
      wlcMsg: `${data.user} is joined`,
    });
  });

  socket.on("sendingMessage", (data) => {
    socket.broadcast.emit("receivingMessage", data);
  });
});

httpServer.listen(port, () => console.log(`Server is running on ${port} port`));

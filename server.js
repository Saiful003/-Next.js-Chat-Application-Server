const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");
require("dotenv").config();
const port = process.env.PORT ?? 8000;

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: ["https://chat-client-roan-five.vercel.app"],
  },
});

app.get("/", (req, res) => {
  res.send("Hey this is my API running 🥳");
});

io.on("connection", (socket) => {
  socket.on("connectingUser", (data) => {
    socket.join(data.room);
    socket.on("sendingMessage", (msg) => {
      socket.to(data.room).emit("receivingMessage", msg);
    });
    socket.on("typingEvent", (typeData) => {
      socket.to(data.room).emit("raisingisTypingEvent", typeData);
    });
  });
});

httpServer.listen(port, () => console.log(`Server is running on ${port} port`));

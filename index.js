
require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const app = express();
app.use(express.json());

const cors = require("cors")
const server = require('http').createServer(app);


// const app = require('./app')
const {PORT} = process.env


app.use(cors({
    origin: "*"
  }))
  
  const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
  });
  
  io.on("connection", (socket) => {
    // console.log("What is socket: ", socket)
    console.log("Socket is active to be connected");
  
    socket.on('chat', (payload) => {
        // console.log("What is payload", payload)
        io.emit("chat", payload);
    })
  
  });

server.listen(PORT, ()=>console.log("Server is running at", PORT))
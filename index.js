const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const mysql = require('mysql2');
app.use(cors());

const server = http.createServer(app);
require('dotenv').config();
main = async () => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:6969",
      methods: ["GET", "POST"],
    },
  });
  const config = {
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
  };
  const db = await mysql.createConnection(config);
  io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("join_room", (data) => {
      socket.join(data);
      console.log(`User with ID: ${socket.id} joined room: ${data}`);
    });

    socket.on("send_message", (data) => {
      db.query(`INSERT INTO messages (message, status, author, type, room_id, time) VALUES ('${data.message}','', '${data.author}', '', ${data.roomId},'${data.time}');
     `, (err, data) => {
        if (err) {
          console.log(err)
        }
      })

      db.query(`UPDATE rooms
      SET last_message = '${data.message}', last_sender = ${data.author}
      WHERE id = ${data.roomId};
      `, (err, data) => {
         if (err) {
           console.log(err)
         }
       })
      socket.to(data.roomId).emit("receive_message", data);
    });

    socket.on("disconnect", () => {
      console.log("User Disconnected", socket.id);
    });
  });

  server.listen(6969, () => {
    console.log("SERVER RUNNING");
  });
}
main()
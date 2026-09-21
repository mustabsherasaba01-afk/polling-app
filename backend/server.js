const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const pollRoutes = require("./routes/pollRoutes");

const app = express();

/*
=========================================
CORS
=========================================
*/

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

/*
=========================================
BODY PARSERS
=========================================
*/

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/*
=========================================
REQUEST LOGGER
=========================================
*/

app.use((req, res, next) => {
  console.log("================================");
  console.log("METHOD:", req.method);
  console.log("URL:", req.url);
  console.log(
    "CONTENT-TYPE:",
    req.headers["content-type"]
  );
  console.log("BODY:", req.body);
  console.log("================================");

  next();
});

/*
=========================================
HOME ROUTE
=========================================
*/

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Polling App Backend is working!",
  });
});

/*
=========================================
API ROUTES
=========================================
*/

app.use("/api/auth", authRoutes);
app.use("/api/polls", pollRoutes);

/*
=========================================
HTTP SERVER
=========================================
*/

const server = http.createServer(app);

/*
=========================================
SOCKET.IO
=========================================
*/

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

/*
Make Socket.IO available
inside controllers
*/

app.set("io", io);

/*
=========================================
SOCKET CONNECTION
=========================================
*/

io.on("connection", (socket) => {
  console.log(
    "Socket connected:",
    socket.id
  );

  socket.on("disconnect", () => {
    console.log(
      "Socket disconnected:",
      socket.id
    );
  });
});

/*
=========================================
MONGODB
=========================================
*/

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log(
      "MongoDB connected successfully!"
    );

    const PORT =
      process.env.PORT || 5000;

    server.listen(PORT, () => {
      console.log(
        `Backend running at http://localhost:${PORT}`
      );

      console.log(
        `Socket.IO running on port ${PORT}`
      );
    });
  })
  .catch((error) => {
    console.error(
      "MongoDB connection failed:"
    );

    console.error(error.message);
  });
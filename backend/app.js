const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const pollRoutes = require("./routes/pollRoutes");
const opinionRoutes = require("./routes/opinionRoutes");

const app = express();


// ================================
// MIDDLEWARE
// ================================

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());


// ================================
// HOME
// ================================

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Polling App Backend is running",
  });
});


// ================================
// ROUTES
// ================================

app.use("/api/users", authRoutes);

app.use("/api/polls", pollRoutes);

app.use("/api/opinions", opinionRoutes);


module.exports = app;
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const pollRoutes = require("./routes/pollRoutes");

const app = express();

// ===============================
// CORS
// ===============================
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

// ===============================
// BODY PARSER
// ===============================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===============================
// DEBUG MIDDLEWARE
// ===============================
app.use((req, res, next) => {
  console.log("================================");
  console.log("METHOD:", req.method);
  console.log("URL:", req.url);
  console.log("CONTENT-TYPE:", req.headers["content-type"]);
  console.log("BODY:", req.body);
  console.log("================================");

  next();
});

// ===============================
// TEST BACKEND
// ===============================
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Polling App Backend is working!",
  });
});

// ===============================
// ROUTES
// ===============================
app.use("/api/auth", authRoutes);
app.use("/api/polls", pollRoutes);

// ===============================
// DATABASE
// ===============================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully!");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(
        `Backend running at http://localhost:${PORT}`
      );
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:");
    console.error(error.message);
  });
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// =================================
// REGISTER
// =================================

const registerUser = async (req, res) => {
  try {
    console.log("REGISTER CONTROLLER STARTED");
    console.log("BODY RECEIVED:", req.body);

    // Check body
    if (!req.body) {
      return res.status(400).json({
        success: false,
        message: "No request body received.",
      });
    }

    const { name, email, password } = req.body;

    // Check fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields.",
      });
    }

    // Password validation
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 6 characters.",
      });
    }

    // Clean email
    const cleanEmail = email.trim().toLowerCase();

    // Check existing user
    const existingUser = await User.findOne({
      email: cleanEmail,
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "A user with this email already exists.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
    });

    console.log("USER CREATED:", user.email);

    return res.status(201).json({
      success: true,
      message: "Account created successfully!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// =================================
// LOGIN
// =================================

const loginUser = async (req, res) => {
  try {
    console.log("LOGIN REQUEST");
    console.log("LOGIN BODY:", req.body);

    if (!req.body) {
      return res.status(400).json({
        success: false,
        message: "No request body received.",
      });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter email and password.",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: cleanEmail,
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
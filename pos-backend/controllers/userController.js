const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/config");

// ==================== REGISTER ====================
const register = async (req, res) => {
  try {
    console.log("Register function called");
    console.log("Request body:", req.body);
    
    const { name, phone, email, password, role } = req.body;

    if (!name || !phone || !email || !password || !role) {
      return res.status(400).json({ 
        success: false, 
        message: "All fields are required!",
        received: { name: !!name, phone: !!phone, email: !!email, password: !!password, role: !!role }
      });
    }

    const isUserPresent = await User.findOne({ email });
    if (isUserPresent) {
      return res.status(400).json({ success: false, message: "User already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, phone, email, password: hashedPassword, role });
    await newUser.save();

    console.log("User created successfully:", newUser._id);

    return res.status(201).json({ 
      success: true, 
      message: "New user created!", 
      data: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== LOGIN ====================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required!" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid Credentials" });
    }

    const accessToken = jwt.sign({ _id: user._id }, config.accessTokenSecret, { expiresIn: "1d" });

    res.setHeader("Set-Cookie", `accessToken=${accessToken}; HttpOnly; Path=/; Max-Age=${60*60*24*30}; SameSite=None; Secure`);

    return res.status(200).json({ success: true, message: "User login successfully!", data: user });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== GET USER DATA ====================
const getUserData = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error("GetUserData error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== LOGOUT ====================
const logout = async (req, res) => {
  try {
    res.setHeader("Set-Cookie", `accessToken=; HttpOnly; Path=/; Max-Age=0; SameSite=None; Secure`);
    return res.status(200).json({ success: true, message: "User logout successfully!" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  register,
  login,
  getUserData,
  logout
};
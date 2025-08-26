const jwt = require("jsonwebtoken");
const config = require("../config/config");
const User = require("../models/userModel");

const authMiddleware = async (req, res) => {
  try {
    // Get token from cookies or Authorization header
    let token = req.cookies?.accessToken;
    
    if (!token && req.headers.authorization) {
      token = req.headers.authorization.split(' ')[1]; // Bearer token
    }

    if (!token) {
      return res.status(401).json({ success: false, message: "Access token not found" });
    }

    // Verify token
    const decoded = jwt.verify(token, config.accessTokenSecret);
    
    // Get user from database
    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid token - user not found" });
    }

    // Set user in request object
    req.user = user;
    return user;
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

module.exports = { authMiddleware };
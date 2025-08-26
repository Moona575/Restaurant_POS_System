import jwt from "jsonwebtoken";
import User from "../models/userModel";
import config from "../config/config";

export const authMiddleware = async (req, res) => {
  try {
    const token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ success: false, message: "Unauthorized" });

    const decoded = jwt.verify(token, config.accessTokenSecret);
    req.user = await User.findById(decoded._id);
    return req.user;
  } catch (err) {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};

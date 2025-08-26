const connectDB = require("../../config/database");
const { register, getUserData } = require("../../controllers/userController");

connectDB();

module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://restaurant-pos-system-nine.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    if (req.method === "POST") {
      await register(req, res);
    } else if (req.method === "GET") {
      await getUserData(req, res);
    } else {
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
    }
  } catch (err) {
    console.error("Error in handler:", err);
    res.status(err.status || 500).json({ 
      success: false, 
      message: err.message || "Request failed" 
    });
  }
};

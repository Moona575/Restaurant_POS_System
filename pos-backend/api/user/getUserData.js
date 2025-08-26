const connectDB = require("../../config/database");
const { getUserData } = require("../../controllers/userController");
const { authMiddleware } = require("../../middlewares/authMiddleware");

// Connect to database
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

  if (req.method === "GET") {
    try {
      const user = await authMiddleware(req, res);
      if (!user) return; // unauthorized already handled
      await getUserData(req, res);
    } catch (err) {
      console.error("Error in getUserData:", err);
      res.status(err.status || 500).json({ 
        success: false, 
        message: err.message || "Internal server error" 
      });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
};
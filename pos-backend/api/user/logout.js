const connectDB = require("../../config/database");
const { logout } = require("../../controllers/userController");
const { isVerifiedUser } = require("../../middlewares/tokenVerification");

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

  if (req.method === "POST") {
    try {
      await isVerifiedUser(req, res, async () => {
        await logout(req, res);
      });
    } catch (err) {
      console.error("Error in logout:", err);
      res.status(err.status || 500).json({ 
        success: false, 
        message: err.message || "Logout failed" 
      });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
};
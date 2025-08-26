const connectDB = require("../../config/database");
const { register } = require("../../controllers/userController");

connectDB();

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://restaurant-pos-system-nine.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS'); // only POST and OPTIONS
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method === "POST") {
    try {
      await register(req, res);
    } catch (err) {
      console.error("Error in register:", err);
      return res.status(err.status || 500).json({
        success: false,
        message: err.message || "Registration failed"
      });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
};

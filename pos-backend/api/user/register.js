const connectDB = require("../../config/database");
const { register } = require("../../controllers/userController");

module.exports = async function handler(req, res) {
  // Always set CORS headers first
  const allowedOrigin = 'https://restaurant-pos-system-nine.vercel.app';
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Preflight check
  if (req.method === 'OPTIONS') {
    return res.status(204).end(); // No Content
  }

  try {
    await connectDB();

    if (req.method === 'POST') {
      await register(req, res);
    } else if (req.method === 'GET') {
      return res.status(200).json({ message: 'GET request received' });
    } else {
      res.setHeader('Allow', ['POST', 'GET']);
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
    }

  } catch (err) {
    console.error("Serverless function error:", err);
    return res.status(err.status || 500).json({
      success: false,
      message: err.message || "Internal Server Error",
      stack: err.stack
    });
  }
};

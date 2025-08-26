const connectDB = require("../../config/database");
const { register } = require("../../controllers/userController");

module.exports = async function handler(req, res) {
  // Always set CORS headers first
  res.setHeader('Access-Control-Allow-Origin', '*'); // Or specific origin
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight OPTIONS request and exit early
  if (req.method === 'OPTIONS') {
    return res.status(204).end(); // No need to connect to DB or call register
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed. Use POST.' 
    });
  }

  try {
    // Connect to database only for POST
    await connectDB();

    // Call register function
    await register(req, res);

  } catch (error) {
    console.error("Handler error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};

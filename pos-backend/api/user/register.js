const connectDB = require("../../config/database");
const { register } = require("../../controllers/userController");

module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://restaurant-pos-system-nine.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    // Connect DB only for real requests
    await connectDB();

    if (req.method === "POST") {
      await register(req, res);
    } else if (req.method === "GET") {
      return res.status(200).json({ message: "GET request received" });
    } else {
      res.setHeader("Allow", ["POST", "GET"]);
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
    }

  } catch (err) {
    console.error("======== SERVERLESS ERROR ========");
    console.error("Error message:", err.message);
    console.error("Error stack:", err.stack);
    if (err.response) {
      console.error("Response data:", err.response.data);
      console.error("Response status:", err.response.status);
      console.error("Response headers:", err.response.headers);
    }
    console.error("==================================");
    
    return res.status(err.status || 500).json({
      success: false,
      message: err.message || "Internal Server Error",
      stack: err.stack // optional: returns stack to frontend for debugging
    });
  }
};

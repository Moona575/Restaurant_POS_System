import connectDB from "../../config/database";
import { logout } from "../../controllers/userController";
import { isVerifiedUser } from "../middlewares/tokenVerification";

connectDB();

export default async function handler(req, res) {
  // ===== CORS headers =====
  res.setHeader('Access-Control-Allow-Origin', 'https://restaurant-pos-system-nine.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true'); // if you use cookies

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Handle POST request
  if (req.method === "POST") {
    // Run token verification manually
    await isVerifiedUser(req, res, async () => {
      await logout(req, res);
    });
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}

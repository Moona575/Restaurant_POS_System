import connectDB from "../../config/database";
import { getUserData } from "../../controllers/userController";
import { isVerifiedUser } from "../middlewares/tokenVerification";

connectDB();

export default async function handler(req, res) {
  // ===== CORS headers =====
  res.setHeader('Access-Control-Allow-Origin', 'https://restaurant-pos-system-nine.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true'); // if using cookies

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Handle GET request
  if (req.method === "GET") {
    await isVerifiedUser(req, res, async () => {
      await getUserData(req, res);
    });
  } else {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}

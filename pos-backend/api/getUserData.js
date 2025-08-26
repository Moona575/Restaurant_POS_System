import connectDB from "../../config/database";
import { getUserData } from "../../controllers/userController";
import { isVerifiedUser } from "../middlewares/tokenVerification";

connectDB();

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://restaurant-pos-system-nine.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method === "GET") {
    await isVerifiedUser(req, res, async () => {
      try {
        await getUserData(req, res);
      } catch (err) {
        res.status(err.status || 500).json({ success: false, message: err.message });
      }
    });
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}

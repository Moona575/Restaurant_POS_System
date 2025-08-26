import connectDB from "../../config/database";
import { getUserData } from "../../controllers/userController";
import { authMiddleware } from "../../middlewares/authMiddleware";

connectDB();

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://restaurant-pos-system-nine.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method === "GET") {
    const user = await authMiddleware(req, res);
    if (!user) return; // authMiddleware already sent response if unauthorized
    await getUserData(req, res);
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}

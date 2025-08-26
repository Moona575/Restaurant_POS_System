import connectDB from "../../config/database";
import { logout } from "../../controllers/userController";
import { isVerifiedUser } from "../../middlewares/tokenVerification";

connectDB();

export default async function handler(req, res) {
res.setHeader('Access-Control-Allow-Origin', 'https://restaurant-pos-system-nine.vercel.app');
res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
res.setHeader('Access-Control-Allow-Credentials', 'true');

if (req.method === "OPTIONS") return res.status(200).end();


  if (req.method === "POST") {
    try {
      await isVerifiedUser(req, res, async () => {
        await logout(req, res);
      });
    } catch (err) {
      res.status(err.status || 500).json({ success: false, message: err.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}

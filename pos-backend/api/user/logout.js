import connectDB from "../../config/database";
import { logout } from "../../controllers/userController";
import { isVerifiedUser } from "../../middlewares/tokenVerification";

connectDB();

export default async function handler(req, res) {
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

import connectDB from "../../config/database";
import { getUserData } from "../../controllers/userController";
import { isVerifiedUser } from "../middlewares/tokenVerification";

connectDB();

export default async function handler(req, res) {
  if (req.method === "GET") {
    await isVerifiedUser(req, res, async () => {
      await getUserData(req, res);
    });
  } else {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}

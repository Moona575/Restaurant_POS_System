import connectDB from "../../config/database";
import { login } from "../../controllers/userController";

connectDB();

export default async function handler(req, res) {
  if (req.method === "POST") {
    return login(req, res);
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}

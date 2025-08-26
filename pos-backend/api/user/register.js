import connectDB from "../../config/database";
import { register } from "../../controllers/userController";

// Initialize DB
connectDB();

export default async function handler(req, res) {
  if (req.method === "POST") {
    return register(req, res);
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}

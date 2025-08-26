const express = require("express");
const connectDB = require("./config/database");
const config = require("./config/config");
const globalErrorHandler = require("./middlewares/globalErrorHandler");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const categoryRoutes = require("./routes/categoryRoutes");
const dishRoutes = require("./routes/dishRoutes");

const app = express();
const PORT = process.env.PORT || config.port;

// CORS setup
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://restaurant-pos-system-nine.vercel.app"
  ],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // preflight

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Root and favicon
app.get("/", (req, res) => res.status(200).json({ message: "Hello from POS Server!" }));
app.get("/favicon.ico", (req, res) => res.sendStatus(204));

// API Routes
app.use("/api/user", require("./routes/userRoute"));
app.use("/api/order", require("./routes/orderRoute"));
app.use("/api/table", require("./routes/tableRoute"));
app.use("/api/payment", require("./routes/paymentRoute"));
app.use("/api/categories", categoryRoutes);
app.use("/api/dishes", dishRoutes);

// Global Error Handler
app.use(globalErrorHandler);

// Start server only after DB is connected
const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ Database connected!");
    app.listen(PORT, () => console.log(`☑️ POS Server listening on port ${PORT}`));
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
};

startServer();

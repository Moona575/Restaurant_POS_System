const express = require("express");
const serverless = require("serverless-http");
const connectDB = require("../config/database");
const config = require("../config/config");
const globalErrorHandler = require("./middlewares/globalErrorHandler");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const categoryRoutes = require("../routes/categoryRoutes");
const dishRoutes = require("../routes/dishRoutes");

const userRoutes = require("../routes/userRoute");
const orderRoutes = require("../routes/orderRoute");
const tableRoutes = require("../routes/tableRoute");
const paymentRoutes = require("../routes/paymentRoute");

const app = express();

// Connect DB
connectDB();

// Middlewares
app.use(cors({
    origin: [
        "https://restaurant-pos-system-nine.vercel.app", // deployed frontend
    ],
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Root endpoint
app.get("/", (req, res) => {
    res.json({ message: "Hello from POS Server!" });
});

// API Routes
app.use("/api/user", userRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/table", tableRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/dishes", dishRoutes);

// Global Error Handler
app.use(globalErrorHandler);

// Export serverless handler
module.exports = app;
module.exports.handler = serverless(app);

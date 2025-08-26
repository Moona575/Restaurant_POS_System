const express = require("express");
const connectDB = require("./config/database");
const config = require("./config/config");
const globalErrorHandler = require("./middlewares/globalErrorHandler");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const categoryRoutes = require("./routes/categoryRoutes");
const dishRoutes = require("./routes/dishRoutes");

const app = express();

// Use Railway dynamic port
const PORT = process.env.PORT || config.port;

// Connect DB safely
connectDB()
  .then(() => console.log("DB Connected!"))
  .catch(err => console.error("DB Connection Error:", err));

// CORS setup
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://restaurant-pos-system-nine.vercel.app'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // handle preflight

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Root & favicon
app.get("/", (req,res) => res.json({message : "Hello from POS Server!"}));
app.get("/favicon.ico", (req,res) => res.sendStatus(204));

// Routes
app.use("/api/user", require("./routes/userRoute"));
app.use("/api/order", require("./routes/orderRoute"));
app.use("/api/table", require("./routes/tableRoute"));
app.use("/api/payment", require("./routes/paymentRoute"));
app.use("/api/categories", categoryRoutes);
app.use("/api/dishes", dishRoutes);

// Global Error Handler
app.use(globalErrorHandler);

// Start server
app.listen(PORT, () => {
    console.log(`☑️ POS Server is listening on port ${PORT}`);
});

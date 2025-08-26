const express = require("express");
const connectDB = require("./config/database");
const config = require("./config/config");
const globalErrorHandler = require("./middlewares/globalErrorHandler");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const categoryRoutes = require("./routes/categoryRoutes");
const dishRoutes = require("./routes/dishRoutes");

const app = express();


const PORT = config.port;
connectDB();

// Middlewares
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://restaurant-pos-system-nine.vercel.app'
  ],
  credentials: true,   // allows cookies/auth headers
  optionsSuccessStatus: 200 // handle legacy browsers
};

app.use(cors(corsOptions));

// Handle preflight requests (important for axios with credentials)
app.options('*', cors(corsOptions));


app.use(express.json()); // parse incoming request in json format
app.use(cookieParser())


// Root Endpoint
app.get("/", (req,res) => {
    res.json({message : "Hello from POS Server!"});
})

// Other Endpoints
app.use("/api/user", require("./routes/userRoute"));
app.use("/api/order", require("./routes/orderRoute"));
app.use("/api/table", require("./routes/tableRoute"));
app.use("/api/payment", require("./routes/paymentRoute"));


app.use("/api/categories", categoryRoutes);
app.use("/api/dishes", dishRoutes);
// Global Error Handler
app.use(globalErrorHandler);


// Server
app.listen(PORT, () => {
    console.log(`☑️  POS Server is listening on port ${PORT}`);
})
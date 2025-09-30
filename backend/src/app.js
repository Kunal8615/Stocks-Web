import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import verifyJWT from "./middleware/auth.middleware.js";

// Routes
import userRoute from "./routes/user.route.js";
import dashRoute from "./routes/dashboard.route.js";
import stockRoute from "./routes/stock.route.js";

const app = express();

// Middlewares
const allowedOrigins = [
  "https://stocks-web-three.vercel.app",
  "http://localhost:5173",
  "http://localhost:8000"
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) callback(null, true);
    else callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // preflight

app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ extended: true, limit: "30mb" }));
app.use(cookieParser());
app.use(express.static("public"));

// Routes
app.get("/", (req, res) => res.send("Welcome to the Stocks APP!"));
app.use("/api/v4/user", userRoute);
app.use("/api/v4/dashboard", dashRoute);
app.use("/api/v4/stocks", verifyJWT, stockRoute);

export default app;

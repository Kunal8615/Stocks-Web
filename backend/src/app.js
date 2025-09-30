import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./db.js"; // DB connect helper
import verifyJWT from "./middleware/auth.middleware.js";

// Routes
import userRoute from "./routes/user.route.js";
import dashRoute from "./routes/dashboard.route.js";
import stockRoute from "./routes/stock.route.js";

const app = express();

// Middlewares
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    const allowedOrigins = [
      "http://localhost:5173",
      "http://localhost:8000",
      "https://stocks-web-three.vercel.app"
    ];
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie", "X-Requested-With"],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ extended: true, limit: "30mb" }));
app.use(cookieParser());
app.use(express.static("public"));

// DB connect
await connectDB();

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the Stocks APP ! Use the available routes to interact with the platform.");
});

app.use("/api/v4/user", userRoute);
app.use("/api/v4/dashboard", dashRoute);
app.use("/api/v4/stocks", verifyJWT, stockRoute);

export default app;

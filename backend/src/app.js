import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import verifyJWT from "./middleware/auth.middleware.js";

const app = express();

// ✅ CORS configuration
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true); 

        const allowedOrigins = [
            "http://localhost:5173",
            "http://localhost:8000",
            "https://stocks-web-three.vercel.app"
        ];

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log("CORS blocked origin:", origin);
            callback(new Error("Not allowed by CORS"));
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
app.use(express.static("public"));
app.use(cookieParser());

// ✅ Root route
app.get("/", (req, res) => {
    res.send("Welcome to the Stocks APP ! Use the available routes to interact with the platform.");
});

// ✅ Routes
import userRoute from "./routes/user.route.js";
import dashRoute from "./routes/dashboard.route.js";
import stockRoute from "./routes/stock.route.js";

app.use("/api/v4/user", userRoute);
app.use("/api/v4/dashboard", dashRoute);
app.use("/api/v4/stocks", verifyJWT, stockRoute);

// ✅ Important: default export (Vercel requirement)
export default app;

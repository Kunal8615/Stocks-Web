import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import verifyJWT from "./middleware/auth.middleware.js"
const app = express()


// CORS configuration
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
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
    optionsSuccessStatus: 200 // For legacy browser support
};

app.use(cors(corsOptions));


app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ extended: true, limit: "30mb" }));
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());




// Root route to display a message
app.get("/", (req, res) => {
    res.send("Welcome to the Stocks APP ! Use the available routes to interact with the platform.");
});
//user route
import userRoute from "../src/routes/user.route.js"
app.use("/api/v4/user",userRoute);


//dashboard route
import dashRoute from "../src/routes/dashboard.route.js"
app.use("/api/v4/dashboard",dashRoute);

//stocks route
import stockRoute from "./routes/stock.route.js";
app.use("/api/v4/stocks",verifyJWT,stockRoute);

  export { app };
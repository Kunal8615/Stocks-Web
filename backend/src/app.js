import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import verifyJWT from "./middleware/auth.middleware.js"
const app = express()


app.use(cors({
    origin: ["http://localhost:5173",
        //backend link
       "https://stocks-web-three.vercel.app/"

    ],
    credentials: true
}));


app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ extended: true, limit: "30mb" }));
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());




// Root route to display a message
app.get("/", (req, res) => {
    res.send("Welcome to the DataCloud API! Use the available routes to interact with the platform.");
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
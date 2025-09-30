//16vdgtsZnR2JV263 db
import connectDB from "./database/index.js";
import app from "../src/app.js"
const startServer = async () => {
    try {
        await connectDB();
        const port = process.env.PORT || 4000;
        
       
        const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';
        
        app.listen(port, host, () => {
            console.log(`Server running at http://${host}:${port}`);
            console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
        });
    } catch (error) {
        console.error(`Error starting server: ${error.message}`);
        process.exit(1);
    }
};

startServer();


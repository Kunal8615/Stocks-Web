import mongoose from 'mongoose';
import dotenv from 'dotenv';  

import { DB_NAME } from '../contant.js';

dotenv.config();  

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(
            `${process.env.MONGO_URI}/${DB_NAME}`
        );
        console.log(`\n Stocks MONGOOSE-DATABASE Connected || db host:
             ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log('Error in MongoDB connection', error);
        // Don't exit in production, let the app handle it
        if (process.env.NODE_ENV !== 'production') {
            process.exit(1);
        }
    }
};

export default connectDB;

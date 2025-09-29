import mongoose from 'mongoose';
import dotenv from 'dotenv';  

import { DB_NAME } from '../contant.js';

dotenv.config();  

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(
            `${process.env.MONGO_URI}/${DB_NAME}`, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
        });
        console.log(`\n Stocks MONGOOSE-DATABASE Connected || db host:
             ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log('Error in MongoDB connection', error);
        process.exit(1);
    }
};

export default connectDB;

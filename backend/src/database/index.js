import mongoose from "mongoose";
import dotenv from "dotenv";


dotenv.config();

let isConnected = false; 

const connectDB = async () => {
  if (isConnected) {
    console.log("🔄 Using existing MongoDB connection");
    return;
  }

  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_URI}/${process.env.DB_NAME}`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    isConnected = connectionInstance.connections[0].readyState === 1;

    console.log(
      `✅ Stocks MONGOOSE-DATABASE Connected || db host: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.error("❌ Error in MongoDB connection:", error);

  }
};

export default connectDB;

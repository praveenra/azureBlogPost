import mongoose from "mongoose";
import config from "./index.js";

const connectDB = async () => {
    try {
        if (!config.mongoUri) {
            throw new Error("mongoUri is not defined in config");
        }

        await mongoose.connect(config.mongoUri, {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000
        });
        
        console.log("✅ MongoDB Atlas Connected");
    } catch (err) {
        console.error("❌ MongoDB Connection Error", err.message);
        process.exit(1);
    }
};

export default connectDB;

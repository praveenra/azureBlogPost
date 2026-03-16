import mongoose from "mongoose";

const connectDB = async () => {
    try {
        console.log("process.env.MONGODB_URI:", process.env.MONGODB_URI);
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is not defined");
        }

        // await mongoose.connect(process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI, {
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

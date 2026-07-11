import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...");

    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connected");
    console.log("Host:", conn.connection.host);

    return conn;
  } catch (error) {
    console.error("❌ MongoDB Connection Error:");
    console.error(error.message);
    process.exit(1);
  }
};
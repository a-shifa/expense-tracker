import mongoose from "mongoose";

export const connectDB = async (uri) => {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(uri, { 
      dbName: uri.includes("mongodb+srv") ? undefined : "expense_tracker"
    });
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};

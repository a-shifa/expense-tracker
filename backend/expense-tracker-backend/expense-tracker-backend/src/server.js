import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import { notFound, errorHandler } from "./middleware/error.js";

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
// --- CORS SETTINGS: Allow frontend at http://localhost:5173 ---
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Healthcheck
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Expense Tracker API running" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);

// 404 + Error handlers
app.use(notFound);
app.use(errorHandler);

// --- PORT SETTINGS ---
const PORT = 8001;

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ Missing MONGO_URI in environment. Create a .env file or set the variable.");
  process.exit(1);
}

connectDB(MONGO_URI).then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  amount: { type: Number, required: true, min: 0 },
  type: { type: String, enum: ["income", "expense"], required: true },
  category: { type: String, required: true, trim: true },
  date: { type: Date, required: true, default: Date.now },
  note: { type: String, trim: true, default: "" }
}, { timestamps: true });

transactionSchema.index({ user: 1, date: -1 });

export const Transaction = mongoose.model("Transaction", transactionSchema);
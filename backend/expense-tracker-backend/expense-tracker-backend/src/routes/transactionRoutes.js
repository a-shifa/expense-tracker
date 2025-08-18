import express from "express";
import { body } from "express-validator";
import { auth } from "../middleware/auth.js";
import {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
  getStats
} from "../controllers/transactionController.js";

const router = express.Router();
router.use(auth);

router.post(
  "/",
  [
    body("amount").isFloat({ min: 0 }).withMessage("Amount must be a positive number"),
    body("type").isIn(["income", "expense"]).withMessage("Type must be income or expense"),
    body("category").trim().notEmpty().withMessage("Category is required"),
    body("date").optional().isISO8601().toDate().withMessage("Date must be ISO8601")
  ],
  createTransaction
);

router.get("/", getTransactions);
router.get("/stats", getStats);
router.patch("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);

export default router;
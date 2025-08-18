import express from "express";
import { body } from "express-validator";
import { register, login, me, deleteUser, forgotPassword } from "../controllers/authController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Email is invalid"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
  ],
  register
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Email is invalid"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
  ],
  login
);

router.get("/me", auth, me);

// New delete and forgot password routes
router.delete("/delete", deleteUser);
router.post("/forgot-password", forgotPassword);

export default router;
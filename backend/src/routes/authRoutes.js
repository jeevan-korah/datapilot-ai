import express from "express";
import {
  getUserInfo,
  login,
  logout,
  registerAdmin,
  registerUser,
  resendOTP,
  verifyOTP,
} from "../controllers/authController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register/user", registerUser);
router.post("/register/admin", registerAdmin);
router.post("/login", login);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);

// Protected routes
router.post("/logout", authenticate, logout);
router.get("/me", authenticate, getUserInfo);

export default router;

import express from "express";
import {
  createUser,
  login,
  resendOtp,
  verifyOtp,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/newUser", createUser);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.post("/login", login);

export default router;

import express from "express";
import {
  createUser,
  login,
  resendOtp,
  verifyOtp,
} from "../controllers/userController.js";

//Query shit
import {
  promptExtraction,
} from "../controllers/queryContoller.js";

const router = express.Router();

router.post("/signup", createUser);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.post("/login", login);
router.post("/query", promptExtraction);

export default router;

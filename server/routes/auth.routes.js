import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  sendResetPasswordOTP,
  resetPassword,
} from "../controllers/user.controller.js"; // agora vem do controller unificado
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);         // registro
router.post("/login", loginUser);              // login
router.post("/logout", authMiddleware, logoutUser); // logout
router.post("/forgot-password", sendResetPasswordOTP); // enviar OTP
router.post("/reset-password", resetPassword);       // resetar senha com OTP

export default router;

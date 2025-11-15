import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  googleOAuth,
} from "../controllers/user.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleOAuth);
router.post("/logout", authMiddleware, logoutUser);
router.get("/check", authMiddleware, getUserProfile);

export default router;

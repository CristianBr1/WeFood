import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/check", (req, res) => {
  if (req.user) {
    return res.json({ authenticated: true, user: req.user });
  }
  return res.json({ authenticated: false });
});

router.post("/register", registerUser); // registro
router.post("/login", loginUser); // login
router.post("/logout", authMiddleware, logoutUser); // logout

export default router;

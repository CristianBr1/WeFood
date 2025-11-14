import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/check", authMiddleware, (req, res) => {
  return res.json({
    authenticated: true,
    user: req.user,
  });
});


router.post("/register", registerUser); // registro
router.post("/login", loginUser); // login
router.post("/logout", authMiddleware, logoutUser); // logout

export default router;

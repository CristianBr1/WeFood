// googleAuth.routes.js

import express from "express";
import jwt from "jsonwebtoken";
import passport from "passport";

const router = express.Router();

// /api/auth/google/
router.get(
  "/",
  (req, res, next) => {
    // limpa cookie
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });

    // segue para o Google
    next();
  },
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// /api/auth/google/callback
router.get(
  "/callback",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    const user = req.user;

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // cria cookie httpOnly
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // HTTPS obrigatório
      sameSite: "none", // para funcionar entre domínios
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // redireciona ao frontend
    return res.redirect(`${process.env.CLIENT_URL}/auth/callback`);
  }
);

export default router;

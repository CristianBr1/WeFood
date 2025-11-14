import express from "express";
import {
  getUserProfile,
  getAllUsers,
  deleteUser,
  updateUserAvatar,
  updateUserProfile,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";

const router = express.Router();

/** ===========================
 * 👤 Rotas de Usuário
 * =========================== */
router.get("/profile", authMiddleware, getUserProfile);
router.put("/profile", authMiddleware, updateUserProfile);
router.put("/profile/avatar", authMiddleware, updateUserAvatar);

/** ===========================
 * 🛡️ Rotas de Admin
 * =========================== */
router.get("/", authMiddleware, adminMiddleware, getAllUsers);
router.delete("/:id", authMiddleware, adminMiddleware, deleteUser);

export default router;

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

/**
 * ===========================
 * 👤 Rotas de Usuário
 * ===========================
 */

// 🔹 Obter perfil do usuário logado
router.get("/profile", authMiddleware, getUserProfile);

// 🔹 Atualizar perfil do usuário logado
router.put("/profile", authMiddleware, updateUserProfile);

// 🔹 Atualizar avatar do usuário logado
router.put("/profile/avatar", authMiddleware, updateUserAvatar);

/**
 * ===========================
 * 🛡️ Rotas de Admin
 * ===========================
 */

// 🔹 Listar todos os usuários (apenas ADMIN)
router.get("/", authMiddleware, adminMiddleware, getAllUsers);

// 🔹 Deletar usuário por ID (apenas ADMIN)
router.delete("/:id", authMiddleware, adminMiddleware, deleteUser);

export default router;

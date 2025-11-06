import express from "express";
import {
  getUserProfile,
  getAllUsers,
  deleteUser,
  updateUserAvatar,
} from "../controllers/user.controller.js"; // controller unificado
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// 🔹 Perfil do usuário logado
router.get("/profile", authMiddleware, getUserProfile);

// 🔹 CRUD/Admin
router.get("/", authMiddleware, getAllUsers);      // listar todos
router.delete("/:id", authMiddleware, deleteUser); // deletar usuário
router.put("/:id/avatar", authMiddleware, updateUserAvatar);

export default router;

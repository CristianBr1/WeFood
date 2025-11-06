import express from "express";
import {
  createOrder,
  getAllOrders,
  getUserOrders,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/order.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";

const router = express.Router();

// 🛒 Usuário logado cria pedido (simula pagamento)
router.post("/simulate-payment", authMiddleware, createOrder);

// 👤 Usuário logado vê seus próprios pedidos
router.get("/user/:userId", authMiddleware, getUserOrders);

// 👑 Apenas admin pode listar todos os pedidos
router.get("/", authMiddleware, adminMiddleware, getAllOrders);

// 👑 Apenas admin pode atualizar status do pedido
router.put("/:id/status", authMiddleware, adminMiddleware, updateOrderStatus);

// 👑 Apenas admin pode excluir pedido
router.delete("/:id", authMiddleware, adminMiddleware, deleteOrder);

export default router;

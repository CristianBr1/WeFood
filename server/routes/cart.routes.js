import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../controllers/cart.controller.js";

const router = express.Router();

router.use(authMiddleware); // todas rotas precisam de autenticação

router.get("/", getCart);           // pega todos itens do carrinho do usuário
router.post("/", addToCart);       // adiciona produto ao carrinho
router.put("/:id", updateCartItem); // atualiza quantidade
router.delete("/:id", removeFromCart); // remove produto específico
router.delete("/", clearCart);      // limpa carrinho inteiro

export default router;

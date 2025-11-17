import express from "express";
import {
  getSettings,
  updateSettings,
} from "../controllers/settings.controller.js";
import {  adminMiddleware } from "../middlewares/admin.middleware.js";
import {  authMiddleware } from "../middlewares/auth.middleware.js";
const router = express.Router();

// público — app cliente precisa saber taxas
router.get("/", getSettings);

// privado — apenas admin altera taxas
router.put("/", authMiddleware, adminMiddleware, updateSettings);


export default router;

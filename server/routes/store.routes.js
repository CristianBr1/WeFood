import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { getStore, saveStore, deleteLogo } from "../controllers/store.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";

const router = express.Router();

// 🔧 Garante que a pasta 'uploads/' exista
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ⚙️ Configuração do multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = file.originalname.split(".").pop();
    cb(null, `logo-${uniqueSuffix}.${ext}`);
  },
});

const upload = multer({ storage });

// Rotas públicas
router.get("/", getStore); // Buscar dados da loja

// Rotas protegidas (admin)
router.post("/", authMiddleware, adminMiddleware, upload.single("logo"), saveStore);
router.delete("/logo", authMiddleware, adminMiddleware, deleteLogo);

export default router;

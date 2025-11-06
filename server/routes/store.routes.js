import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { getStore, saveStore, deleteLogo } from "../controllers/store.controller.js";

const router = express.Router();

// 🔧 Garante que a pasta 'uploads/' exista
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ⚙️ Configuração do multer (salva direto em uploads/)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = file.originalname.split(".").pop();
    cb(null, `logo-${uniqueSuffix}.${ext}`);
  },
});

const upload = multer({ storage });

// 🧩 Rotas
router.get("/", getStore); // Buscar dados da loja
router.post("/", upload.single("logo"), saveStore); // Criar/atualizar loja
router.delete("/logo", deleteLogo); // Excluir logo

export default router;

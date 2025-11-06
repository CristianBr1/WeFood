import express from "express";
import multer from "multer";
import path from "path";
import { 
  createCategory, 
  getCategories, 
  updateCategory, 
  deleteCategory 
} from "../controllers/category.controller.js";

const router = express.Router();

// Configuração do multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Rotas
router.post("/", upload.single("image"), createCategory);
router.get("/", getCategories);

// Atualizar categoria (nome e imagem opcional)
router.put("/:id", upload.single("image"), updateCategory);

// Deletar categoria
router.delete("/:id", deleteCategory);

export default router;

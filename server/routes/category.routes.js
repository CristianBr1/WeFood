import express from "express";
import multer from "multer";
import path from "path";
import { 
  createCategory, 
  getCategories, 
  updateCategory, 
  deleteCategory 
} from "../controllers/category.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";

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

// Rotas públicas
router.get("/", getCategories);

// Rotas protegidas (admin)
router.post("/", authMiddleware, adminMiddleware, upload.single("image"), createCategory);
router.put("/:id", authMiddleware, adminMiddleware, upload.single("image"), updateCategory);
router.delete("/:id", authMiddleware, adminMiddleware, deleteCategory);

export default router;

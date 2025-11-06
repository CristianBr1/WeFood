import express from "express";
import multer from "multer";
import path from "path";
import {
  createProduct,
  getProducts,
  deleteProduct,
  updateProduct,
} from "../controllers/product.controller.js";

const router = express.Router();

// Configuração de upload (salva em /uploads)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Rotas
router.post("/", upload.single("image"), createProduct);
router.get("/", getProducts);
router.delete("/:id", deleteProduct);
router.put("/:id", upload.single("image"), updateProduct);

export default router;

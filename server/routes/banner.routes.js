import express from "express";
import multer from "multer";
import {
  createBanner,
  getBanners,
  deleteBanner,
} from "../controllers/banner.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";

const router = express.Router();

// Configuração do multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = file.originalname.split(".").pop();
    cb(null, `banner-${uniqueSuffix}.${ext}`);
  },
});

const upload = multer({ storage });

// Rotas públicas
router.get("/", getBanners);

// Rotas protegidas (admin)
router.post("/", authMiddleware, adminMiddleware, upload.single("image"), createBanner);
router.delete("/:id", authMiddleware, adminMiddleware, deleteBanner);

export default router;

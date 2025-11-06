import express from "express";
import multer from "multer";
import {
  createBanner,
  getBanners,
  deleteBanner,
} from "../controllers/banner.controller.js";

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

// Rotas
router.get("/", getBanners);
router.post("/", upload.single("image"), createBanner);
router.delete("/:id", deleteBanner);

export default router;

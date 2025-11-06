import Banner from "../models/banner.model.js";
import fs from "fs";
import path from "path";

export const createBanner = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Imagem é obrigatória." });
    }

    const newBanner = new Banner({
      title: req.body.title || "",
      image: `/uploads/${req.file.filename}`,
    });

    await newBanner.save();
    res.status(201).json(newBanner);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao criar banner." });
  }
};

export const getBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ createdAt: -1 });
    res.json(banners);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar banners." });
  }
};

export const deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ message: "Banner não encontrado." });

    // Remove arquivo físico se existir
    const filePath = path.join(process.cwd(), "uploads", path.basename(banner.image));
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await banner.deleteOne();
    res.json({ message: "Banner excluído com sucesso." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao excluir banner." });
  }
};

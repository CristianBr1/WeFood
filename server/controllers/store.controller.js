import fs from "fs";
import path from "path";
import Store from "../models/store.model.js";

// Buscar loja
export const getStore = async (req, res) => {
  try {
    const store = await Store.findOne();
    if (!store) {
      return res.json({ name: "", logo: "" });
    }

    // Retorna URL completa da logo
    const logoUrl = store.logo
      ? `${req.protocol}://${req.get("host")}${store.logo}`
      : "";

    res.json({ name: store.name, logo: logoUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao buscar loja." });
  }
};

// Criar ou atualizar loja
export const saveStore = async (req, res) => {
  try {
    let store = await Store.findOne();

    // Caminho relativo da logo (para salvar no banco)
    const logoPath = req.file ? `/uploads/${req.file.filename}` : store?.logo || "";

    if (store) {
      // Remove logo antiga se houver nova
      if (req.file && store.logo) {
        const oldPath = path.join(process.cwd(), store.logo);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      store.name = req.body.name;
      store.logo = logoPath;
      await store.save();
    } else {
      store = await Store.create({ name: req.body.name, logo: logoPath });
    }

    const logoUrl = logoPath
      ? `${req.protocol}://${req.get("host")}${logoPath}`
      : "";

    res.status(200).json({ name: store.name, logo: logoUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao salvar dados da loja." });
  }
};

// Excluir logo
export const deleteLogo = async (req, res) => {
  try {
    const store = await Store.findOne();
    if (!store || !store.logo) {
      return res.status(404).json({ message: "Logo não encontrada." });
    }

    const filePath = path.join(process.cwd(), store.logo);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    store.logo = "";
    await store.save();

    res.json({ message: "Logo excluída com sucesso." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao excluir logo." });
  }
};

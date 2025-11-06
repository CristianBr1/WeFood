import Product from "../models/Product.model.js";
import fs from "fs";
import path from "path";

// 🔹 Criar produto
export const createProduct = async (req, res) => {
  try {
    const { name, price, category, description, extras, meatOptions } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ message: "Nome, preço e categoria são obrigatórios." });
    }

    // ✅ Imagem
    let imagePath = "";
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    }

    // ✅ Extras
    let parsedExtras = [];
    if (extras) {
      try {
        const rawExtras = JSON.parse(extras);
        parsedExtras = rawExtras.filter(
          e => e.name && e.price && e.name.trim() !== "" && !isNaN(e.price)
        );
      } catch {
        parsedExtras = [];
      }
    }

    // ✅ Opções de carne
    let parsedMeatOptions = { enabled: false, min: 1, max: 1, pricePerExtra: 0 };
    if (meatOptions) {
      try {
        const rawMeat = JSON.parse(meatOptions);
        parsedMeatOptions = {
          enabled: !!rawMeat.enabled,
          min: Number(rawMeat.min) || 1,
          max: Number(rawMeat.max) || 1,
          pricePerExtra: Number(rawMeat.pricePerExtra) || 0,
        };
      } catch {
        parsedMeatOptions = { enabled: false, min: 1, max: 1, pricePerExtra: 0 };
      }
    }

    const product = new Product({
      name,
      price,
      category,
      description: description || "",
      extras: parsedExtras,
      meatOptions: parsedMeatOptions,
      image: imagePath,
    });

    await product.save();
    res.status(201).json({ success: true, message: "Produto criado com sucesso!", product });

  } catch (error) {
    console.error("Erro ao criar produto:", error);
    res.status(500).json({ message: "Erro interno ao criar produto." });
  }
};

// 🔹 Atualizar produto
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, category, description, extras, meatOptions } = req.body;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Produto não encontrado." });

    // ✅ Campos básicos
    if (name) product.name = name;
    if (price) product.price = price;
    if (category) product.category = category;
    if (description !== undefined) product.description = description;

    // ✅ Extras
    if (extras) {
      try {
        const rawExtras = JSON.parse(extras);
        product.extras = rawExtras.filter(
          e => e.name && e.price && e.name.trim() !== "" && !isNaN(e.price)
        );
      } catch {
        product.extras = [];
      }
    }

    // ✅ Opções de carne
    if (meatOptions) {
      try {
        const rawMeat = JSON.parse(meatOptions);
        product.meatOptions = {
          enabled: !!rawMeat.enabled,
          min: Number(rawMeat.min) || 1,
          max: Number(rawMeat.max) || 1,
          pricePerExtra: Number(rawMeat.pricePerExtra) || 0,
        };
      } catch {
        product.meatOptions = { enabled: false, min: 1, max: 1, pricePerExtra: 0 };
      }
    }

    // ✅ Imagem
    if (req.file) {
      if (product.image) {
        const oldImagePath = path.join(process.cwd(), product.image);
        if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
      }
      product.image = `/uploads/${req.file.filename}`;
    }

    await product.save();
    res.json({ success: true, message: "Produto atualizado com sucesso!", product });

  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    res.status(500).json({ message: "Erro ao atualizar produto." });
  }
};

// 🔹 Listar produtos
export const getProducts = async (req, res) => {
  try {
    const { categoryId } = req.query;
    const filter = categoryId ? { category: categoryId } : {};
    const products = await Product.find(filter)
      .populate("category")
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    res.status(500).json({ message: "Erro ao buscar produtos." });
  }
};

// 🔹 Deletar produto
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Produto não encontrado." });

    if (product.image) {
      const imagePath = path.join(process.cwd(), product.image);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    await product.deleteOne();
    res.json({ success: true, message: "Produto excluído com sucesso!" });

  } catch (error) {
    console.error("Erro ao excluir produto:", error);
    res.status(500).json({ message: "Erro ao excluir produto." });
  }
};

import Category from "../models/category.model.js";
import Product from "../models/Product.model.js";
import fs from "fs";
import path from "path";

// Criar categoria
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !req.file) {
      return res
        .status(400)
        .json({ message: "Nome e imagem são obrigatórios." });
    }

    const imagePath = `/uploads/${req.file.filename}`;
    const category = new Category({ name, image: imagePath });
    await category.save();

    res
      .status(201)
      .json({ success: true, message: "Categoria criada com sucesso!", category });
  } catch (error) {
    console.error("Erro ao criar categoria:", error);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
};

// Listar categorias
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
    res.status(500).json({ message: "Erro ao buscar categorias." });
  }
};

// Atualizar categoria
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ message: "Categoria não encontrada." });

    if (name) category.name = name;

    // Atualiza imagem somente se houver upload
    if (req.file) {
      if (category.image) {
        const oldImagePath = path.join(process.cwd(), category.image);
        if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
      }
      category.image = `/uploads/${req.file.filename}`;
    }

    await category.save();
    res.json(category);
  } catch (error) {
    console.error("Erro ao atualizar categoria:", error);
    res.status(500).json({ message: "Erro ao atualizar categoria." });
  }
};


// Deletar categoria

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category)
      return res.status(404).json({ message: "Categoria não encontrada." });

    // Atualizar produtos que pertencem a esta categoria para category null
    await Product.updateMany(
      { category: category._id },
      { category: null }
    );

    // Remover imagem da categoria
    if (category.image) {
      const imagePath = path.join(process.cwd(), category.image);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    // Deletar categoria
    await category.deleteOne();

    res.json({ success: true, message: "Categoria deletada com sucesso!" });
  } catch (error) {
    console.error("Erro ao deletar categoria:", error);
    res.status(500).json({ message: "Erro ao deletar categoria." });
  }
};
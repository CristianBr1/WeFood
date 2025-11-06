import express from "express";
import Product from "../models/Product.model.js";
import Category from "../models/category.model.js";
import fs from "fs";
import path from "path";

const router = express.Router();

/**
 * Rota para popular o banco com 20 hambúrgueres criativos
 */
router.post("/seed-hamburgers", async (req, res) => {
  try {
    // Buscar a categoria "Hambúrguer"
    let category = await Category.findOne({ name: /hamburguer/i });

    if (!category) {
      // Se não existir, cria a categoria automaticamente
      category = await Category.create({
        name: "Hambúrguer",
        image: "/uploads/placeholder.jpg", // Imagem genérica
      });
    }

// 20 hambúrgueres criativos com description e observations vazio
const hamburgers = [
  {
    name: "Clássico Supremo",
    price: 22,
    image: "/uploads/hamburgers/hamburguer1.jpg",
    description: "Hambúrguer clássico com carne suculenta, queijo, alface e tomate.",
    extras: [{ name: "Queijo extra", price: 2 }, { name: "Bacon extra", price: 3 }],
    observations: "",
    meatOptions: { enabled: true, min: 1, max: 2, pricePerExtra: 4 },
  },
  {
    name: "Cheddar Lover",
    price: 24,
    image: "/uploads/hamburgers/hamburguer2.jpg",
    description: "Delicioso hambúrguer com muito cheddar e molho especial.",
    extras: [{ name: "Molho especial", price: 2.5 }, { name: "Bacon extra", price: 3 }],
    observations: "",
    meatOptions: { enabled: true, min: 1, max: 3, pricePerExtra: 5 },
  },
  {
    name: "Bacon Crocante",
    price: 26,
    image: "/uploads/hamburgers/hamburguer3.jpg",
    description: "Carne suculenta com bacon crocante e queijo cheddar.",
    extras: [{ name: "Queijo cheddar", price: 2 }, { name: "Molho barbecue", price: 2 }],
    observations: "",
    meatOptions: { enabled: true, min: 1, max: 3, pricePerExtra: 5 },
  },
  {
    name: "Duplo Cheddar",
    price: 28,
    image: "/uploads/hamburgers/hamburguer4.jpg",
    description: "Hambúrguer duplo com muito cheddar e molho especial.",
    extras: [{ name: "Bacon extra", price: 3 }, { name: "Molho especial", price: 2.5 }],
    observations: "",
    meatOptions: { enabled: true, min: 1, max: 3, pricePerExtra: 5 },
  },
  {
    name: "Triplo Delícia",
    price: 32,
    image: "/uploads/hamburgers/hamburguer5.jpg",
    description: "Três camadas de carne com queijo e cebola caramelizada.",
    extras: [{ name: "Queijo extra", price: 2 }, { name: "Cebola caramelizada", price: 2 }],
    observations: "",
    meatOptions: { enabled: true, min: 1, max: 3, pricePerExtra: 5 },
  },
  {
    name: "Costela BBQ",
    price: 30,
    image: "/uploads/hamburgers/hamburguer6.jpg",
    description: "Hambúrguer suculento com costela e molho barbecue.",
    extras: [{ name: "Molho barbecue extra", price: 2 }, { name: "Queijo prato", price: 2 }],
    observations: "",
    meatOptions: { enabled: true, min: 1, max: 2, pricePerExtra: 4 },
  },
  {
    name: "Picanha Premium",
    price: 35,
    image: "/uploads/hamburgers/hamburguer7.jpg",
    description: "Hambúrguer de picanha premium com bacon e queijo gorgonzola.",
    extras: [{ name: "Bacon extra", price: 3 }, { name: "Queijo gorgonzola", price: 4 }],
    observations: "",
    meatOptions: { enabled: true, min: 1, max: 3, pricePerExtra: 5 },
  },
  {
    name: "Frango Crocante",
    price: 20,
    image: "/uploads/hamburgers/hamburguer8.jpg",
    description: "Hambúrguer de frango crocante com queijo e molho honey mustard.",
    extras: [{ name: "Queijo prato", price: 2 }, { name: "Molho honey mustard", price: 2 }],
    observations: "",
    meatOptions: { enabled: false, min: 1, max: 1, pricePerExtra: 0 },
  },
  {
    name: "Vegetariano Gourmet",
    price: 25,
    image: "/uploads/hamburgers/hamburguer9.jpg",
    description: "Hambúrguer vegetariano com molho pesto e queijo vegano.",
    extras: [{ name: "Molho pesto", price: 2 }, { name: "Queijo vegano", price: 3 }],
    observations: "",
    meatOptions: { enabled: false, min: 1, max: 1, pricePerExtra: 0 },
  },
  {
    name: "Smash Burger",
    price: 23,
    image: "/uploads/hamburgers/hamburguer10.jpg",
    description: "Hambúrguer smash com cebola caramelizada e queijo extra.",
    extras: [{ name: "Cebola caramelizada", price: 2 }, { name: "Queijo extra", price: 2 }],
    observations: "",
    meatOptions: { enabled: true, min: 1, max: 2, pricePerExtra: 4 },
  },
  {
    name: "BBQ Supreme",
    price: 28,
    image: "/uploads/hamburgers/hamburguer11.jpg",
    description: "Hambúrguer com molho barbecue e bacon.",
    extras: [{ name: "Molho barbecue extra", price: 2 }, { name: "Bacon", price: 3 }],
    observations: "",
    meatOptions: { enabled: true, min: 1, max: 3, pricePerExtra: 5 },
  },
  {
    name: "Especial da Casa",
    price: 30,
    image: "/uploads/hamburgers/hamburguer12.jpg",
    description: "Hambúrguer especial da casa com queijo cheddar e molho especial.",
    extras: [{ name: "Queijo cheddar", price: 2 }, { name: "Molho especial", price: 2.5 }],
    observations: "",
    meatOptions: { enabled: true, min: 1, max: 3, pricePerExtra: 5 },
  },
  {
    name: "4 Queijos",
    price: 27,
    image: "/uploads/hamburgers/hamburguer13.jpg",
    description: "Hambúrguer com quatro tipos de queijos para os amantes de queijo.",
    extras: [{ name: "Queijo gorgonzola", price: 4 }, { name: "Queijo prato", price: 2 }],
    observations: "",
    meatOptions: { enabled: true, min: 1, max: 2, pricePerExtra: 4 },
  },
  {
    name: "Mexicano Picante",
    price: 29,
    image: "/uploads/hamburgers/hamburguer14.jpg",
    description: "Hambúrguer ao ponto com pimenta jalapeño e queijo cheddar.",
    extras: [{ name: "Molho jalapeño", price: 2 }, { name: "Queijo cheddar", price: 2 }],
    observations: "",
    meatOptions: { enabled: true, min: 1, max: 2, pricePerExtra: 4 },
  },
  {
    name: "Onion Crunch",
    price: 26,
    image: "/uploads/hamburgers/hamburguer15.jpg",
    description: "Hambúrguer com cebola crispy e molho especial.",
    extras: [{ name: "Cebola crispy", price: 2 }, { name: "Molho especial", price: 2.5 }],
    observations: "",
    meatOptions: { enabled: true, min: 1, max: 3, pricePerExtra: 5 },
  },
  {
    name: "Crocante Supreme",
    price: 28,
    image: "/uploads/hamburgers/hamburguer16.jpg",
    description: "Hambúrguer crocante com bacon extra e molho barbecue.",
    extras: [{ name: "Bacon extra", price: 3 }, { name: "Molho barbecue", price: 2 }],
    observations: "",
    meatOptions: { enabled: true, min: 1, max: 3, pricePerExtra: 5 },
  },
  {
    name: "Gourmet Especial",
    price: 32,
    image: "/uploads/hamburgers/hamburguer17.jpg",
    description: "Hambúrguer gourmet com queijo brie e molho trufado.",
    extras: [{ name: "Queijo brie", price: 4 }, { name: "Molho trufado", price: 5 }],
    observations: "",
    meatOptions: { enabled: true, min: 1, max: 2, pricePerExtra: 5 },
  },
  {
    name: "Tradicional Deluxe",
    price: 24,
    image: "/uploads/hamburgers/hamburguer18.jpg",
    description: "Hambúrguer tradicional com molho especial e queijo extra.",
    extras: [{ name: "Molho especial", price: 2.5 }, { name: "Queijo extra", price: 2 }],
    observations: "",
    meatOptions: { enabled: true, min: 1, max: 3, pricePerExtra: 5 },
  },
  {
    name: "Supremo Brabo",
    price: 35,
    image: "/uploads/hamburgers/hamburguer19.jpg",
    description: "Hambúrguer servido ao ponto com bacon e picles opcional.",
    extras: [{ name: "Bacon", price: 3 }, { name: "Queijo cheddar", price: 2 }],
    observations: "",
    meatOptions: { enabled: true, min: 1, max: 3, pricePerExtra: 5 },
  },
  {
    name: "Brabo Max",
    price: 38,
    image: "/uploads/hamburgers/hamburguer20.jpg",
    description: "Hambúrguer servido bem passado com molho especial e cebola caramelizada.",
    extras: [{ name: "Molho especial", price: 2.5 }, { name: "Cebola caramelizada", price: 2 }],
    observations: "",
    meatOptions: { enabled: true, min: 1, max: 3, pricePerExtra: 5 },
  },
];


    let addedCount = 0;

    for (const burger of hamburgers) {
      // Verifica se já existe produto com mesmo nome e categoria
      const exists = await Product.findOne({ name: burger.name, category: category._id });
      if (!exists) {
        // Garante que a imagem exista, caso contrário usa placeholder
        const imagePath = path.join(process.cwd(), "public", burger.image);
        if (!fs.existsSync(imagePath)) {
          burger.image = "/uploads/placeholder.jpg";
        }

        // Associa categoria
        burger.category = category._id;
        await Product.create(burger);
        addedCount++;
      }
    }

    res.status(201).json({
      success: true,
      message: `${addedCount} hambúrguer(es) adicionados com sucesso!`,
    });
  } catch (error) {
    console.error("Erro ao popular hambúrgueres:", error);
    res.status(500).json({ success: false, message: "Erro ao popular banco de dados" });
  }
});

export default router;

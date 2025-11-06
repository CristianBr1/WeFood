import mongoose from "mongoose";
import User from "../models/user.model.js";
import dotenv from "dotenv";

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Conectado ao MongoDB");

    const email = "evanoff.1977@gmail.com";
    const password = "admin123"; // sua senha desejada
    const name = "Administrador";

    // Verifica se já existe
    const exists = await User.findOne({ email });
    if (exists) {
      console.log("Admin já existe");
      process.exit(0);
    }

    const newAdmin = new User({
      name,
      email,
      password, // será hashado pelo pre("save")
      role: "ADMIN",
    });

    await newAdmin.save();
    console.log("Admin criado com sucesso!");
    process.exit(0);
  } catch (err) {
    console.error("Erro ao criar admin:", err);
    process.exit(1);
  }
};

run();

import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI não está definido no arquivo .env");
}

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {});
    console.log("✅ Conectado ao MongoDB com sucesso");
  } catch (error) {
    console.error("❌ Erro ao conectar no MongoDB:", error);
  }
};

export default connectDB;

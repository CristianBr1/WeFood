import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import helmet from "helmet";
import connectDB from "./config/connectDB.js";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

// Rotas
import userRoutes from "./routes/user.routes.js";
import productRoutes from "./routes/product.routes.js";
import testRoutes from "./routes/test.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import bannerRoutes from "./routes/banner.routes.js";
import storeRoutes from "./routes/store.routes.js";
import authRoutes from "./routes/auth.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import addressRoutes from "./routes/address.routes.js";
import orderRoutes from "./routes/order.routes.js";
import seedHamburgersRoute from "./routes/seedHamburgers.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(cookieParser());

// ---------------------
// Middlewares
// ---------------------
app.use(
  cors({
    origin: [
      "http://localhost:5173", // client local
      "http://localhost:5174", // admin local
      "https://wefood-client.vercel.app", // antigo front
      "https://wefood-admin.vercel.app", // admin
      "https://we-food-green.vercel.app", // 🚀 novo front (client)
      "https://wefood-two.vercel.app", // 🚀 novo front (admin)
    ],
    credentials: true,
  })
);


app.use(morgan("combined"));
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);


// 🔹 Acesso às imagens enviadas
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ---------------------
// Rotas
// ---------------------
app.use("/api/users", userRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/test", testRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/store", storeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api", seedHamburgersRoute);

// ---------------------
// Inicialização
// ---------------------
const PORT = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.json({
    message: `✅ Server está rodando na porta ${PORT}`,
  });
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
  });
});

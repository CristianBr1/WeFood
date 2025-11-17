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
import paymentRoutes from "./routes/payment.routes.js";
import settingsRoutes from "./routes/settings.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8000;
const isProd = process.env.NODE_ENV === "production";

/* ====================================
   🛡️ Middleware Globais
==================================== */
app.use(cookieParser());
app.use(morgan("combined"));

app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

/* ====================================
   🌍 CORS — ESSA CONFIG ESTÁ CERTA
   Aceita cookies cross-site no PROD
==================================== */
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://we-food-green.vercel.app",
  "https://wefood-two.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);

      console.log("❌ Origin bloqueada:", origin);
      return callback(new Error("Origin não permitido pelo CORS"), false);
    },
    credentials: true,
  })
);

/* ====================================
   📁 Arquivos públicos
==================================== */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ====================================
   🧩 Body Parser (Stripe)
==================================== */
app.use((req, res, next) => {
  if (req.originalUrl === "/api/payments/webhook") {
    next(); // Stripe usa raw body
  } else {
    express.json()(req, res, next);
  }
});

/* ====================================
   🚏 Rotas da API
==================================== */
app.use("/api/users", userRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/test", testRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/store", storeRoutes);
app.use("/api/auth", authRoutes); // Google OAuth está aqui
app.use("/api/cart", cartRoutes);
app.use("/api", seedHamburgersRoute);
app.use("/api/payments", paymentRoutes);
app.use("/api/settings", settingsRoutes);

/* ====================================
   🔍 Rota de teste
==================================== */
app.get("/", (req, res) => {
  res.json({
    message: `✅ Server está rodando na porta ${PORT}`,
    environment: isProd ? "PRODUÇÃO" : "LOCALHOST",
  });
});

/* ====================================
   🚀 Inicializar Servidor
==================================== */
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
  });
});

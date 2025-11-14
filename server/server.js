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
import stripeWebhookRoutes from "./routes/stripeWebhook.routes.js";
import stripeTestWebhook from "./routes/stripeTestWebhook.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ---------------------
// Middlewares globais
// ---------------------
app.use(cookieParser());
app.use(morgan("combined"));
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

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
      return callback(new Error("Origin não permitido pelo CORS"), false);
    },
    credentials: true,
  })
);

// 🔹 Rota para arquivos públicos
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 🔹 Body parser para JSON exceto webhook
app.use((req, res, next) => {
  if (req.originalUrl === "/api/payments/webhook") {
    next(); // stripe precisa de raw body
  } else {
    express.json()(req, res, next);
  }
});

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
app.use("/api/payments", paymentRoutes);
app.use("/webhook-test", stripeTestWebhook);

// Stripe webhook deve vir **antes de express.json()**, com raw body
app.use("/api/payments/webhook", stripeWebhookRoutes);

// ---------------------
// Teste de rota
// ---------------------
const PORT = process.env.PORT || 8000;
app.get("/", (req, res) => {
  res.json({ message: `✅ Server está rodando na porta ${PORT}` });
});

// ---------------------
// Conectar ao MongoDB e iniciar servidor
// ---------------------
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
  });
});

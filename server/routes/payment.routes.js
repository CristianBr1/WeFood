import express from "express";
import Stripe from "stripe";
import mongoose from "mongoose";
import OrderModel from "../models/order.model.js";
import AddressModel from "../models/address.model.js";
import ProductModel from "../models/Product.model.js";
import { v4 as uuidv4 } from "uuid";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ---------------------------
// Função auxiliar: gerar orderId legível
// ---------------------------
const generateOrderId = () => {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, "");
  return `ORD-${date}-${Math.floor(1000 + Math.random() * 9000)}`;
};

// ==================== CRIAR PEDIDO & STRIPE CHECKOUT ====================
router.post("/create-checkout-session", authMiddleware, async (req, res) => {
  try {
    const {
      products,
      subTotalAmt,
      totalAmt,
      serviceFee,
      deliveryFee,
      delivery_address,
      pickup,
    } = req.body;

    const userId = req.user?._id;
    if (!userId)
      return res.status(401).json({ error: "Usuário não autenticado." });
    if (!products || products.length === 0)
      return res.status(400).json({ error: "Carrinho vazio." });

    // ================== Endereço ==================
    let addressData = null;
    if (!pickup && delivery_address) {
      if (typeof delivery_address === "string") {
        addressData = await AddressModel.findById(delivery_address);
        if (!addressData)
          return res.status(404).json({ error: "Endereço não encontrado." });
      } else if (typeof delivery_address === "object") {
        if (delivery_address._id) {
          // Buscar pelo _id enviado
          addressData = await AddressModel.findById(delivery_address._id);
          if (!addressData)
            return res.status(404).json({ error: "Endereço não encontrado." });
        } else {
          // Evitar duplicação de endereços
          addressData = await AddressModel.findOne({
            userId,
            address_line: delivery_address.address_line,
            city: delivery_address.city,
            pincode: delivery_address.pincode,
          });

          if (!addressData) {
            addressData = await AddressModel.create({
              ...delivery_address,
              userId,
            });
          }
        }
      }
    }

    // ================== Produtos ==================
    const populatedProducts = await Promise.all(
      products.map(async (item, index) => {
        const pid = item.productId || item._id;
        if (!pid || !mongoose.Types.ObjectId.isValid(pid)) {
          throw new Error(`ID de produto inválido no índice ${index}`);
        }

        const product = await ProductModel.findById(pid);
        if (!product) throw new Error(`Produto não encontrado: ${pid}`);

        const totalPrice =
          (product.price || 0) * (item.quantity || 1) +
          (item.extras?.reduce((sum, e) => sum + (e.price || 0), 0) || 0);

        return {
          productId: product._id,
          product_details: { name: product.name, image: product.image || [] },
          quantity: item.quantity,
          extras: item.extras || [],
          observations: item.observations || "",
          totalPrice,
        };
      })
    );

    // ================== Criar pedido PENDENTE ==================
    const orderId = generateOrderId();
    const newOrder = await OrderModel.create({
      userId,
      orderId,
      products: populatedProducts,
      delivery_address: addressData?._id || null,
      pickup: pickup || false,
      subTotalAmt,
      totalAmt,
      serviceFee: serviceFee || 0,
      deliveryFee: deliveryFee || 0,
      payment_status: "pendente",
      order_status: "Pendente",
      paymentId: uuidv4(),
      invoice_receipt: `RCPT-${uuidv4().slice(0, 8)}`,
    });

    // ================== Criar sessão Stripe ==================
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: populatedProducts.map((item) => ({
        price_data: {
          currency: "brl",
          product_data: { name: item.product_details.name },
          unit_amount: Math.round(item.totalPrice * 100),
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/checkout`,
      metadata: { orderId: newOrder._id.toString() },
    });

    console.log("Sessão Stripe criada:", session.id);
    res.status(201).json({ url: session.url });
  } catch (err) {
    console.error("Erro ao criar sessão de checkout:", err);
    res.status(500).json({ error: "Erro ao criar sessão de pagamento." });
  }
});

// ==================== STRIPE WEBHOOK ====================
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );

      console.log("Evento recebido:", event.type);

      if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const orderId = session.metadata?.orderId;

        if (!orderId) {
          console.warn("Nenhum orderId no metadata do session");
        } else {
          const updated = await OrderModel.findByIdAndUpdate(
            orderId,
            { payment_status: "pago", order_status: "Em preparo" },
            { new: true }
          );

          if (updated) {
            console.log(`Pedido ${orderId} atualizado com sucesso!`);
          } else {
            console.warn(`Pedido ${orderId} não encontrado no MongoDB`);
          }
        }
      }

      res.status(200).json({ received: true });
    } catch (err) {
      console.error("Erro no webhook:", err.message);
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  }
);

export default router;

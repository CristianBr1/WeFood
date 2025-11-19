import express from "express";
import Stripe from "stripe";
import OrderModel from "../models/order.model.js";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ⚠️ IMPORTANTE:
// NÃO use express.raw() aqui — ele já está no server.js
router.post("/", async (req, res) => {
  let event;

  try {
    const signature = req.headers["stripe-signature"];

    event = stripe.webhooks.constructEvent(
      req.body, // raw body já garantido pelo server.js
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Erro na verificação do webhook:", err.message);
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  // ================================
  // 🔥 Evento: Pagamento concluído
  // ================================
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const orderId = session?.metadata?.orderId;

    console.log("🔔 Webhook recebido — Pagamento aprovado para o pedido:", orderId);

    if (!orderId) {
      console.error("❌ orderId não encontrado no metadata do Stripe.");
      return res.status(400).json({ error: "orderId ausente no metadata" });
    }

    // Verificar se o pedido existe
    const order = await OrderModel.findById(orderId);

    if (!order) {
      console.error("❌ Pedido não encontrado no banco:", orderId);
      return res.status(404).json({ error: "Pedido não encontrado." });
    }

    // Evitar atualizar várias vezes (Stripe pode reenviar eventos)
    if (order.payment_status === "pago") {
      console.log("ℹ️ Pedido já estava pago. Ignorando evento duplicado.");
      return res.json({ received: true });
    }

    // Atualizar pedido
    order.payment_status = "pago";
    order.order_status = "Em preparo";

    await order.save();

    console.log("✔ Pedido atualizado para EM PREPARO:", orderId);
  }

  res.json({ received: true });
});

export default router;

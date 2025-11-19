import express from "express";
import Stripe from "stripe";
import OrderModel from "../models/order.model.js";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post(
  "/webhook",
  express.raw({ type: "application/json" }), // Stripe exige raw body
  async (req, res) => {
    let event;

    try {
      const signature = req.headers["stripe-signature"];
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("❌ Erro na verificação do webhook:", err);
      return res.status(400).send(`Webhook error: ${err.message}`);
    }

    // 🔥 Evento de pagamento concluído
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const orderId = session.metadata.orderId;

      console.log("🔔 Pagamento aprovado para o pedido:", orderId);

      // Atualizar pedido
      await OrderModel.findByIdAndUpdate(orderId, {
        payment_status: "pago",
        order_status: "Em preparo",
      });

      console.log("✔ Pedido atualizado para EM PREPARO");
    }

    res.json({ received: true });
  }
);

export default router;

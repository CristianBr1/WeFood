import express from "express";
import Stripe from "stripe";
import mongoose from "mongoose";
import OrderModel from "../models/order.model.js"; // ajuste caminho conforme seu projeto

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Usar express.raw para o Stripe webhook
router.post(
  "/webhook-test",
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

      console.log("===== Evento recebido =====");
      console.log("Tipo de evento:", event.type);
      console.log("Objeto do evento:", event.data.object);

      // Captura o orderId do metadata
      const orderId = event.data.object.metadata?.orderId;
      console.log("Metadata orderId:", orderId);

      if (event.type === "checkout.session.completed") {
        if (!orderId) {
          console.warn("Nenhum orderId no metadata do session");
        } else {
          const updatedOrder = await OrderModel.findByIdAndUpdate(
            orderId,
            {
              payment_status: "pago",
              order_status: "Em preparo",
            },
            { new: true }
          );

          if (updatedOrder) {
            console.log(`✅ Pedido ${orderId} atualizado com sucesso!`);
          } else {
            console.warn(`⚠️ Pedido ${orderId} não encontrado no MongoDB`);
          }
        }
      }

      // Retornar 200 ao Stripe
      res.status(200).json({ received: true });
    } catch (err) {
      console.error("❌ Erro no webhook:", err.message);
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  }
);

export default router;

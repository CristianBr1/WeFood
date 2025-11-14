import express from "express";
import Stripe from "stripe";
import OrderModel from "../models/order.model.js";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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
    } catch (err) {
      console.error("Erro no webhook:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const orderId = session.metadata.orderId;

      try {
        await OrderModel.findByIdAndUpdate(
          orderId,
          {
            payment_status: "pago",
            order_status: "Em preparo",
          },
          { new: true }
        );

        console.log(`Pedido ${orderId} pago com sucesso!`);
      } catch (err) {
        console.error("Erro ao atualizar pedido via webhook:", err);
      }
    }

    res.json({ received: true });
  }
);

export default router;

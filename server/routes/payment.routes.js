import express from "express";
import Stripe from "stripe";
import mongoose from "mongoose";
import OrderModel from "../models/order.model.js";
import AddressModel from "../models/address.model.js";
import ProductModel from "../models/Product.model.js";
import SettingsModel from "../models/settings.model.js";
import { v4 as uuidv4 } from "uuid";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Função auxiliar: gerar orderId legível
const generateOrderId = () => {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, "");
  return `ORD-${date}-${Math.floor(1000 + Math.random() * 9000)}`;
};

// ==================== CRIAR PEDIDO & STRIPE CHECKOUT ====================
router.post("/create-checkout-session", authMiddleware, async (req, res) => {
  try {
    const { products, delivery_address, pickup } = req.body;

    const userId = req.user?._id;
    if (!userId)
      return res.status(401).json({ error: "Usuário não autenticado." });

    if (!products || products.length === 0)
      return res.status(400).json({ error: "Carrinho vazio." });

    // ================== Buscar configurações ==================
    let settings = await SettingsModel.findOne();
    if (!settings) {
      settings = await SettingsModel.create({
        serviceFee: 0,
        deliveryFee: 0,
        minOrderAmount: 0,
        restaurantOpen: true,
      });
    }

    const serviceFee = Number(settings.serviceFee || 0);
    const deliveryFee = pickup ? 0 : Number(settings.deliveryFee || 0);

    // ================== Endereço ==================
    let addressData = null;
    if (!pickup && delivery_address) {
      if (typeof delivery_address === "string") {
        addressData = await AddressModel.findById(delivery_address);
      } else if (delivery_address._id) {
        addressData = await AddressModel.findById(delivery_address._id);
      } else {
        addressData =
          (await AddressModel.findOne({
            userId,
            address_line: delivery_address.address_line,
            city: delivery_address.city,
            pincode: delivery_address.pincode,
          })) || (await AddressModel.create({ ...delivery_address, userId }));
      }

      if (!addressData)
        return res.status(404).json({ error: "Endereço não encontrado." });
    }

    // ================== PRODUTOS (Recalcular PREÇOS) ==================
    const populatedProducts = await Promise.all(
      products.map(async (item, index) => {
        const pid = item.productId || item._id;

        if (!pid || !mongoose.Types.ObjectId.isValid(pid))
          throw new Error(`ID de produto inválido no índice ${index}`);

        const product = await ProductModel.findById(pid);
        if (!product) throw new Error(`Produto não encontrado: ${pid}`);

        // 🔥 Soma extras
        const extrasTotal =
          item.extras?.reduce(
            (sum, extra) => sum + Number(extra.price || 0),
            0
          ) || 0;

        // 🔥 Soma carnes extras
        const meatExtraPrice =
          item.meatCount && product.meatOptions
            ? (item.meatCount - 1) * (product.meatOptions.pricePerExtra || 0)
            : 0;

        // 🔥 Preço final da unidade (produto + extras + carnes extras)
        const unitPrice =
          Number(product.price || 0) + extrasTotal + meatExtraPrice;

        if (unitPrice <= 0)
          throw new Error(`Preço inválido para ${product.name}`);

        const totalPrice = unitPrice * item.quantity;

        return {
          productId: product._id,
          product_details: {
            name: product.name,
            image: product.image || [],
          },
          quantity: item.quantity,
          extras: item.extras || [],
          meatCount: item.meatCount || 1,
          observations: item.observations || "",
          unitPrice,
          totalPrice,
        };
      })
    );

    const subTotalAmt = populatedProducts.reduce(
      (sum, p) => sum + p.totalPrice,
      0
    );

    const totalAmt = subTotalAmt + serviceFee + deliveryFee;

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
      serviceFee,
      deliveryFee,
      payment_status: "pendente",
      order_status: "Pendente",
      paymentId: uuidv4(),
      invoice_receipt: `RCPT-${uuidv4().slice(0, 8)}`,
    });

    // ================== Criar sessão Stripe ==================
    const lineItems = [
      ...populatedProducts.map((item) => ({
        price_data: {
          currency: "brl",
          product_data: { name: item.product_details.name },
          unit_amount: Math.round(item.unitPrice * 100),
        },
        quantity: item.quantity,
      })),

      ...(serviceFee > 0
        ? [
            {
              price_data: {
                currency: "brl",
                product_data: { name: "Taxa de serviço" },
                unit_amount: Math.round(serviceFee * 100),
              },
              quantity: 1,
            },
          ]
        : []),

      ...(deliveryFee > 0
        ? [
            {
              price_data: {
                currency: "brl",
                product_data: { name: "Taxa de entrega" },
                unit_amount: Math.round(deliveryFee * 100),
              },
              quantity: 1,
            },
          ]
        : []),
    ];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/checkout`,
      metadata: { orderId: newOrder._id.toString() },
    });

    console.log("Sessão Stripe criada:", session.id);
    res.status(201).json({ url: session.url });
  } catch (err) {
    console.error("Erro ao criar sessão de checkout:", err);
    res
      .status(500)
      .json({ error: err.message || "Erro ao criar sessão de pagamento." });
  }
});

export default router;

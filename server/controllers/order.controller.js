import OrderModel from "../models/order.model.js";
import AddressModel from "../models/address.model.js";
import ProductModel from "../models/Product.model.js";
import SettingsModel from "../models/settings.model.js";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Gera ID do pedido legível
const generateOrderId = () => {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, "");
  return `ORD-${date}-${Math.floor(1000 + Math.random() * 9000)}`;
};

export const createOrder = async (req, res) => {
  try {
    const { products, delivery_address, pickup } = req.body;
    const userId = req.user?._id;

    if (!userId) return res.status(401).json({ error: "Usuário não autenticado." });
    if (!products || products.length === 0) return res.status(400).json({ error: "Carrinho vazio." });

    // ===========================================================
    // ENDEREÇO
    // ===========================================================
    let addressData = null;
    if (!pickup) {
      if (!delivery_address) {
        return res.status(400).json({ error: "Endereço obrigatório para entrega." });
      }

      if (typeof delivery_address === "string" || delivery_address._id) {
        const addrId = typeof delivery_address === "string" ? delivery_address : delivery_address._id;
        addressData = await AddressModel.findById(addrId);
        if (!addressData) return res.status(404).json({ error: "Endereço não encontrado." });
      } else {
        // cria novo endereço
        addressData = await AddressModel.create({ ...delivery_address, userId });
      }
    }

    // ===========================================================
    // RECALCULAR PRODUTOS
    // ===========================================================
    const populatedProducts = [];

    for (let i = 0; i < products.length; i++) {
      const item = products[i];
      const pid = item.productId || item._id;

      if (!mongoose.Types.ObjectId.isValid(pid))
        throw new Error(`ID de produto inválido no índice ${i}`);

      const product = await ProductModel.findById(pid);
      if (!product) throw new Error(`Produto não encontrado: ${pid}`);

      const extrasTotal = item.extras?.reduce((sum, e) => sum + Number(e.price || 0), 0) || 0;
      const meatExtraPrice = item.meatCount && product.meatOptions
        ? (item.meatCount - 1) * (product.meatOptions.pricePerExtra || 0)
        : 0;

      const unitPrice = (product.price || 0) + extrasTotal + meatExtraPrice;
      if (unitPrice <= 0) throw new Error(`Preço inválido para ${product.name}`);

      const totalPrice = unitPrice * item.quantity;

      populatedProducts.push({
        productId: product._id,
        product_details: { name: product.name, image: product.image || [] },
        quantity: item.quantity,
        extras: item.extras || [],
        meatCount: item.meatCount || 1,
        observations: item.observations || "",
        unitPrice,
        totalPrice,
      });
    }

    const subTotalAmt = populatedProducts.reduce((sum, p) => sum + p.totalPrice, 0);

    // ===========================================================
    // TAXAS
    // ===========================================================
    const settings = await SettingsModel.findOne();
    const serviceFee = Number(settings?.serviceFee || 0);
    const deliveryFee = pickup ? 0 : Number(settings?.deliveryFee || 0);
    const totalAmt = subTotalAmt + serviceFee + deliveryFee;

    // ===========================================================
    // CRIAR PEDIDO
    // ===========================================================
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

    // ===========================================================
    // CRIAR SESSÃO STRIPE
    // ===========================================================
    const lineItems = [
      ...populatedProducts.map((item) => ({
        price_data: {
          currency: "brl",
          product_data: { name: item.product_details.name },
          unit_amount: Math.round(item.unitPrice * 100),
        },
        quantity: item.quantity,
      })),
    ];

    if (serviceFee > 0) {
      lineItems.push({
        price_data: {
          currency: "brl",
          product_data: { name: "Taxa de serviço" },
          unit_amount: Math.round(serviceFee * 100),
        },
        quantity: 1,
      });
    }

    if (deliveryFee > 0) {
      lineItems.push({
        price_data: {
          currency: "brl",
          product_data: { name: "Taxa de entrega" },
          unit_amount: Math.round(deliveryFee * 100),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/checkout`,
      metadata: { orderId: newOrder._id.toString() },
    });

    console.log("Sessão Stripe criada:", session.id);
    return res.status(201).json({ url: session.url });

  } catch (error) {
    console.error("Erro ao criar pedido:", error);
    return res.status(500).json({ error: error.message || "Erro interno ao criar pedido." });
  }
};



// ============================================================
// 🔍 Buscar todos os pedidos (admin)
// ============================================================
export const getAllOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find()
      .populate("userId", "name email phone")
      .populate("delivery_address")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);
    res.status(500).json({
      success: false,
      error: "Erro interno ao buscar pedidos.",
    });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    if (!req.user) {
      console.log("req.user:", req.user);

      return res.status(401).json({ message: "Usuário não autenticado." });
    }

    const orders = await OrderModel.find({ userId: req.user._id })
      .populate("delivery_address")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Erro ao buscar pedidos do usuário:", error);
    res.status(500).json({ error: "Erro interno ao buscar pedidos." });
  }
};

// 🔁 Atualizar status do pedido (apenas admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { order_status, payment_status } = req.body;

    // Buscar pedido
    const order = await OrderModel.findById(id);
    if (!order) {
      return res.status(404).json({ error: "Pedido não encontrado." });
    }

    // Atualizar campos se enviados
    if (order_status) order.order_status = order_status;
    if (payment_status) order.payment_status = payment_status;

    await order.save();

    // Popular dados do usuário e endereço antes de enviar
    const populatedOrder = await OrderModel.findById(order._id)
      .populate("userId", "name email phone")
      .populate("delivery_address");

    res.status(200).json(populatedOrder);
  } catch (error) {
    console.error("Erro ao atualizar pedido:", error);
    res.status(500).json({ error: "Erro interno ao atualizar pedido." });
  }
};

// ============================================================
// 🗑️ Excluir pedido (opcional — admin)
// ============================================================
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await OrderModel.findByIdAndDelete(id);

    if (!order)
      return res.status(404).json({ error: "Pedido não encontrado." });
    res.status(200).json({ message: "Pedido excluído com sucesso!" });
  } catch (error) {
    console.error("Erro ao excluir pedido:", error);
    res.status(500).json({ error: "Erro interno ao excluir pedido." });
  }
};

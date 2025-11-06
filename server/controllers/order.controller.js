import OrderModel from "../models/order.model.js";
import AddressModel from "../models/address.model.js";
import ProductModel from "../models/Product.model.js";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

// 🔹 Função auxiliar para gerar orderId legível
const generateOrderId = () => {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, "");
  return `ORD-${date}-${Math.floor(1000 + Math.random() * 9000)}`;
};

// ============================================================
// 📦 Criar pedido (simular pagamento)
// ============================================================
export const createOrder = async (req, res) => {
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

    if (!products || products.length === 0) {
      return res.status(400).json({ error: "Carrinho vazio." });
    }

    const userId = req.user?._id || req.body.userId;
    if (!userId) {
      return res.status(401).json({ error: "Usuário não autenticado." });
    }

    // 🔹 Evita duplicação: busca pedido igual criado nos últimos 15s
    const fifteenSecondsAgo = new Date(Date.now() - 15 * 1000);

    const existingOrder = await OrderModel.findOne({
      userId,
      totalAmt,
      "products.productId": { $in: products.map((p) => p.productId || p._id) },
      createdAt: { $gte: fifteenSecondsAgo },
    });

    if (existingOrder) {
      console.warn(
        `⚠️ Pedido duplicado detectado para usuário ${userId}: ${existingOrder._id}`
      );
      return res
        .status(409)
        .json({ message: "Pedido duplicado detectado. Aguarde alguns segundos." });
    }

    // 🔹 Buscar dados do endereço (se necessário)
    let addressData = null;
    if (!pickup && delivery_address) {
      addressData = await AddressModel.findById(delivery_address);
      if (!addressData) {
        return res
          .status(404)
          .json({ error: "Endereço de entrega não encontrado." });
      }
    }

    // 🔹 Validar e buscar produtos
    const populatedProducts = await Promise.all(
      products.map(async (item, index) => {
        const pid = item.productId || item._id;
        if (!pid || !mongoose.Types.ObjectId.isValid(pid)) {
          throw new Error(`ID de produto inválido no índice ${index}`);
        }

        const product = await ProductModel.findById(pid);
        if (!product) throw new Error(`Produto não encontrado: ${pid}`);

        // 🔹 Recalcula preço total para segurança
        const totalPrice =
          (product.price || 0) * (item.quantity || 1) +
          (item.extras?.reduce((sum, e) => sum + (e.price || 0), 0) || 0);

        return {
          productId: product._id,
          product_details: {
            name: product.name,
            image: product.image || [],
          },
          quantity: item.quantity,
          extras: item.extras || [],
          observations: item.observations || "",
          totalPrice,
        };
      })
    );

    // 🔹 Gera e salva pedido
    const orderId = generateOrderId();
    const newOrder = await OrderModel.create({
      userId,
      orderId,
      products: populatedProducts,
      delivery_address: delivery_address || null,
      pickup: pickup || false,
      subTotalAmt,
      totalAmt,
      serviceFee: serviceFee || 0,
      deliveryFee: deliveryFee || 0,
      payment_status: "pago",
      order_status: "Pendente",
      paymentId: uuidv4(),
      invoice_receipt: `RCPT-${uuidv4().slice(0, 8)}`,
    });

    res.status(201).json({
      message: "Pedido criado com sucesso (pagamento simulado)!",
      order: newOrder,
    });
  } catch (error) {
    console.error("Erro ao criar pedido:", error);
    res.status(500).json({ error: "Erro interno ao criar pedido." });
  }
};


// ============================================================
// 🔍 Buscar todos os pedidos (admin)
// ============================================================
export const getAllOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find()
      .populate("userId", "name email phone") // adiciona telefone
      .populate("delivery_address") // já pega todos os campos do endereço
      .sort({ createdAt: 1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);
    res.status(500).json({ error: "Erro interno ao buscar pedidos." });
  }
};

// ============================================================
// 🧾 Buscar pedidos de um usuário específico
// ============================================================
export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    // 🔒 Bloqueia acesso de outros usuários
    if (req.user._id.toString() !== userId && req.userRole !== "ADMIN") {
      return res.status(403).json({
        message:
          "Acesso negado. Você só pode visualizar seus próprios pedidos.",
        error: true,
        success: false,
      });
    }

    const orders = await OrderModel.find({ userId })
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

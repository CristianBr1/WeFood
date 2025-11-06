import CartProduct from "../models/cartProduct.model.js";
import mongoose from "mongoose";

// 🔹 Função auxiliar para calcular totalPrice
const calculateTotalPrice = (product, item) => {
  const extrasTotal = (item.extras || []).reduce(
    (sum, e) => sum + (e.price || 0),
    0
  );
  const meatExtraPrice =
    ((item.meatCount || 1) - 1) * (product.meatOptions?.pricePerExtra || 0);
  return (product.price + extrasTotal + meatExtraPrice) * (item.quantity || 1);
};

// -------------------------
// GET CART
// -------------------------
export const getCart = async (req, res) => {
  try {
    if (!req.user)
      return res.status(401).json({ message: "Usuário não autenticado" });

    const cart = await CartProduct.find({ userId: req.user._id }).populate(
      "productId"
    );

    const mappedCart = cart
      .filter((item) => item.productId)
      .map((item) => {
        const product = item.productId.toObject();
        return {
          // normalize frontend cart item shape: always include productId
          productId: product._id,
          ...product,
          quantity: item.quantity || 1,
          cartItemId: item._id,
          extras: item.extras || [], // Extras que o usuário selecionou
          image: product.image,
          originalExtras: product.extras || [], // 🔹 Todos os extras disponíveis do produto
          meatCount: item.meatCount || 1,
          observations: item.observations || "",
          totalPrice: calculateTotalPrice(product, item),
        };
      });

    res.json(mappedCart);
  } catch (err) {
    console.error("Erro ao buscar carrinho:", err);
    res
      .status(500)
      .json({ message: "Erro ao buscar carrinho", error: err.message });
  }
};

// -------------------------
// ADD TO CART
// -------------------------
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity, extras, meatCount, observations } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "ID de produto inválido" });
    }

    // 🔹 Verifica se o produto já está no carrinho do usuário
    let existing = await CartProduct.findOne({
      userId: req.user._id,
      productId,
    });

    if (existing) {
      existing.quantity += quantity || 1;
      existing.extras = extras || [];
      existing.meatCount = meatCount || 1;
      existing.observations = observations || "";
      await existing.save();

      const populated = await existing.populate("productId");
      const product = populated.productId.toObject();

      return res.status(200).json({
        ...product,
        quantity: populated.quantity,
        cartItemId: populated._id,
        extras: populated.extras,
        meatCount: populated.meatCount,
        observations: populated.observations,
        totalPrice: calculateTotalPrice(product, populated),
      });
    }

    // 🔹 Se o item ainda não existe, cria um novo registro
    const newItem = await CartProduct.create({
      userId: req.user._id,
      productId,
      quantity: quantity || 1,
      extras: extras || [],
      meatCount: meatCount || 1,
      observations: observations || "",
    });

    const populated = await newItem.populate("productId");
    const product = populated.productId.toObject();

    res.status(201).json({
      ...product,
      quantity: populated.quantity,
      cartItemId: populated._id,
      extras: populated.extras,
      meatCount: populated.meatCount,
      observations: populated.observations,
      totalPrice: calculateTotalPrice(product, populated),
    });
  } catch (err) {
    console.error("Erro ao adicionar ao carrinho:", err);
    res
      .status(400)
      .json({ message: "Erro ao adicionar item", error: err.message });
  }
};

// -------------------------
// UPDATE CART ITEM
// -------------------------
export const updateCartItem = async (req, res) => {
  try {
    const { quantity, extras, meatCount, observations } = req.body;

    const updated = await CartProduct.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { quantity, extras, meatCount, observations },
      { new: true }
    ).populate("productId");

    if (!updated)
      return res.status(404).json({ message: "Item não encontrado" });

    const product = updated.productId.toObject();

    res.json({
      ...product,
      quantity: updated.quantity,
      cartItemId: updated._id,
      extras: updated.extras,
      meatCount: updated.meatCount,
      observations: updated.observations,
      totalPrice: calculateTotalPrice(product, updated),
    });
  } catch (err) {
    console.error("Erro ao atualizar item:", err);
    res
      .status(400)
      .json({ message: "Erro ao atualizar item", error: err.message });
  }
};

// -------------------------
// REMOVE FROM CART
// -------------------------
export const removeFromCart = async (req, res) => {
  try {
    const removed = await CartProduct.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!removed)
      return res.status(404).json({ message: "Item não encontrado" });
    res.json({ message: "Item removido com sucesso" });
  } catch (err) {
    console.error("Erro ao remover item:", err);
    res
      .status(400)
      .json({ message: "Erro ao remover item", error: err.message });
  }
};

// -------------------------
// CLEAR CART
// -------------------------
export const clearCart = async (req, res) => {
  try {
    await CartProduct.deleteMany({ userId: req.user._id });
    res.json({ message: "Carrinho limpo" });
  } catch (err) {
    console.error("Erro ao limpar carrinho:", err);
    res
      .status(400)
      .json({ message: "Erro ao limpar carrinho", error: err.message });
  }
};

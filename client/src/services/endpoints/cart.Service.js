import { fetchData, deleteData, postData, putData } from "../apiService";

/** 🔹 Gera o payload padronizado do item do carrinho */
const buildCartPayload = (item) => ({
  productId: item.productId, // ID do produto é sempre obrigatório
  quantity: item.quantity || 1,
  extras: Array.isArray(item.extras)
    ? item.extras.map((extra) => ({
        name: extra.name,
        price: extra.price,
      }))
    : [],
  meatCount: item.meatCount || 1,
  observations: item.observations || "",
  price: item.price || 0, // mantém o preço base do produto
  totalPrice: item.totalPrice || 0, // útil para sincronizar total local
});

export const CartService = {
  /** 🔹 Buscar carrinho */
  fetchCart: () => fetchData("/cart"),

  /** 🔹 Adicionar item */
  addItem: (item) => postData("/cart", buildCartPayload(item)),

  /** 🔹 Atualizar item existente */
  updateItem: (cartItemId, item) =>
    putData(`/cart/${cartItemId}`, buildCartPayload(item)),

  /** 🔹 Remover item */
  removeItem: (cartItemId) => deleteData(`/cart/${cartItemId}`),

  /** 🔹 Limpar carrinho */
  clearCart: () => deleteData("/cart"),

  /** 🔹 Criar pedido (simulação de pagamento) */
  createOrder: (orderData) => postData("/orders/simulate-payment", orderData),
};

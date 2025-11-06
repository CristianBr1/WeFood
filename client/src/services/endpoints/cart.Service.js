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
  /** Buscar carrinho */
  fetchCart: (token) => fetchData("/cart", {}, token),

  /** Adicionar item */
  addItem: (item, token) => postData("/cart", buildCartPayload(item), token),

  /** Atualizar item */
  updateItem: (cartItemId, item, token) =>
    putData(`/cart/${cartItemId}`, buildCartPayload(item), token),

  /** Remover item */
  removeItem: (cartItemId, token) => deleteData(`/cart/${cartItemId}`, token),

  /** Limpar carrinho */
  clearCart: (token) => deleteData("/cart", token),

  /** Criar pedido (simulação de pagamento) */
  createOrder: (orderData, token) =>
    postData("/orders/simulate-payment", orderData, token),
};
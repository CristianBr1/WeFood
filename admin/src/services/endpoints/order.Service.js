import { fetchData, updateData, deleteData } from "../apiService";

export const OrderService = {
  // 🔹 Buscar todos os pedidos (admin) ou apenas do usuário logado
  getOrders: async () => {
    try {
      const data = await fetchData("/orders");
      // Backend retorna algo como { success: true, orders: [...] }
      return data.orders || data.data || [];
    } catch (err) {
      console.error("Erro ao buscar pedidos:", err);
      throw err;
    }
  },

  // 🔹 Deletar pedido (apenas admin)
  deleteOrder: async (id) => {
    if (!id) throw new Error("ID do pedido é obrigatório");
    return deleteData(`/orders/${id}`);
  },

  // 🔹 Atualizar status do pedido (apenas admin)
  updateOrderStatus: async (id, newStatus, paymentStatus = null) => {
    if (!id) throw new Error("ID do pedido é obrigatório");
    if (!newStatus) throw new Error("Novo status do pedido é obrigatório");

    const payload = { order_status: newStatus };
    if (paymentStatus) payload.payment_status = paymentStatus;

    return updateData(`/orders/${id}/status`, payload);
  },
};

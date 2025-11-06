import { fetchData, updateData, deleteData } from "../apiService";

export const OrderService = {
  getOrders: () => fetchData("/orders"),
  deleteOrder: (id) => deleteData(`/orders/${id}`),
  updateOrderStatus: (id, newStatus) =>
    updateData(`/orders/${id}/status`, { order_status: newStatus }),
};

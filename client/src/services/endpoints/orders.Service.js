import { fetchData } from "../apiService";

export const OrdersService = {
  getUserOrders: (userId, token) => fetchData(`/orders/user/${userId}`, {}, token),
};

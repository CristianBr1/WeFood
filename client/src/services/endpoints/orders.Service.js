import { postData, fetchData } from "../apiService";

export const OrdersService = {
  /** Obter pedidos do usuário logado */
  getUserOrders: () => fetchData("/orders/my-orders"),

  /**
   * Criar pedido (simulação de pagamento)
   * @param {Array} products - lista de produtos no carrinho
   * @param {Object} address - endereço de entrega (novo ou existente)
   * @param {boolean} pickup - se é retirada no local
   * @param {number} subTotalAmt
   * @param {number} totalAmt
   * @param {number} serviceFee
   * @param {number} deliveryFee
   */
  createOrder: async ({
    products,
    address,
    pickup = false,
    subTotalAmt,
    totalAmt,
    serviceFee = 0,
    deliveryFee = 0,
  }) => {
    const payload = {
      products,
      delivery_address: address, // pode ser ID ou objeto completo
      pickup,
      subTotalAmt,
      totalAmt,
      serviceFee,
      deliveryFee,
    };
    return await postData("/orders/simulate-payment", payload);
  },
};

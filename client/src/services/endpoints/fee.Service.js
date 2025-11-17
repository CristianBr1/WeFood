import { fetchData } from "../apiService";

export const FeeService = {
  /**
   * 🔹 Buscar taxas do backend
   * Sempre retorna números válidos com fallback seguro
   */
  getFees: async () => {
    try {
      const data = await fetchData("/settings");

      const serviceFee = Number(data?.serviceFee ?? 0);
      const deliveryFee = Number(data?.deliveryFee ?? 0);

      return {
        serviceFee: isNaN(serviceFee) ? 0 : serviceFee,
        deliveryFee: isNaN(deliveryFee) ? 0 : deliveryFee,
      };
    } catch (error) {
      console.error("Erro ao carregar taxas:", error);

      // fallback seguro
      return {
        serviceFee: 0.99,
        deliveryFee: 4.99,
      };
    }
  },

  /**
   * 🔹 Calcular taxas aplicáveis com base no tipo de pedido
   * @param {boolean} pickup - true se for retirada no local
   * @returns {object} serviceFee, deliveryFee e totalFees
   */
  calculate: async (pickup = false) => {
    const { serviceFee, deliveryFee } = await FeeService.getFees();

    const appliedDeliveryFee = pickup ? 0 : deliveryFee;

    return {
      serviceFee,
      deliveryFee: appliedDeliveryFee,
      totalFees: serviceFee + appliedDeliveryFee,
    };
  },
};

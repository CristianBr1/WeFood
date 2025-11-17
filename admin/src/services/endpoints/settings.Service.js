import { fetchData, updateData } from "../apiService";

export const SettingsService = {
  /**
   * 🔹 Buscar configurações atuais do restaurante
   */
  getSettings: async () => {
    try {
      const data = await fetchData("/settings");
      return data || {};
    } catch (err) {
      console.error("Erro ao buscar configurações:", err);
      throw err;
    }
  },

  /**
   * 🔹 Atualizar configurações
   * payload pode conter: serviceFee, deliveryFee, minOrderAmount, restaurantOpen
   */
  updateSettings: async (payload) => {
    if (!payload || typeof payload !== "object") {
      throw new Error("Payload inválido para atualizar configurações");
    }

    try {
      const data = await updateData("/settings", payload);
      return data;
    } catch (err) {
      console.error("Erro ao atualizar configurações:", err);
      throw err;
    }
  },
};

import { fetchData, deleteData } from "../apiService";
import { uploadFormData } from "../uploadService";

export const StoreManageService = {
  // 🔹 Buscar dados da loja (nome + logo)
  getStore: async () => {
    const data = await fetchData("/store");
    return data || {};
  },

  // 🔹 Atualizar dados da loja (nome e logo)
  updateStore: async (name, logoFile) => {
    if (!name && !logoFile)
      throw new Error("Informe pelo menos o nome ou o logo.");

    return uploadFormData({
      endpoint: "/store",
      fields: { name },
      file: logoFile || null,
      fileKey: "logo",
      method: "POST", // pode ser PUT dependendo da sua rota
    });
  },

  // 🔹 Deletar logo
  deleteLogo: async () => {
    return deleteData("/store/logo");
  },
};

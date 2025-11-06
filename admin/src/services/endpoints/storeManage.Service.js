import { fetchData, deleteData } from "../apiService";
import { uploadFormData } from "../uploadService";

export const StoreManageService = {
  // 🔹 Buscar dados da loja (nome + logo)
  getStore: () => fetchData("/store"),

  // 🔹 Atualizar dados da loja (nome e logo)
  updateStore: (name, logoFile) =>
    uploadFormData({
      endpoint: "/store",
      fields: { name },
      file: logoFile,
      fileKey: "logo",
      method: "POST", // ou PUT se preferir
    }),

  // 🔹 Deletar logo
  deleteLogo: () => deleteData("/store/logo"),
};

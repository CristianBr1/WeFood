import { fetchData, deleteData } from "../apiService";
import { uploadFormData } from "../uploadService";

export const BannerService = {
  // 🔹 Retorna todos os banners
  getBanners: async () => {
    const data = await fetchData("/banners");
    return Array.isArray(data) ? data : [];
  },

  // 🔹 Remove um banner pelo ID
  deleteBanner: (id) => {
    if (!id) throw new Error("ID do banner é obrigatório");
    return deleteData(`/banners/${id}`);
  },

  // 🔹 Cria um novo banner
  createBanner: (title, image) => {
    if (!title) throw new Error("Título do banner é obrigatório");
    return uploadFormData({
      endpoint: "/banners",
      fields: { title },
      file: image,
      fileKey: "image",
      method: "POST",
    });
  },

  // 🔹 Atualiza um banner existente
  updateBanner: (id, title, image) => {
    if (!id) throw new Error("ID do banner é obrigatório");
    if (!title) throw new Error("Título do banner é obrigatório");
    return uploadFormData({
      endpoint: `/banners/${id}`,
      fields: { title },
      file: image,
      fileKey: "image",
      method: "PUT",
    });
  },
};

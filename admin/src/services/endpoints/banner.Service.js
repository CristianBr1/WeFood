import { fetchData, deleteData } from "../apiService";
import { uploadFormData } from "../uploadService";

export const BannerService = {
  // Retorna todos os banners
  getBanners: () => fetchData("/banners"),

  // Remove um banner pelo ID
  deleteBanner: (id) => deleteData(`/banners/${id}`),

  // Cria um novo banner
  createBanner: (title, image) =>
    uploadFormData({
      endpoint: "/banners",
      fields: { title },
      file: image,
      fileKey: "image",
      method: "POST",
    }),

  // Atualiza um banner existente
  updateBanner: (id, title, image) =>
    uploadFormData({
      endpoint: `/banners/${id}`,
      fields: { title },
      file: image,
      fileKey: "image",
      method: "PUT",
    }),
};

import { fetchData, deleteData } from "../apiService";
import { uploadFormData } from "../uploadService";

export const CategoryService = {
  // 🔹 Buscar todas as categorias
  getCategories: async () => {
    const data = await fetchData("/categories");
    return Array.isArray(data) ? data : [];
  },

  // 🔹 Deletar categoria pelo ID
  deleteCategory: (id) => {
    if (!id) throw new Error("ID da categoria é obrigatório");
    return deleteData(`/categories/${id}`);
  },

  // 🔹 Criar nova categoria
  createCategory: (name, image) => {
    if (!name) throw new Error("Nome da categoria é obrigatório");
    return uploadFormData({
      endpoint: "/categories",
      fields: { name },
      file: image,
      fileKey: "image",
      method: "POST",
    });
  },

  // 🔹 Atualizar categoria existente
  updateCategory: (id, name, image) => {
    if (!id) throw new Error("ID da categoria é obrigatório");
    if (!name) throw new Error("Nome da categoria é obrigatório");
    return uploadFormData({
      endpoint: `/categories/${id}`,
      fields: { name },
      file: image,
      fileKey: "image",
      method: "PUT",
    });
  },
};

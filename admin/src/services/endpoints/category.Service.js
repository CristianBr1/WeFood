import { fetchData, deleteData } from "../apiService";
import { uploadFormData } from "../uploadService";

export const CategoryService = {
  // Buscar todas as categorias
  getCategories: () => fetchData("/categories"),

  // Deletar categoria pelo ID
  deleteCategory: (id) => deleteData(`/categories/${id}`),

  // Criar nova categoria
  createCategory: (name, image) =>
    uploadFormData({
      endpoint: "/categories",
      fields: { name },
      file: image,
      fileKey: "image",
      method: "POST",
    }),

  // Atualizar categoria existente
  updateCategory: (id, name, image) =>
    uploadFormData({
      endpoint: `/categories/${id}`,
      fields: { name },
      file: image,
      fileKey: "image",
      method: "PUT",
    }),
};

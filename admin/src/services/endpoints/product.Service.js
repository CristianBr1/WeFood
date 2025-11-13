import { fetchData, deleteData } from "../apiService";
import { uploadFormData } from "../uploadService";

export const ProductService = {
  // 🔹 Buscar todos os produtos
  getProducts: async () => {
    const data = await fetchData("/products");
    return data || [];
  },

  // 🔹 Deletar produto pelo ID
  deleteProduct: async (id) => {
    if (!id) throw new Error("ID do produto é obrigatório");
    return deleteData(`/products/${id}`);
  },

  // 🔹 Criar novo produto
  createProduct: async (data, image) => {
    const fields = {
      ...data,
      description: data.description || "",
      extras: JSON.stringify(data.extras || []),
      meatOptions: data.meatOptions
        ? JSON.stringify(data.meatOptions)
        : JSON.stringify([]),
    };

    return uploadFormData({
      endpoint: "/products",
      fields,
      file: image || null,
      fileKey: "image",
      method: "POST",
    });
  },

  // 🔹 Atualizar produto existente
  updateProduct: async (id, data, image) => {
    if (!id) throw new Error("ID do produto é obrigatório");

    const fields = {
      ...data,
      description: data.description || "",
      extras: JSON.stringify(data.extras || []),
      meatOptions: data.meatOptions
        ? JSON.stringify(data.meatOptions)
        : JSON.stringify([]),
    };

    return uploadFormData({
      endpoint: `/products/${id}`,
      fields,
      file: image || null,
      fileKey: "image",
      method: "PUT",
    });
  },
};

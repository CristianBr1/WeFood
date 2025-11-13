import { fetchData } from "../apiService";

/** ====================
 * HomeService
 * ==================== */
export const HomeService = {
  /** 🔹 Retorna todas as categorias */
  getCategories: () => fetchData("/categories"),

  /** 🔹 Retorna produtos de uma categoria específica */
  getProductsByCategory: (categoryId, extraParams = {}) =>
    fetchData("/products", { categoryId, ...extraParams }),

  /** 🔹 Retorna todos os produtos (sem filtro de categoria) */
  getAllProducts: (extraParams = {}) => fetchData("/products", extraParams),

  /** 🔹 Retorna detalhes de um produto específico */
  getProductById: (id) => fetchData(`/products/${id}`),
};

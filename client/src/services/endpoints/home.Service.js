import { fetchData } from "../apiService";

/** ====================
 * HomeService
 * ==================== */
export const HomeService = {
  /**
   * Retorna todas as categorias
   * @param {string} token opcional
   */
  getCategories: (token) => fetchData("/categories", {}, token),

  /**
   * Retorna produtos de uma categoria específica
   * @param {string} categoryId
   * @param {object} extraParams parâmetros adicionais (ex.: filtros, paginação)
   * @param {string} token opcional
   */
  getProductsByCategory: (categoryId, extraParams = {}, token) =>
    fetchData("/products", { categoryId, ...extraParams }, token),

  /**
   * Retorna todos os produtos (sem filtrar por categoria)
   * @param {object} extraParams parâmetros adicionais (ex.: filtros, paginação)
   * @param {string} token opcional
   */
  getAllProducts: (extraParams = {}, token) =>
    fetchData("/products", { ...extraParams }, token),

  /**
   * Retorna detalhes de um produto específico
   * @param {string} id
   * @param {string} token opcional
   */
  getProductById: (id, token) => fetchData(`/products/${id}`, {}, token),
};
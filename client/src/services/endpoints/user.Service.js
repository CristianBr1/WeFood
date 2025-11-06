import { fetchData, putData } from "../apiService";

/** ====================
 * UserService
 * ==================== */
export const UserService = {
  /**
   * 🔹 Retorna o perfil do usuário logado
   * @param {string} token
   */
  getProfile: (token) => fetchData("/users/profile", {}, token),

  /**
   * 🔹 Atualiza dados do perfil do usuário
   * @param {object} payload
   * @param {string} token
   */
  updateProfile: (payload, token) => putData("/users/profile", payload, token),
};

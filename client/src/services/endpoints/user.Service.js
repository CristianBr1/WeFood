import { fetchData, postData } from "../apiService";

/** ====================
 *  👤 UserService
 * ==================== */
export const UserService = {
  /**
   * 🔹 Obter o perfil do usuário logado
   * Usa cookie httpOnly automaticamente
   */
  getProfile: () => fetchData("/auth/check"),

  /**
   * 🔹 Atualizar nome, email ou mobile
   * (necessita que você CRIE a rota PUT /users/profile)
   */
  updateProfile: (payload) => postData("/users/profile?_method=PUT", payload),

  /**
   * 🔹 Atualizar avatar do usuário
   * (necessita rota POST /users/profile/avatar)
   */
  updateAvatar: (formData) => postData("/users/profile/avatar", formData, true), // true = multipart/form-data

  /**
   * 🔹 Atualização parcial via PATCH
   * (também exige PATCH /users/profile)
   */
  patchProfile: (payload) => postData("/users/profile?_method=PATCH", payload),
};

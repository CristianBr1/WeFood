import { fetchData, putData, postData } from "../apiService";
import { uploadFormData } from "../uploadService";

/** ====================
 *  👤 UserService
 * ==================== */
export const UserService = {
  /**
   * 🔹 Retorna o perfil do usuário logado
   * @param {string} [token]
   */
  getProfile: (token) => fetchData("/users/profile", {}, token),

  /**
   * 🔹 Atualiza dados do perfil do usuário
   * @param {object} payload - Exemplo: { name, mobile }
   * @param {string} [token]
   */
  updateProfile: (payload, token) => putData("/users/profile", payload, token),

  /**
   * 🔹 Atualiza avatar do usuário
   * @param {FormData} formData - Deve conter { avatar: File }
   * @param {string} [token]
   */
  updateAvatar: (formData, token) =>
    uploadFormData("/users/profile/avatar", formData, token),

  /**
   * 🔹 Atualização parcial (patch) — útil para mudar apenas um campo
   * @param {object} payload - Ex: { mobile: "99999-0000" }
   * @param {string} [token]
   */
  patchProfile: (payload, token) =>
    postData("/users/profile?_method=PATCH", payload, token),
};

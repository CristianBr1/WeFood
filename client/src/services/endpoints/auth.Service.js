import { fetchData, postData } from "../apiService";

/** =====================================
 * 🔐 AuthService — autenticação via cookies httpOnly
 * ===================================== */
export const AuthService = {
  /**
   * 🔹 Registrar novo usuário
   * @param {string} name
   * @param {string} email
   * @param {string} password
   */
  register: async (name, email, password) => {
    const payload = { name, email, password };
    return await postData("/auth/register", payload);
  },

  /**
   * 🔹 Login do usuário
   * @param {string} email
   * @param {string} password
   */
  login: async (email, password) => {
    const payload = { email, password };
    return await postData("/auth/login", payload);
  },

  /**
   * 🔹 Logout (limpa cookie httpOnly no servidor)
   */
  logout: async () => {
    return await postData("/auth/logout");
  },

  /**
   * 🔹 Obter perfil do usuário logado
   * (usa cookie httpOnly automaticamente)
   */
  getProfile: async () => {
    return await fetchData("/users/profile");
  },

  /**
   * 🔹 Esqueci minha senha — envia OTP por e-mail
   * @param {string} email
   */
  sendResetPasswordOTP: async (email) => {
    return await postData("/auth/forgot-password", { email });
  },

  /**
   * 🔹 Redefinir senha usando OTP
   * @param {string} email
   * @param {string} otp
   * @param {string} newPassword
   */
  resetPassword: async (email, otp, newPassword) => {
    return await postData("/auth/reset-password", {
      email,
      otp,
      newPassword,
    });
  },
};

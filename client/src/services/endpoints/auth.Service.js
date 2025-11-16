import { fetchData, postData } from "../apiService";

/** =====================================
 * 🔐 AuthService — autenticação via cookies httpOnly
 * ===================================== */
export const AuthService = {
  /**
   * 🔹 Registrar novo usuário
   */
  register: async (name, email, password) => {
    const payload = { name, email, password };
    return await postData("/auth/register", payload);
  },

  /**
   * 🔹 Login normal
   */
  login: async (email, password) => {
    const payload = { email, password };
    return await postData("/auth/login", payload);
  },

  /**
   * 🔹 Login via Google OAuth
   */
  googleLogin: async (credential) => {
    return await postData("/auth/google", { credential });
  },

  /**
   * 🔹 Logout — limpa cookie no backend
   */
  logout: async () => {
    return await postData("/auth/logout");
  },

  /**
   * 🔹 Obtém o usuário logado via cookie httpOnly
   * (rota real do backend)
   */
  getProfile: async () => {
    return await fetchData("/auth/check");
  },

  /**
   * 🔹 Envia OTP para recuperar senha
   */
  sendResetPasswordOTP: async (email) => {
    return await postData("/auth/forgot-password", { email });
  },

  /**
   * 🔹 Redefine a senha usando OTP
   */
  resetPassword: async (email, otp, newPassword) => {
    return await postData("/auth/reset-password", {
      email,
      otp,
      newPassword,
    });
  },
};

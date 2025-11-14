import { postData, fetchData } from "../apiService";

export const AuthService = {
  /**
   * 🔹 Login do usuário
   */
  login: async (email, password) => {
    try {
      const data = await postData("/auth/login", {
        email: email.trim().toLowerCase(),
        password: password.trim(),
      });
      if (!data?.user) throw new Error("Resposta inválida do servidor");
      return data.user;
    } catch (err) {
      console.error("Erro no login:", err.response?.data || err.message || err);
      return null;
    }
  },

  /**
   * 🔹 Logout
   */
  logout: async () => {
    try {
      await postData("/auth/logout");
      return true;
    } catch (err) {
      console.warn("Erro no logout:", err.response?.data || err.message || err);
      return false;
    }
  },

  /**
   * 🔹 Obtém perfil do usuário logado
   */
  getProfile: async () => {
    try {
      const data = await fetchData("/users/profile");
      return data.user || null;
    } catch (err) {
      console.warn("Não há usuário logado:", err);
      return null;
    }
  },
};

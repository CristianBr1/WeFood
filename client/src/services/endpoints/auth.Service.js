import api from "../api";

const handleError = (err, endpoint) => {
  const message = err.response?.data?.message || err.message || err;
  console.error(`Erro no ${endpoint}:`, message);
  throw err;
};

export const AuthService = {
  login: async (email, password) => {
    try {
      const res = await api.post("/auth/login", {
        email: email.trim().toLowerCase(),
        password: password.trim(),
      });
      if (res.data?.user && res.data?.token) return res.data;
      throw new Error("Login falhou");
    } catch (err) {
      handleError(err, "login");
    }
  },

  register: async (name, email, password) => {
    try {
      const res = await api.post("/auth/register", {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password.trim(),
      });
      if (res.data?.user && res.data?.token) return res.data;
      throw new Error("Registro falhou");
    } catch (err) {
      handleError(err, "register");
    }
  },

  logout: async (token) => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await api.post("/auth/logout", {}, { headers });
    } catch (err) {
      handleError(err, "logout");
    }
  },
};
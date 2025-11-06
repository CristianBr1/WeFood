import api from "./api";

export const login = async (email, password) => {
  try {
    const { data } = await api.post("/auth/login", {
      email: email.trim().toLowerCase(),
      password: password.trim(),
    });

    if (!data?.user || !data?.token) {
      throw new Error("Resposta inválida do servidor");
    }

    return { ...data.user, token: data.token };
  } catch (err) {
    console.error("Erro no login:", err.response?.data || err.message);
    throw err;
  }
};

export const logout = async () => {
  try {
    await api.post("/auth/logout");
  } catch (err) {
    console.warn("Erro no logout:", err.response?.data || err.message);
  }
};

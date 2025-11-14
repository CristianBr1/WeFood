import { fetchData, postData } from "../apiService";

export const AuthService = {
  getProfile: async () => {
    const data = await fetchData("/auth/check");
    return data.user || null;
  },

  login: async (email, password) => {
    const data = await postData("/auth/login", { email, password });
    return data.user;
  },

  logout: async () => {
    await postData("/auth/logout");
  },
};

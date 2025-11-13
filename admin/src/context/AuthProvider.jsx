import { createContext, useState, useEffect } from "react";
import { AuthService } from "../services/AuthService";
import Loading from "../components/Loading";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Checa sessão no backend ao carregar o app
  const checkSession = async () => {
    setLoading(true);
    const currentUser = await AuthService.getProfile();
    setUser(currentUser);
    setLoading(false);
  };

  useEffect(() => {
    checkSession();
  }, []);

  // 🔹 Login
  const login = async (email, password) => {
    const loggedUser = await AuthService.login(email, password);
    setUser(loggedUser);
    return loggedUser;
  };

  // 🔹 Logout
  const logout = async () => {
    await AuthService.logout();
    setUser(null);
  };

  // 🔹 Atualiza campos do usuário no frontend
  const updateUser = (fields) => {
    setUser((prev) => ({ ...prev, ...fields }));
  };

  if (loading) return <Loading text="Carregando sessão..." />;

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

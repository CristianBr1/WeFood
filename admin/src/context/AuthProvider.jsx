import { createContext, useState, useEffect } from "react";
import { AuthService } from "../services/endpoints/auth.Service";
import Loading from "../components/Loading";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔍 Verifica sessão SOMENTE se existir token/cookie
  const checkSession = async () => {
    try {
      // 🔹 antes de tentar buscar /profile, verificar se existe sessão
      const hasSession = await AuthService.hasSession(); // vamos criar isso
      if (!hasSession) {
        setUser(null);
        setLoading(false);
        return;
      }

      const currentUser = await AuthService.getProfile();
      setUser(currentUser);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  const login = async (email, password) => {
    const loggedUser = await AuthService.login(email, password);
    setUser(loggedUser);
    return loggedUser;
  };

  const logout = async () => {
    await AuthService.logout();
    setUser(null);
  };

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

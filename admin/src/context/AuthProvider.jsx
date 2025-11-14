// AuthProvider.jsx
import { createContext, useState, useEffect } from "react";
import { AuthService } from "../services/endpoints/auth.Service";
import Loading from "../components/Loading";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkSession = async () => {
    setLoading(true);
    try {
      const currentUser = await AuthService.getProfile();
      setUser(currentUser);
    } catch {
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

  if (loading) return <Loading text="Verificando sessão..." />;

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

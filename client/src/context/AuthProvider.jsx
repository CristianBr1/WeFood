import { createContext, useContext, useState, useEffect } from "react";
import { AuthService } from "../services/endpoints/auth.Service";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // carregamento inicial

  /** LOGIN */
  const login = async (email, password) => {
    try {
      const res = await AuthService.login(email, password);
      if (res?.user) {
        setUser(res.user);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Erro no login:", err);
      return false;
    }
  };

  /** REGISTRO */
  const register = async (name, email, password) => {
    try {
      const res = await AuthService.register(name, email, password);
      if (res?.user) {
        setUser(res.user);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Erro no registro:", err);
      return false;
    }
  };

  /** LOGOUT */
  const logout = async () => {
    try {
      await AuthService.logout(); // limpa cookie no servidor
    } catch (err) {
      console.warn("Erro ao fazer logout:", err);
    } finally {
      setUser(null);
    }
  };

  /** AUTOLOGIN via cookie httpOnly */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await AuthService.getProfile(); // cookie enviado automaticamente
        if (res?.user) setUser(res.user);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
export const useAuthContext = () => useContext(AuthContext);

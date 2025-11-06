// src/context/AuthProvider.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { AuthService } from "../services/endpoints/auth.Service";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      // Normaliza estrutura
      return parsed?.user
        ? { ...parsed.user, token: parsed.token }
        : parsed;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);
  const [searchItem, setSearchItem] = useState("");
  const token = user?.token;

  // =============== LOGIN ===============
  const login = async (email, password) => {
    try {
      const newUser = await AuthService.login(email, password);
      if (!newUser) throw new Error("Falha no login");

      const normalized = newUser?.user
        ? { ...newUser.user, token: newUser.token }
        : newUser;

      setUser(normalized);
      localStorage.setItem("user", JSON.stringify(normalized));
      return true;
    } catch (err) {
      console.error("Erro no login:", err);
      return false;
    }
  };

  // =============== REGISTRO ===============
  const register = async (name, email, password) => {
    try {
      const newUser = await AuthService.register(name, email, password);
      if (!newUser) throw new Error("Falha no registro");

      const normalized = newUser?.user
        ? { ...newUser.user, token: newUser.token }
        : newUser;

      setUser(normalized);
      localStorage.setItem("user", JSON.stringify(normalized));
      return true;
    } catch (err) {
      console.error("Erro no registro:", err);
      return false;
    }
  };

  // =============== LOGOUT ===============
  const logout = async () => {
    try {
      if (token) await AuthService.logout(token);
    } catch (err) {
      console.warn("Erro ao fazer logout:", err);
    } finally {
      setUser(null);
      setSearchItem("");
      localStorage.removeItem("user");
    }
  };

  // =============== AUTOLOGIN (verificação) ===============
  useEffect(() => {
    const verifySession = async () => {
      try {
        const saved = localStorage.getItem("user");
        if (!saved) return;

        const parsed = JSON.parse(saved);
        const normalized = parsed?.user
          ? { ...parsed.user, token: parsed.token }
          : parsed;

        // opcional: checa perfil
        if (AuthService.getProfile) {
          const profile = await AuthService.getProfile(normalized.token);
          setUser({ ...profile, token: normalized.token });
        } else {
          setUser(normalized);
        }
      } catch (err) {
        console.error("Sessão inválida:", err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    verifySession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        loading,
        searchItem,
        setSearchItem,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

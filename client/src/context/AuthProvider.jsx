import { createContext, useContext, useState, useEffect } from "react";
import { AuthService } from "../services/endpoints/auth.Service";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /** LOGIN normal */
  const login = async (email, password) => {
    try {
      const res = await AuthService.login(email, password);
      if (res?.user) {
        setUser(res.user);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  /** LOGIN via Google OAuth */
  const loginWithGoogle = async (credential) => {
    try {
      const res = await AuthService.googleLogin(credential); // <-- CORRIGIDO
      if (res?.user) {
        setUser(res.user);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Erro no Google OAuth:", err);
      return false;
    }
  };

  /** LOGOUT */
  const logout = async () => {
    try {
      await AuthService.logout();
    } finally {
      await checkAuth(); // força atualizar usuário
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

  /** CHECA SE HÁ USUÁRIO LOGADO via cookie HttpOnly */
  const checkAuth = async () => {
    try {
      const res = await AuthService.getProfile();
      if (res?.user) setUser(res.user);
      else setUser(null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  /** AUTOLOGIN no mount */
  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        login,
        loginWithGoogle,
        logout,
        register,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuthContext = () => useContext(AuthContext);

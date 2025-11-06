import { useState, useEffect } from "react";
import AuthContext from "./AuthContext";
import {
  login as loginService,
  logout as logoutService,
} from "../services/authService";
import Loading from "../components/Loading";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const loggedUser = await loginService(email, password);
      setUser(loggedUser);
      localStorage.setItem("user", JSON.stringify(loggedUser));
      return loggedUser;
    } catch (err) {
      console.error("Erro no login:", err.message);
      return null;
    }
  };

  const logout = async () => {
    try {
      await logoutService();
    } finally {
      setUser(null);
      localStorage.removeItem("user");
    }
  };

  const updateUser = (updatedFields) => {
    const updatedUser = { ...user, ...updatedFields };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  if (loading) return <Loading text="Carregando sessão..." />;

  return (
    <AuthContext.Provider
      value={{ user, login, logout, updateUser, loading, setLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

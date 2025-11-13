import { useAuthContext } from "../context/AuthProvider";
import { Navigate } from "react-router-dom";
import Loading from "./Loading";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuthContext();

  // 🔹 Enquanto o contexto verifica o cookie HTTP-only
  if (loading) return <Loading text="Verificando sessão..." />;

  // 🔹 Se não estiver logado, redireciona para login
  if (!user) return <Navigate to="/login" replace />;

  // 🔹 Usuário logado, renderiza rota
  return children;
};

export default ProtectedRoute;

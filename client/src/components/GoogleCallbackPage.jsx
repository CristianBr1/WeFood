import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthProvider";

const GoogleCallbackPage = () => {
  const { checkAuth } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      await checkAuth(); // atualiza o state do usuário
      navigate("/");     // redireciona se login bem-sucedido
    };
    verify();
  }, [checkAuth, navigate]);

  return <div>Processando login do Google...</div>;
};

export default GoogleCallbackPage;

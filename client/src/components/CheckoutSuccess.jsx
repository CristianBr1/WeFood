import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCartContext } from "../hooks/useCartContext";

export default function CheckoutSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCartContext();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sessionId = params.get("session_id");

    if (sessionId) {
      clearCart();
      console.log("Carrinho limpo, Stripe session:", sessionId);
    }

    // Redirecionar para a home depois de 3s (opcional)
    const timer = setTimeout(() => navigate("/"), 3000);
    return () => clearTimeout(timer);
  }, [location, clearCart, navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Pagamento concluído!</h1>
      <p>Obrigado pela sua compra.</p>
    </div>
  );
}

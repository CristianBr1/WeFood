import { useState, useEffect, useContext } from "react";
import { Box, Button, Typography, Divider, IconButton } from "@mui/material";
import { Trash2 } from "lucide-react";
import { ThemeContext } from "../context/ThemeProvider";
import Navbar from "../components/Navbar";
import CartProductModal from "../components/CartProductModal";
import { useCartContext } from "../hooks/useCartContext";
import { useAddressContext } from "../hooks/useAddressContext";
import { useAuthContext } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";

import emptyCartImg from "../assets/images/cesta-vazia.png";
import { getImageUrl } from "../services/config";
import { FeeService } from "../services/endpoints/fee.Service";

const Cart = () => {
  const { darkMode } = useContext(ThemeContext);
  const { cart, loading, updateItem, removeItem } = useCartContext();
  const { addresses: contextAddresses } = useAddressContext();
  const { user, loading: authLoading } = useAuthContext();
  const navigate = useNavigate();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [pickup, setPickup] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  // ===========================
  // TAXAS DO BACKEND
  // ===========================
  const [fees, setFees] = useState({ serviceFee: 0, deliveryFee: 0 });

  useEffect(() => {
    const loadFees = async () => {
      try {
        const data = await FeeService.getFees();
        setFees(data);
      } catch (error) {
        console.error("Erro ao carregar taxas:", error);
      }
    };
    loadFees();
  }, []);

  // ===========================
  // ENDEREÇOS
  // ===========================
  useEffect(() => {
    if (contextAddresses.length > 0 && !selectedAddress) {
      setSelectedAddress(contextAddresses[0]);
    }
  }, [contextAddresses, selectedAddress]);

  // ===========================
  // CÁLCULOS
  // ===========================
  const subtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const serviceFee = fees.serviceFee ?? 0;
  const deliveryFee = pickup ? 0 : fees.deliveryFee ?? 0;
  const total = subtotal + serviceFee + deliveryFee;

  // ===========================
  // ALTERAR QUANTIDADE
  // ===========================
  const handleQuantityChange = (item, delta) => {
    const newQuantity = Math.max(1, item.quantity + delta);
    updateItem(item.cartItemId, { quantity: newQuantity });
  };

  // ===========================
  // CHECKOUT
  // ===========================
  const handleGoToCheckout = () => {
    if (authLoading) return;

    if (!user) return navigate("/login");

    navigate("/checkout", { state: { pickup, address: selectedAddress } });
  };

  if (loading || authLoading) {
    return (
      <Typography sx={{ textAlign: "center", mt: 4 }}>Carregando...</Typography>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: darkMode ? "#1a1a1a" : "#f5f5f5",
        color: darkMode ? "#fff" : "#222",
      }}
    >
      <Navbar />

      <Box
        sx={{
          maxWidth: 1200,
          mx: "auto",
          px: 3,
          py: 4,
          gap: 4,
          mt: 10,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        {/* LISTA DE PRODUTOS */}
        <Box sx={{ flex: 2, display: "flex", flexDirection: "column", gap: 3 }}>
          <Typography variant="h5" sx={{ textAlign: "center" }}>
            Confira seus produtos
          </Typography>

          {cart.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                py: 4,
                gap: 2,
              }}
            >
              <img
                src={emptyCartImg}
                alt="Carrinho vazio"
                style={{ width: 200, opacity: 0.8 }}
              />
              <Typography variant="h6" sx={{ opacity: 0.7 }}>
                Seu carrinho está vazio
              </Typography>

              <Button
                variant="contained"
                color="success"
                onClick={() => navigate("/")}
              >
                Voltar às compras
              </Button>
            </Box>
          ) : (
            cart.map((item) => (
              <Box
                key={item.cartItemId}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: darkMode ? "#222" : "#fff",
                  alignItems: "center",
                  flexWrap: "wrap",
                  cursor: "pointer",
                }}
                onClick={() => setSelectedProduct(item)}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <img
                    src={
                      item.image ? getImageUrl(item.image) : "/placeholder.jpg"
                    }
                    alt={item.name}
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 8,
                      objectFit: "cover",
                    }}
                  />
                  <Box sx={{ minWidth: 150 }}>
                    <Typography>{item.name}</Typography>

                    {item.extras?.length > 0 && (
                      <Typography variant="body2">
                        Extras: {item.extras.map((e) => e.name).join(", ")}
                      </Typography>
                    )}

                    {item.observations && (
                      <Typography variant="body2">
                        Obs: {item.observations}
                      </Typography>
                    )}

                    <Typography variant="body2">
                      Unitário: R$
                      {(
                        item.unitPrice ?? item.totalPrice / item.quantity
                      ).toFixed(2)}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuantityChange(item, -1);
                    }}
                  >
                    −
                  </Button>

                  <Typography>{item.quantity}</Typography>

                  <Button
                    variant="outlined"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuantityChange(item, 1);
                    }}
                  >
                    +
                  </Button>

                  <IconButton
                    sx={{ color: "red" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeItem(item.cartItemId);
                    }}
                  >
                    <Trash2 size={18} />
                  </IconButton>

                  <Typography>R$ {item.totalPrice.toFixed(2)}</Typography>
                </Box>
              </Box>
            ))
          )}
        </Box>

        {/* RESUMO / TAXAS */}
        {/* RESUMO / TAXAS */}
        {cart.length > 0 && (
          <Box
            sx={{
              flex: 1,
              p: 2,
              borderRadius: 2,
              backgroundColor: darkMode ? "#222" : "#fff",
              display: "flex",
              flexDirection: "column",
              gap: 2,
              alignItems: "center",
            }}
          >
            <Typography variant="h5">Resumo da compra</Typography>
            <Divider sx={{ width: "100%" }} />

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Typography>Subtotal</Typography>
              <Typography>R$ {subtotal.toFixed(2)}</Typography>
            </Box>

            {serviceFee > 0 && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Typography>Taxa de serviço</Typography>
                <Typography>R$ {serviceFee.toFixed(2)}</Typography>
              </Box>
            )}

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Typography>Taxa de entrega</Typography>
              <Typography>
                {deliveryFee === 0
                  ? "Entrega grátis"
                  : `R$ ${deliveryFee.toFixed(2)}`}
              </Typography>
            </Box>

            <Divider sx={{ width: "100%" }} />

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                fontWeight: "bold",
              }}
            >
              <Typography>Total</Typography>
              <Typography>R$ {total.toFixed(2)}</Typography>
            </Box>

            <Button
              variant="contained"
              color="success"
              size="large"
              fullWidth
              onClick={handleGoToCheckout}
            >
              Ir para pagamento
            </Button>
          </Box>
        )}
      </Box>

      {selectedProduct && (
        <CartProductModal
          item={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onUpdate={() => setSelectedProduct(null)}
        />
      )}
    </Box>
  );
};

export default Cart;

import { useState, useEffect, useContext } from "react";
import {
  Box,
  Button,
  Typography,
  Divider,
  Checkbox,
  Modal,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeProvider";
import { useCartContext } from "../hooks/useCartContext";
import { useAddressContext } from "../hooks/useAddressContext";
import { useAuthContext } from "../context/AuthProvider";
import AddressForm from "../components/AddressForm";
import Loading from "../components/Loading";
import { calculateDeliveryFees } from "../config/fees.config";
import { CartService } from "../services/endpoints/cart.Service";

const Checkout = () => {
  const { darkMode } = useContext(ThemeContext);
  const { cart, clearCart, refreshCart } = useCartContext();
  const { selectedAddress, setSelectedAddress, addresses } =
    useAddressContext();
  const { user, loading: authLoading } = useAuthContext();

  const navigate = useNavigate();
  const [pickup, setPickup] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [addressModalOpen, setAddressModalOpen] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
  const { serviceFee, deliveryFee } = calculateDeliveryFees(pickup);
  const total = subtotal + serviceFee + (pickup ? 0 : deliveryFee);

  // 🔹 Redireciona para login apenas se authLoading terminou
  useEffect(() => {
    if (!authLoading && !user) navigate("/login");
  }, [authLoading, user, navigate]);

  // 🔹 Garantir carrinho atualizado
  useEffect(() => {
    if (refreshCart) refreshCart({ silent: true });
  }, [refreshCart]);

  const handleSimulatePayment = async () => {
    if (!cart.length) return alert("Seu carrinho está vazio");
    if (!user?._id) return navigate("/login");
    if (!pickup && !selectedAddress?._id)
      return alert("Selecione um endereço ou marque Retirar no local");

    const orderData = {
      userId: user._id,
      products: cart.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        extras: item.extras || [],
        meatCount: item.meatCount || 1,
        observations: item.observations || "",
        totalPrice: item.totalPrice,
      })),
      delivery_address: pickup ? null : selectedAddress._id,
      pickup,
      subTotalAmt: subtotal,
      totalAmt: total,
      serviceFee,
      deliveryFee,
    };

    try {
      setProcessing(true);
      await CartService.createOrder(orderData);
      alert("Pedido criado com sucesso!");
      await clearCart();
      navigate("/");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Erro ao criar pedido");
    } finally {
      setProcessing(false);
    }
  };

  if (authLoading || !user || !cart) return <Loading text="Carregando..." />;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: darkMode ? "#1a1a1a" : "#f5f5f5",
        color: darkMode ? "#fff" : "#222",
        px: { xs: 2, md: 4 },
        py: 6,
      }}
    >
      <Typography variant="h4" sx={{ mb: 4, textAlign: "center" }}>
        Checkout
      </Typography>

      <Box
        sx={{
          maxWidth: 800,
          mx: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        {/* Produtos */}
        <Box
          sx={{
            p: 2,
            backgroundColor: darkMode ? "#222" : "#fff",
            borderRadius: 2,
          }}
        >
          <Typography variant="h6">Produtos</Typography>
          <Divider sx={{ my: 1 }} />
          {cart.map((item) => (
            <Box
              key={item.cartItemId || item._id}
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Box>
                <Typography>
                  {item.name} x {item.quantity}
                </Typography>
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
              </Box>
              <Typography>R$ {item.totalPrice?.toFixed(2)}</Typography>
            </Box>
          ))}
        </Box>

        {/* Endereço */}
        <Box
          sx={{
            p: 2,
            backgroundColor: darkMode ? "#222" : "#fff",
            borderRadius: 2,
          }}
        >
          <Typography variant="h6">Endereço de entrega</Typography>
          <Divider sx={{ my: 1 }} />
          {addresses.length > 0 ? (
            addresses.map((addr) => (
              <Box
                key={addr._id}
                sx={{
                  p: 1,
                  border:
                    selectedAddress?._id === addr._id
                      ? "2px solid #16a34a"
                      : "1px solid #ddd",
                  borderRadius: 1,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                  cursor: "pointer",
                }}
                onClick={() => {
                  setSelectedAddress(addr);
                  setPickup(false);
                }}
              >
                <Typography>
                  {addr.address_line} - {addr.city} - CEP: {addr.pincode}
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedAddress(addr);
                    setAddressModalOpen(true);
                  }}
                >
                  Editar
                </Button>
              </Box>
            ))
          ) : (
            <Button
              variant="contained"
              onClick={() => setAddressModalOpen(true)}
            >
              Adicionar endereço
            </Button>
          )}

          <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
            <Checkbox
              checked={pickup}
              onChange={() => {
                setPickup(!pickup);
                if (!pickup) setSelectedAddress(null);
              }}
            />
            <Typography>Retirar no local</Typography>
          </Box>
        </Box>

        {/* Resumo */}
        <Box
          sx={{
            p: 2,
            backgroundColor: darkMode ? "#222" : "#fff",
            borderRadius: 2,
          }}
        >
          <Typography variant="h6">Resumo da compra</Typography>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography>Subtotal</Typography>
            <Typography>R$ {subtotal.toFixed(2)}</Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography>Taxa de serviço</Typography>
            <Typography>R$ {serviceFee.toFixed(2)}</Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography>Taxa de entrega</Typography>
            <Typography>R$ {pickup ? 0 : deliveryFee.toFixed(2)}</Typography>
          </Box>
          <Divider sx={{ my: 1 }} />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              fontWeight: "bold",
            }}
          >
            <Typography>Total</Typography>
            <Typography>R$ {total.toFixed(2)}</Typography>
          </Box>
        </Box>

        <Button
          variant="contained"
          color="success"
          size="large"
          fullWidth
          onClick={handleSimulatePayment}
          disabled={processing}
        >
          {processing ? "Processando..." : "Simular pagamento"}
        </Button>
      </Box>

      <Modal open={addressModalOpen} onClose={() => setAddressModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 420 },
            bgcolor: darkMode ? "#1f1f1f" : "#fff",
            boxShadow: 24,
            p: 2,
            borderRadius: 2,
          }}
        >
          <AddressForm onClose={() => setAddressModalOpen(false)} />
        </Box>
      </Modal>
    </Box>
  );
};

export default Checkout;

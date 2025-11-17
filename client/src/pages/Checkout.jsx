import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Divider,
  Checkbox,
  Modal,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useCartContext } from "../hooks/useCartContext";
import { useAddressContext } from "../hooks/useAddressContext";
import { useAuthContext } from "../hooks/useAuthContext";
import AddressForm from "../components/AddressForm";
import Loading from "../components/Loading";
import { FeeService } from "../services/endpoints/fee.Service";

const Checkout = () => {
  const { cart, refreshCart } = useCartContext();
  const { selectedAddress, setSelectedAddress, addresses } =
    useAddressContext();
  const { user, loading: authLoading } = useAuthContext();
  const navigate = useNavigate();

  const [pickup, setPickup] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [feeData, setFeeData] = useState(null);

  /** ============================
   *   🔹 Buscar taxas
   * ============================ */
  useEffect(() => {
    const loadFees = async () => {
      const data = await FeeService.calculate(pickup);
      setFeeData(data);
    };
    loadFees();
  }, [pickup]);

  /** Redirecionar se não logado */
  useEffect(() => {
    if (!authLoading && !user) navigate("/login");
  }, [authLoading, user, navigate]);

  /** Atualizar carrinho */
  useEffect(() => {
    if (refreshCart) refreshCart(true);
  }, [refreshCart]);

  if (authLoading || !user || !cart || !feeData)
    return <Loading text="Carregando..." />;

  /** ============================
   *     🔹 Cálculos
   * ============================ */
  const subtotal = cart.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
  const { serviceFee, deliveryFee, totalFees } = feeData;
  const total = subtotal + totalFees;

  /** ============================
   *     🔹 Pagamento Stripe
   * ============================ */
  const handleGoToStripe = async () => {
    if (!cart.length) return alert("Seu carrinho está vazio");
    if (!pickup && !selectedAddress?._id) {
      return alert("Selecione um endereço ou marque Retirar no local");
    }

    setProcessing(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/payments/create-checkout-session`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            products: cart,
            delivery_address: selectedAddress,
            pickup,
            subTotalAmt: subtotal,
            totalAmt: total,
            serviceFee,
            deliveryFee,
          }),
        }
      );

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Erro ao criar sessão de pagamento.");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao iniciar pagamento.");
    } finally {
      setProcessing(false);
    }
  };

  /** ============================ */

  return (
    <Box sx={{ minHeight: "100vh", px: { xs: 2, md: 4 }, py: 6 }}>
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
        <Box sx={{ p: 2, bgcolor: "#fff", borderRadius: 2 }}>
          <Typography variant="h6">Produtos</Typography>
          <Divider sx={{ my: 1 }} />
          {cart.map((item) => (
            <Box
              key={item._id}
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
        <Box sx={{ p: 2, bgcolor: "#fff", borderRadius: 2 }}>
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
        <Box sx={{ p: 2, bgcolor: "#fff", borderRadius: 2 }}>
          <Typography variant="h6">Resumo da compra</Typography>
          <Divider sx={{ my: 1 }} />

          <Row label="Subtotal" value={subtotal} />

          {serviceFee > 0 && <Row label="Taxa de serviço" value={serviceFee} />}

          <Row
            label="Taxa de entrega"
            value={deliveryFee}
            displayValue={Number(deliveryFee) === 0 ? "Entrega grátis" : undefined}
          />

          <Divider sx={{ my: 1 }} />
          <Row label="Total" value={total} bold />
        </Box>

        <Button
          variant="contained"
          color="success"
          size="large"
          fullWidth
          onClick={handleGoToStripe}
          disabled={processing}
        >
          {processing ? "Processando..." : "Pagar com Stripe"}
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
            bgcolor: "#fff",
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

const Row = ({ label, value, bold, displayValue }) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      fontWeight: bold ? "bold" : "normal",
    }}
  >
    <Typography>{label}</Typography>
    <Typography>
      {displayValue !== undefined
        ? displayValue
        : `R$ ${(Number(value) || 0).toFixed(2)}`}
    </Typography>
  </Box>
);

export default Checkout;

// src/pages/Orders.jsx
import { useEffect, useState, useContext } from "react";
import { Box, Typography, Divider, Paper, Chip } from "@mui/material";
import { ThemeContext } from "../context/ThemeProvider";
import { useAuthContext } from "../hooks/useAuthContext";
import { OrdersService } from "../services/endpoints/orders.Service";
import Navbar from "../components/Navbar";
import Loading from "../components/Loading";

const Orders = () => {
  const { darkMode } = useContext(ThemeContext);
  const { user, loading: authLoading } = useAuthContext();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Buscar pedidos do usuário
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const data = await OrdersService.getUserOrders();
        setOrders(data || []);
      } catch (err) {
        console.error("Erro ao buscar pedidos:", err);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && user) fetchOrders();
  }, [user, authLoading]);

  if (authLoading || loading) return <Loading text="Carregando pedidos..." />;
  if (!user) return <Typography>Faça login para ver seus pedidos.</Typography>;

  return (
    <>
      <Navbar />
      <Box
        sx={{
          minHeight: "100vh",
          alignItems: "center",
          px: { xs: 2, md: 40, },
          justifyContent: "center",
          backgroundColor: darkMode ? "#111" : "#f5f5f5",
          pt: "64px",
        }}
      >
        <Typography variant="h4" sx={{ mb: 4, textAlign: "center" }}>
          Meus Pedidos
        </Typography>

        {orders.length === 0 && (
          <Typography sx={{ textAlign: "center", mt: 4 }}>
            Nenhum pedido encontrado.
          </Typography>
        )}

        {orders.map((order) => (
          <Paper
            key={order._id}
            sx={{
              p: 3,
              mb: 3,
              backgroundColor: darkMode ? "#222" : "#fff",
            }}
          >
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography variant="subtitle1">
                Pedido: <strong>{order.orderId}</strong>
              </Typography>
              <Chip
                label={order.order_status}
                color={
                  order.order_status === "Entregue"
                    ? "success"
                    : order.order_status === "Cancelado"
                    ? "error"
                    : "warning"
                }
                size="small"
              />
            </Box>

            <Divider sx={{ my: 1 }} />

            {/* Produtos */}
            {order.products.map((p) => (
              <Box
                key={p.productId}
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Box>
                  <Typography>
                    {p.product_details?.name} x {p.quantity}
                  </Typography>
                  {p.extras?.length > 0 && (
                    <Typography variant="body2">
                      Extras: {p.extras.map((e) => e.name).join(", ")}
                    </Typography>
                  )}
                  {p.observations && (
                    <Typography variant="body2">
                      Obs: {p.observations}
                    </Typography>
                  )}
                </Box>
                <Typography>R$ {p.totalPrice?.toFixed(2)}</Typography>
              </Box>
            ))}

            <Divider sx={{ my: 1 }} />

            {/* Endereço */}
            {!order.pickup && order.delivery_address ? (
              <Box sx={{ mb: 1 }}>
                <Typography variant="subtitle2">Entrega para:</Typography>
                <Typography>
                  {order.delivery_address.address_line} -{" "}
                  {order.delivery_address.city}, {order.delivery_address.state}{" "}
                  - CEP: {order.delivery_address.pincode}
                </Typography>
              </Box>
            ) : (
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Retirar no local
              </Typography>
            )}

            {/* Totais */}
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography>Subtotal</Typography>
              <Typography>R$ {order.subTotalAmt.toFixed(2)}</Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography>Taxa de serviço</Typography>
              <Typography>R$ {order.serviceFee.toFixed(2)}</Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography>Taxa de entrega</Typography>
              <Typography>
                R$ {order.pickup ? 0 : order.deliveryFee.toFixed(2)}
              </Typography>
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
              <Typography>R$ {order.totalAmt.toFixed(2)}</Typography>
            </Box>
          </Paper>
        ))}
      </Box>
    </>
  );
};

export default Orders;

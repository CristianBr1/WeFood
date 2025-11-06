import React, { useState, useEffect, useContext } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { OrdersService } from "../services/endpoints/orders.Service";
import { ThemeContext } from "../context/ThemeProvider";
import Navbar from "../components/Navbar";
import {
  Box,
  Typography,
  Divider,
  Paper,
  CircularProgress,
} from "@mui/material";

const OrdersPage = () => {
  const { user } = useAuthContext();
  const { darkMode } = useContext(ThemeContext);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?._id) return;
      try {
        setLoading(true);
        const data = await OrdersService.getUserOrders(user._id, user.token);
        setOrders(data);
      } catch (err) {
        console.error("Erro ao buscar pedidos:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  return (
    <>
      <Navbar />
      {loading ? (
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: darkMode ? "#111" : "#f5f5f5",
            pt: "64px", // espaço para navbar fixa
          }}
        >
          <CircularProgress />
        </Box>
      ) : !orders.length ? (
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: darkMode ? "#111" : "#f5f5f5",
            pt: "64px", // espaço para navbar fixa
          }}
        >
          <Typography variant="h6" sx={{ textAlign: "center" }}>
            Você ainda não possui pedidos.
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            minHeight: "100vh",
            pt: "80px", // espaço para navbar fixa
            px: { xs: 2, md: 4 },
            backgroundColor: darkMode ? "#111" : "#f5f5f5",
            display: "flex",
            flexDirection: "column",
            alignItems: "center", // centraliza horizontalmente
            gap: 3,
          }}
        >
          <Typography variant="h4" sx={{ mb: 3, textAlign: "center" }}>
            Meus Pedidos
          </Typography>

          <Box
            sx={{
              width: "100%",
              maxWidth: 800,
              display: "flex",
              flexDirection: "column",
              gap: 3,
              flexGrow: 1, // permite preencher o espaço vertical
              justifyContent: orders.length < 3 ? "center" : "flex-start", // centraliza verticalmente se poucos pedidos
            }}
          >
            {orders.map((order) => (
              <Paper
                key={order._id}
                sx={{
                  p: 2,
                  backgroundColor: darkMode ? "#222" : "#fff",
                  borderRadius: 2,
                  width: "100%",
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  Pedido: {order.orderId} - Status: {order.order_status}
                </Typography>
                <Divider sx={{ my: 1 }} />
                {order.products.map((item) => (
                  <Box
                    key={item._id}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 0.5,
                    }}
                  >
                    <Typography>
                      {item.product_details.name} x {item.quantity}
                      {item.extras?.length > 0 &&
                        ` (Extras: ${item.extras.map((e) => e.name).join(", ")})`}
                    </Typography>
                    <Typography>R$ {item.totalPrice.toFixed(2)}</Typography>
                  </Box>
                ))}
                <Divider sx={{ my: 1 }} />
                <Typography sx={{ fontWeight: "bold" }}>
                  Total: R$ {order.totalAmt.toFixed(2)}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Box>
      )}
    </>
  );
};

export default OrdersPage;

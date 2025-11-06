import React, { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../context/ThemeProvider";
import AuthContext from "../context/AuthContext";
import {
  Typography,
  Button,
  Select,
  MenuItem,
  Box,
  CircularProgress,
} from "@mui/material";
import { OrderService } from "../services/endpoints/order.Service";

const statusOptions = [
  { value: "Pendente", label: "Pendente", color: "#facc15" },
  { value: "Em preparo", label: "Em preparo", color: "#f97316" },
  { value: "Saiu para entrega", label: "Saiu para entrega", color: "#3b82f6" },
  { value: "Entregue", label: "Concluído", color: "#16a34a" },
  { value: "Cancelado", label: "Cancelado", color: "#dc2626" },
];

const Orders = () => {
  const { darkMode } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.token) fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await OrderService.getOrders(user?.token);
      setOrders(data);
    } catch (err) {
      setError(err.message || "Erro ao carregar pedidos");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Deseja excluir este pedido?")) return;
    try {
      await OrderService.deleteOrder(id, user?.token);
      setOrders((prev) => prev.filter((o) => o._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const updated = await OrderService.updateOrderStatus(id, newStatus, user?.token);
      setOrders((prev) =>
        prev.map((o) => (o._id === updated._id ? updated : o))
      );
    } catch (err) {
      alert(err.message);
    }
  };

  const handlePrintComanda = (order) => {
    const printWindow = window.open("", "PRINT", "height=600,width=800");
    printWindow.document.write(
      `<html><head><title>Comanda</title></head><body>`
    );
    printWindow.document.write(
      `<h2>Pedido #${order.orderId || order._id}</h2>`
    );
    printWindow.document.write(
      `<p><strong>Cliente:</strong> ${order.userId?.name || "Anônimo"}</p>`
    );
    printWindow.document.write(
      `<p><strong>Telefone:</strong> ${
        order.userId?.phone || "Não informado"
      }</p>`
    );
    printWindow.document.write(
      `<p><strong>Endereço:</strong> ${
        order.pickup
          ? "Retirada no local"
          : order.delivery_address
          ? `${order.delivery_address.address_line}, nº ${
              order.delivery_address.number || "s/n"
            }, ${order.delivery_address.neighborhood || ""}, ${
              order.delivery_address.city
            } - ${order.delivery_address.state}, CEP: ${
              order.delivery_address.pincode
            }`
          : "Não informado"
      }</p>`
    );
    printWindow.document.write(`<ul>`);
    order.products.forEach((item) => {
      printWindow.document.write(
        `<li>${item.product_details?.name || "Produto"} x${item.quantity} ${
          item.extras?.length
            ? "- Extras: " + item.extras.map((e) => e.name).join(", ")
            : ""
        } ${item.observations ? "- Obs: " + item.observations : ""}</li>`
      );
    });
    printWindow.document.write(`</ul>`);
    printWindow.document.write(`</body></html>`);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "60vh",
        }}
      >
        <CircularProgress />
      </Box>
    );

  return (
    <div
      className={`p-6 ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <h2 className="text-2xl font-bold mb-4">Pedidos</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}

      {orders.length === 0 ? (
        <Typography>Nenhum pedido encontrado.</Typography>
      ) : (
        <div className="flex flex-col gap-6">
          {orders.map((order, index) => {
            const statusColor =
              statusOptions.find((s) => s.value === order.order_status)
                ?.color || "gray";
            return (
              <div
                key={order._id}
                className="p-5 rounded-lg shadow flex flex-col gap-3 border-l-8"
                style={{
                  borderColor: statusColor,
                  backgroundColor: darkMode ? "#1f2937" : "#f3f4f6",
                }}
              >
                {/* Header */}
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-lg">Pedido #{index + 1}</p>
                  <div className="flex gap-2 items-center">
                    <Select
                      value={order.order_status}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      size="small"
                      sx={{
                        fontWeight: "bold",
                        backgroundColor: statusColor,
                        color: "#fff",
                        borderRadius: 1,
                      }}
                    >
                      {statusOptions.map((s) => (
                        <MenuItem key={s.value} value={s.value}>
                          {s.label}
                        </MenuItem>
                      ))}
                    </Select>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => handleDelete(order._id)}
                    >
                      Excluir
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      size="small"
                      onClick={() => handlePrintComanda(order)}
                    >
                      Imprimir Comanda
                    </Button>
                  </div>
                </div>

                {/* Cliente e informações */}
                <div className="text-sm">
                  <p>
                    <strong>Cliente:</strong> {order.userId?.name || "Anônimo"}
                  </p>
                  <p>
                    <strong>Telefone:</strong>{" "}
                    {order.userId?.phone || "Não informado"}
                  </p>
                  <p>
                    <strong>Endereço:</strong>{" "}
                    {order.pickup
                      ? "Retirada no local"
                      : order.delivery_address
                      ? `${order.delivery_address.address_line}, nº ${
                          order.delivery_address.number || "s/n"
                        }, ${order.delivery_address.neighborhood || ""}, ${
                          order.delivery_address.city
                        } - ${order.delivery_address.state}, CEP: ${
                          order.delivery_address.pincode
                        }`
                      : "Não informado"}
                  </p>
                  <p>
                    <strong>Valor Total:</strong> R$
                    {order.totalAmt?.toFixed(2) || 0}
                  </p>
                  <p>
                    <strong>Data:</strong>{" "}
                    {new Date(order.createdAt).toLocaleString("pt-BR")}
                  </p>
                </div>

                {/* Itens do pedido */}
                <div>
                  <strong>Itens:</strong>
                  <ul className="list-disc pl-5 mt-2">
                    {order.products.map((item, i) => (
                      <li key={i} className="mb-2">
                        {item.product_details?.image?.[0] && (
                          <img
                            src={
                              item.product_details.image[0].startsWith("http")
                                ? item.product_details.image[0]
                                : `http://localhost:8000${item.product_details.image[0]}`
                            }
                            alt={item.product_details.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <strong>
                          {item.product_details?.name || "Produto"}
                        </strong>{" "}
                        x{item.quantity} — R${item.totalPrice.toFixed(2)}
                        {item.extras?.length > 0 && (
                          <div>
                            <small>
                              Extras:{" "}
                              {item.extras.map((e) => e.name).join(", ")}
                            </small>
                          </div>
                        )}
                        {item.observations && (
                          <div>
                            <small>Obs cliente: {item.observations}</small>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;

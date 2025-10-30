import React, { useEffect, useState, useContext } from "react";
import { ThemeContext } from "../context/ThemeProvider";
import AuthContext from "../context/AuthContext";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

const statusOptions = [
  "Pendente",
  "Aceito",
  "Saiu para entrega",
  "Cancelado",
  "Concluído",
];

const Orders = () => {
  const { darkMode } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pega pedidos do backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders", {
          headers: {
            Authorization: user?.token ? `Bearer ${user.token}` : "",
          },
        });
        const data = await res.json();
        setOrders(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: user?.token ? `Bearer ${user.token}` : "",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Erro ao atualizar status");

      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Carregando pedidos...</p>;

  return (
    <div className={`p-6 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"} rounded-md shadow-md`}>
      <h2 className="text-2xl font-bold mb-4">Pedidos</h2>

      {orders.length === 0 && <p>Nenhum pedido encontrado.</p>}

      <div className="flex flex-col gap-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className={`p-4 rounded-md shadow-md flex flex-col gap-2 border ${
              darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-200"
            }`}
          >
            <p><strong>Cliente:</strong> {order.customerName}</p>
            <p><strong>Itens:</strong></p>
            <ul className="pl-4 list-disc">
              {order.items.map((item, idx) => (
                <li key={idx}>
                  {item.name} x {item.quantity} - {item.price}€
                  {item.extras && item.extras.length > 0 && (
                    <ul className="pl-4 list-disc">
                      {item.extras.map((extra, i) => (
                        <li key={i}>{extra.name} (+{extra.price}€)</li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>

            <p><strong>Total:</strong> {order.total}€</p>

            <div className="flex items-center gap-2 mt-2">
              <span>Status:</span>
              <Select
                value={order.status}
                onChange={(e) => handleStatusChange(order._id, e.target.value)}
              >
                {statusOptions.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;

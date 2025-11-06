import { memo, useEffect, useState } from "react";
import { OrderService } from "../services/endpoints/order.Service";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    productCountMap: {},
    revenueByDay: [],
    orderStatusMap: {},
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all"); // all, week, month

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const orders = await OrderService.getOrders();

        // Filtrar pedidos pelo período
        const now = new Date();
        const filteredOrders = orders.filter((order) => {
          const orderDate = new Date(order.createdAt);
          if (filter === "week") {
            const weekAgo = new Date();
            weekAgo.setDate(now.getDate() - 7);
            return orderDate >= weekAgo;
          }
          if (filter === "month") {
            const monthAgo = new Date();
            monthAgo.setMonth(now.getMonth() - 1);
            return orderDate >= monthAgo;
          }
          return true;
        });

        let totalOrders = filteredOrders.length;
        let totalRevenue = 0;
        const productCountMap = {};
        const revenueByDayMap = {};
        const orderStatusMap = {};

        filteredOrders.forEach((order) => {
          totalRevenue += order.totalAmt || 0;

          // Produtos vendidos
          order.products.forEach((p) => {
            const name = p.product_details?.name || "Produto Desconhecido";
            productCountMap[name] = (productCountMap[name] || 0) + p.quantity;
          });

          // Receita diária
          const day = new Date(order.createdAt).toLocaleDateString();
          revenueByDayMap[day] = (revenueByDayMap[day] || 0) + (order.totalAmt || 0);

          // Status dos pedidos
          const status = order.order_status || "Desconhecido";
          orderStatusMap[status] = (orderStatusMap[status] || 0) + 1;
        });

        const revenueByDay = Object.entries(revenueByDayMap)
          .map(([date, revenue]) => ({ date, revenue }))
          .sort((a, b) => new Date(a.date) - new Date(b.date));

        setMetrics({ totalOrders, totalRevenue, productCountMap, revenueByDay, orderStatusMap });
      } catch (err) {
        console.error(err);
        setError(err.message || "Erro ao carregar métricas");
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [filter]); // Reexecuta sempre que o filtro mudar

  const { totalOrders, totalRevenue, productCountMap, revenueByDay, orderStatusMap } = metrics;
  const averageTicket = totalOrders ? totalRevenue / totalOrders : 0;

  const topProducts = Object.entries(productCountMap)
    .map(([name, qty]) => ({ name, qty }))
    .sort((a, b) => b.qty - a.qty);

  const statusData = Object.entries(orderStatusMap).map(([status, count]) => ({
    name: status,
    value: count,
  }));
  const COLORS = ["#16a34a", "#f59e0b", "#ef4444", "#3b82f6", "#8b5cf6"];

  if (loading) return <p>Carregando métricas...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-4">Dashboard da Loja</h2>

      {/* Filtro por período */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded ${filter === "all" ? "bg-green-500 text-white" : "bg-gray-200"}`}
        >
          Todos
        </button>
        <button
          onClick={() => setFilter("week")}
          className={`px-4 py-2 rounded ${filter === "week" ? "bg-green-500 text-white" : "bg-gray-200"}`}
        >
          Última Semana
        </button>
        <button
          onClick={() => setFilter("month")}
          className={`px-4 py-2 rounded ${filter === "month" ? "bg-green-500 text-white" : "bg-gray-200"}`}
        >
          Último Mês
        </button>
      </div>

      {/* Cards de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-green-100 rounded shadow">
          <p className="text-sm text-gray-500">Pedidos</p>
          <p className="text-xl font-bold">{totalOrders}</p>
        </div>
        <div className="p-4 bg-blue-100 rounded shadow">
          <p className="text-sm text-gray-500">Faturamento</p>
          <p className="text-xl font-bold">R$ {totalRevenue.toFixed(2)}</p>
        </div>
        <div className="p-4 bg-yellow-100 rounded shadow">
          <p className="text-sm text-gray-500">Ticket Médio</p>
          <p className="text-xl font-bold">R$ {averageTicket.toFixed(2)}</p>
        </div>
        <div className="p-4 bg-purple-100 rounded shadow">
          <p className="text-sm text-gray-500">Produtos Únicos</p>
          <p className="text-xl font-bold">{topProducts.length}</p>
        </div>
      </div>

      {/* Produtos mais vendidos */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Produtos mais vendidos</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topProducts} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="qty" fill="#16a34a" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Receita por dia */}
      <div>
        <h3 className="text-lg font-semibold mb-2 mt-6">Receita por dia</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueByDay} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Status dos pedidos */}
      <div>
        <h3 className="text-lg font-semibold mb-2 mt-6">Status dos pedidos</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={statusData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default memo(Dashboard);

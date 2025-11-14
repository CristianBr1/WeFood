import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import Menu from "../pages/Menu";
import Perfil from "../pages/Perfil";
import Restaurante from "../pages/Restaurante";
import Sobre from "../pages/Sobre";
import OrdersPage from "../pages/OrdersPage";
import ProtectedRoute from "../components/ProtectedRoute";
import Checklist from "../components/Checklist";
import CheckoutSuccess from "../components/CheckoutSuccess";

const Router = () => {
  return (
    <Routes>
      {/* HOME */}
      <Route path="/" element={<Home />} />
      <Route path="/category/:categoryId" element={<Home />} />
      <Route path="/product/:productId" element={<Home />} /> {/* nova rota */}
      <Route path="/category/:categoryId/product/:productId" element={<Home />} />

      {/* AUTENTICAÇÃO */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ROTAS PROTEGIDAS */}
      <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
      <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
      <Route path="checkout/success" element={<ProtectedRoute><CheckoutSuccess /></ProtectedRoute>} />
      <Route path="/menu" element={<ProtectedRoute><Menu /></ProtectedRoute>} />
      <Route path="/perfil/:id" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
      <Route path="/restaurante" element={<ProtectedRoute><Restaurante /></ProtectedRoute>} />

      {/* PEDIDOS */}
      <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />

      {/* SOBRE */}
      <Route path="/sobre" element={<Sobre />} />
      <Route path="/checklist" element={<Checklist />} />
    </Routes>
  );
};

export default Router;

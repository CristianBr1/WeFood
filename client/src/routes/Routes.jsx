import { Route, Routes } from "react-router-dom";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Home from "../pages/Home";
import Menu from "../pages/Menu";
import Perfil from "../pages/Perfil";
import Sobre from "../pages/Sobre";
import Restaurante from "../pages/Restaurante";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import ProtectedRoute from "../components/ProtectedRoute";

const Router = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/product/:id" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />

    {/* 🔒 Rotas protegidas */}
    <Route
      path="/cart"
      element={
        <ProtectedRoute>
          <Cart />
        </ProtectedRoute>
      }
    />
        <Route
      path="/checkout"
      element={
        <ProtectedRoute>
          <Checkout />
        </ProtectedRoute>
      }
    />
    <Route
      path="/menu"
      element={
        <ProtectedRoute>
          <Menu />
        </ProtectedRoute>
      }
    />
    <Route
      path="/perfil/:id"
      element={
        <ProtectedRoute>
          <Perfil />
        </ProtectedRoute>
      }
    />
    <Route
      path="/restaurante"
      element={
        <ProtectedRoute>
          <Restaurante />
        </ProtectedRoute>
      }
    />
    <Route path="/sobre" element={<Sobre />} />
  </Routes>
);

export default Router;

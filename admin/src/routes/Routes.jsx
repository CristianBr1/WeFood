import { Route, Routes, Navigate } from "react-router-dom";
import Layout from "../pages/Layout";
import AdminRoute from "../components/AdminRoute";

import Dashboard from "../pages/Dashboard";
import Categories from "../pages/Categories";
import AddCategories from "../pages/AddCategories";
import Products from "../pages/Products";
import AddProducts from "../pages/AddProducts";
import Banners from "../pages/Banners";
import AddBanners from "../pages/AddBanners";
import Users from "../pages/Users";
import Orders from "../pages/Orders";
import LogoManage from "../pages/LogoManage";
import MyAccount from "../pages/MyAccount";
import Login from "../pages/Login";

const Router = () => (
  <Routes>
    {/* Rota pública */}
    <Route path="/login" element={<Login />} />

    {/* Rotas protegidas */}
    <Route
      path="/"
      element={
        <AdminRoute>
          <Layout />
        </AdminRoute>
      }
    >
      <Route index element={<Navigate to="/dashboard" replace />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="banners" element={<Banners />} />
      <Route path="banners/add" element={<AddBanners />} />
      <Route path="categorias" element={<Categories />} />
      <Route path="categorias/add" element={<AddCategories />} />
      <Route path="produtos" element={<Products />} />
      <Route path="produtos/add" element={<AddProducts />} />
      <Route path="usuarios" element={<Users />} />
      <Route path="pedidos" element={<Orders />} />
      <Route path="logotipo" element={<LogoManage />} />
      <Route path="minha-conta" element={<MyAccount />} />

      {/* Rota 404 */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Route>
  </Routes>
);

export default Router;

import { Route, Routes } from "react-router-dom"
import Register from "../pages/Register";
import Login from "../pages/Login";
import Home from "../pages/Home";
import Menu from "../pages/Menu";
import Perfil from "../pages/Perfil";
import Sobre from "../pages/Sobre";
import Restaurante from "../pages/Restaurante";

const Router = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/product/:id" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/menu" element={<Menu />} /> {/* usuário deve ter uma conta para acessar o menu, por id? */}
    <Route path="/perfil/:id" element={<Perfil />} /> {/* usuário deve ter uma conta (id) para acessar a página Perfil. Enfim, placeholder por enquanto */}
    <Route path="/restaurante" element={<Restaurante />} /> {/* trocar para /restaurante/:id, pelo mesmo motivo do Perfil. Apenas um placeholder por enquanto */}
    <Route path="/sobre" element={<Sobre />} /> {/* página com informação do grupo */}
  </Routes>
);
export default Router;

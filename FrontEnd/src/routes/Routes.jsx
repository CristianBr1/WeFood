import { Route, Routes } from "react-router-dom"
import Register from "../pages/Register";
import Login from "../pages/Login";
import Home from "../pages/Home";
import Menu from "../pages/Menu";

const Router = () => (
  <Routes>
    <Route path="/" element={<Home />} />
      <Route path="/product/:id" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/menu" element={<Menu />} /> {/* usuário deve ter uma conta para acessar o menu, por id? */}
  </Routes>
);
export default Router;

import { Route, Routes } from "react-router-dom"
import Register from "../pages/Register";
import Login from "../pages/Login";
import Home from "../pages/Home";

const Router = () => (
  <Routes>
    <Route path="/" element={<Home />} />
      <Route path="/product/:id" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
  </Routes>
);
export default Router;

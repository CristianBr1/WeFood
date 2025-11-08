import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IconButton, Button, Drawer } from "@mui/material";
import {
  FaRegUser,
  FaRegHeart,
  FaTicketAlt,
  FaRegCommentDots,
  FaUserShield,
  FaRegCreditCard,
} from "react-icons/fa";
import { IoIosLogIn } from "react-icons/io";
import { MdHelpOutline, MdLoyalty, MdShoppingBasket } from "react-icons/md";
import { ShoppingCart } from "lucide-react";
import { ThemeContext } from "../context/ThemeProvider";
import { useCartContext } from "../hooks/useCartContext";
import { useAuthContext } from "../hooks/useAuthContext";
import api from "../services/api";
import "../styles/Navbar.css";

const Navbar = () => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();
  const { cart } = useCartContext();

  const [storeData, setStoreData] = useState({ name: "WeFood", logo: null });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const name = user?.name || "Usuário";
    const firstName = name.split(" ")[0];
    setUserName(firstName);
  }, []);

  // Buscar dados da loja
  useEffect(() => {
    const fetchStore = async () => {
      try {
        const res = await api.get("/store");
        if (res.data) setStoreData(res.data);
      } catch (err) {
        console.error("Erro ao buscar dados da loja:", err);
      }
    };
    fetchStore();
  }, []);

  // Total de itens no carrinho
  const totalCartItems = cart.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0
  );

  const menuItems = [
    { label: "Chats", icon: <FaRegCommentDots />, path: "/chats" },
    { label: "Pedidos", icon: <MdShoppingBasket />, path: "/orders" },
    { label: "Meus Cupons", icon: <FaTicketAlt />, path: "/coupons" },
    { label: "Favoritos", icon: <FaRegHeart />, path: "/favorites" },
    { label: "Pagamento", icon: <FaRegCreditCard />, path: "/payment" },
    { label: "Fidelidade", icon: <MdLoyalty />, path: "/loyalty" },
    { label: "Ajuda", icon: <MdHelpOutline />, path: "/help" },
    { label: "Meus dados", icon: <FaRegUser />, path: "/profile" },
    { label: "Segurança", icon: <FaUserShield />, path: "/security" },
    { label: "Sair", icon: <IoIosLogIn />, path: "/logout" },
  ];

  const handleMenuItemClick = (item) => {
    if (item.label === "Sair") {
      logout();
      navigate("/login");
    } else if (item.path) {
      navigate(item.path);
    }
    setDrawerOpen(false);
  };

  return (
    <>
      <nav
        className={`navbar${darkMode ? " dark" : ""}`}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 999,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.5rem 1rem",
          background: darkMode ? "#222" : "#fff",
          color: darkMode ? "#fff" : "#222",
          borderBottom: darkMode ? "1.5px solid #444" : "1.5px solid #e0e0e0",
          boxShadow: darkMode ? "none" : "0 2px 8px rgba(0,0,0,0.12)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Logo clicável */}
          {storeData.logo && (
            <Link
              to="/"
              style={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                color: "inherit",
                cursor: "pointer", // garante que o cursor indique clique
                zIndex: 10, // evita sobreposição
              }}
            >
              <img src={storeData.logo} alt="Logo" style={{ height: 40 }} />
            </Link>
          )}

          {/* Nome clicável */}
          <Link
            to="/"
            style={{
              textDecoration: "none",
              color: "inherit",
              fontWeight: "bold",
              fontSize: "1.5rem",
              cursor: "pointer",
              zIndex: 10,
            }}
          >
            {storeData.name}
          </Link>
        </div>

        {/* Links centrais */}
        <ul className="navbar-links navbar-links-centered">
          <li>
            <Link to="/" style={{ color: "inherit" }}>
              Cardápio
            </Link>
          </li>
          <li>
            <Link to="/sobre" style={{ color: "inherit" }}>
              Sobre Nós
            </Link>
          </li>
        </ul>

        {/* Área direita */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Avatar / Login */}
          <IconButton
            onClick={() => (user ? setDrawerOpen(true) : navigate("/login"))}
            style={{
              background: darkMode ? "#333" : "#f5f5f5",
              color: darkMode ? "#fff" : "#333",
              borderRadius: "50%",
              padding: "6px",
            }}
          >
            {user ? <FaRegUser size={24} /> : <IoIosLogIn size={24} />}
          </IconButton>

          {/* Carrinho */}
          {user && (
            <button
              onClick={() => navigate("/cart")}
              style={{
                position: "relative",
                background: darkMode ? "#333" : "#f5f5f5",
                color: darkMode ? "#fff" : "#333",
                border: darkMode ? "1px solid #444" : "#f5f5f5",
                padding: "0.6rem",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              <ShoppingCart size={22} />
              {totalCartItems > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "0",
                    right: "0",
                    transform: "translate(35%, -35%)",
                    background: "#ef4444",
                    color: "#fff",
                    borderRadius: "50%",
                    fontSize: "0.7rem",
                    padding: "0.2rem 0.45rem",
                    fontWeight: "bold",
                  }}
                >
                  {totalCartItems}
                </span>
              )}
            </button>
          )}
        </div>
      </nav>

      {/* Drawer */}
      <Drawer
        anchor="top"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          style: {
            height: "auto",
            maxHeight: "90vh",
            width: 300,
            marginLeft: "auto",
            marginRight: 20,
            marginTop: 64,
            background: darkMode ? "#222" : "#fff",
            color: darkMode ? "#fff" : "#222",
            padding: "1rem",
          },
        }}
      >
        <div style={{ marginBottom: "1rem", textAlign: "center" }}>
          <div style={{ marginBottom: "0.5rem", fontWeight: 500 }}>
            Olá, {userName}
          </div>
          <Button
            onClick={toggleDarkMode}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "20px",
              border: "none",
              background: darkMode ? "#444" : "#eee",
              color: darkMode ? "#fff" : "#222",
              cursor: "pointer",
              width: "100%",
              marginBottom: "1rem",
              fontWeight: 500,
            }}
          >
            {darkMode ? "☀ Tema Claro" : "☽ Tema Escuro"}
          </Button>
        </div>

        {menuItems.map((item, idx) => (
          <Button
            key={idx}
            fullWidth
            onClick={() => handleMenuItemClick(item)}
            style={{
              marginBottom: "0.5rem",
              justifyContent: "flex-start",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              color: darkMode ? "#fff" : "#222",
            }}
          >
            {item.icon} {item.label}
          </Button>
        ))}
      </Drawer>
    </>
  );
};

export default Navbar;

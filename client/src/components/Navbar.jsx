import React, { useContext, useState, useEffect, useRef } from "react";
import { ThemeContext } from "../context/ThemeProvider";
import AuthContext from "../context/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import "../styles/Navbar.css";
import userAvatar from "../assets/images/placeholder1.png";

const Navbar = () => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const { user, logout, cart = [] } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 1224);
  const dropdownRef = useRef(null);
  const hamburgerRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsLargeScreen(window.innerWidth > 1224);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav
      className={`navbar${darkMode ? " dark" : ""}`}
      style={{
        background: darkMode ? "#222" : "#fff",
        color: darkMode ? "#fff" : "#222",
        borderBottom: darkMode ? "1.5px solid #444" : "1.5px solid #e0e0e0",
        boxShadow: darkMode ? "none" : "0 2px 8px 0 rgba(0,0,0,0.12)",
      }}
    >
      {/* Botão hambúrguer */}
      <button
        ref={hamburgerRef}
        className={`navbar-hamburger${menuOpen ? " open" : ""}`}
        aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
        onClick={(e) => {
          e.stopPropagation();
          setMenuOpen((open) => !open);
        }}
        style={{
          background: "none",
          border: "none",
          width: "40px",
          height: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          marginRight: "1rem",
          zIndex: "2",
          padding: 0,
          color: darkMode ? "#fff" : "#222",
        }}
      >
        <span className="hamburger-lines">
          <span className="line line1"></span>
          <span className="line line2"></span>
          <span className="line line3"></span>
        </span>
      </button>

      {/* Links principais */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          position: "relative",
          gap: "1.5rem",
        }}
      >
        <ul className="navbar-links navbar-links-centered">
          <li>
            <Link
              to="/"
              style={{
                color: "inherit",
                textDecoration: "none",
                fontWeight: location.pathname === "/" ? "bold" : "normal",
              }}
            >
              Cardápio
            </Link>
          </li>
          <li>
            <Link
              to="/perfil/1"
              style={{
                color: "inherit",
                textDecoration: "none",
                fontWeight:
                  location.pathname === "/perfil/1" ? "bold" : "normal",
              }}
            >
              Perfil
            </Link>
          </li>
          <li>
            <Link
              to="/sobre"
              style={{
                color: "inherit",
                textDecoration: "none",
                fontWeight:
                  location.pathname === "/sobre" ? "bold" : "normal",
              }}
            >
              Sobre Nós
            </Link>
          </li>
          <li>
            <Link
              to="/restaurante"
              style={{
                color: "inherit",
                textDecoration: "none",
                fontWeight:
                  location.pathname === "/restaurante" ? "bold" : "normal",
              }}
            >
              Restaurante
            </Link>
          </li>
        </ul>

        {/* Menu dropdown */}
        {menuOpen && (
          <div
            ref={dropdownRef}
            className="navbar-dropdown-menu"
            style={{
              background: darkMode ? "#222" : "#fff",
              color: darkMode ? "#fff" : "#222",
              boxShadow: darkMode ? "none" : "0 0 16px rgba(0,0,0,0.12)",
              borderRight: darkMode ? "1px solid #444" : "none",
            }}
          >
            {isLargeScreen ? (
              <>
                <div style={{ width: "100%" }}>
                  {/* Usuário logado ou visitante */}
                  <div
                    className="userInfoContainer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "row",
                      gap: "10px",
                      margin: "0",
                      width: "100%",
                    }}
                  >
                    <img
                      src={userAvatar}
                      alt="User Avatar"
                      className="user-avatar"
                      style={{
                        border: darkMode ? "2px solid #444" : "2px solid #ccc",
                        borderRadius: "50%",
                        width: "50px",
                        height: "50px",
                        background: darkMode ? "#333" : "#f0f0f0",
                        marginBottom: "1rem",
                      }}
                    />
                    <div className="navbar-user-label">
                      {user ? user.name : "Visitante"}
                    </div>
                  </div>

                  {/* Tema */}
                  <button
                    onClick={toggleDarkMode}
                    style={{
                      padding: "0.5rem 1rem",
                      borderRadius: "20px",
                      border: "none",
                      background: darkMode ? "#444" : "#eee",
                      color: darkMode ? "#fff" : "#222",
                      fontFamily: "inherit",
                      fontSize: "1rem",
                      cursor: "pointer",
                      fontWeight: "500",
                      marginTop: "0.5rem",
                      width: "100%",
                    }}
                  >
                    {darkMode ? "☀ Tema Claro" : "☽ Tema Escuro"}
                  </button>

                  {/* Links extras */}
                  <Link
                    to="/menu"
                    style={{
                      padding: "0.5rem 1rem",
                      borderRadius: "20px",
                      background: darkMode ? "#444" : "#eee",
                      color: darkMode ? "#fff" : "#222",
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      fontWeight: "500",
                      marginTop: "0.5rem",
                      width: "100%",
                    }}
                  >
                    ⚙️ Configurações
                  </Link>

                  {/* Login / Logout */}
                  {user ? (
                    <button
                      onClick={handleLogout}
                      style={{
                        padding: "0.5rem 1rem",
                        borderRadius: "20px",
                        background: darkMode ? "#444" : "#eee",
                        color: darkMode ? "#fff" : "#222",
                        width: "100%",
                        marginTop: "1rem",
                        cursor: "pointer",
                      }}
                    >
                      Sair
                    </button>
                  ) : (
                    <Link
                      to="/login"
                      style={{
                        padding: "0.5rem 1rem",
                        borderRadius: "20px",
                        background: darkMode ? "#444" : "#eee",
                        color: darkMode ? "#fff" : "#222",
                        width: "100%",
                        marginTop: "1rem",
                        display: "block",
                        textAlign: "center",
                        textDecoration: "none",
                      }}
                    >
                      Entrar
                    </Link>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Versão mobile mantém o mesmo comportamento */}
                <div style={{ width: "100%" }}>
                  <ul className="navbar-links-dropdown">
                    <li><Link to="/">Cardápio</Link></li>
                    <li><Link to="/perfil/1">Perfil</Link></li>
                    <li><Link to="/sobre">Sobre</Link></li>
                    <li><Link to="/restaurante">Restaurante</Link></li>
                  </ul>
                </div>
                <div style={{ width: "100%", marginTop: "1rem" }}>
                  {user ? (
                    <button
                      onClick={handleLogout}
                      style={{
                        background: darkMode ? "#444" : "#eee",
                        color: darkMode ? "#fff" : "#222",
                        borderRadius: "20px",
                        border: "none",
                        padding: "0.5rem 1rem",
                        width: "100%",
                        cursor: "pointer",
                      }}
                    >
                      Sair
                    </button>
                  ) : (
                    <Link
                      to="/login"
                      style={{
                        background: darkMode ? "#444" : "#eee",
                        color: darkMode ? "#fff" : "#222",
                        borderRadius: "20px",
                        padding: "0.5rem 1rem",
                        display: "block",
                        textAlign: "center",
                        textDecoration: "none",
                      }}
                    >
                      Entrar
                    </Link>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Logo */}
      <div
        className="navbar-logo !mr-15"
        style={{ fontWeight: "bold", fontSize: "1.5rem" }}
      >
        We<span></span>Food
      </div>
       <button
          onClick={() => {
            if (user) {
              navigate("/cart");
            } else {
              navigate("/login");
            }
          }}
          style={{
            position: "relative",
            background: darkMode ? "#333" : "#f5f5f5",
            color: darkMode ? "#fff" : "#333",
            border: darkMode ? "1px solid #444" : "#f5f5f5",
            padding: "0.6rem",
            borderRadius: "8px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s ease",
          }}
          className="hover:scale-105"
        >
          <ShoppingCart size={22} />
          {user && cart.length > 0 && (
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
              {cart.length}
            </span>
          )}
        </button>
        
    </nav>
  );
};

export default Navbar;

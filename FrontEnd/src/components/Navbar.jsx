import React, { useContext, useState, useEffect, useRef } from "react";
import { ThemeContext } from "../context/ThemeProvider";
import { Link, useLocation } from "react-router-dom";
import "../styles/Navbar.css";

import userAvatar from "../assets/images/placeholder1.png";

const Navbar = () => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 1224);
  const dropdownRef = useRef(null);
  const hamburgerRef = useRef(null);
  const location = useLocation();

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
          <li style={{ listStyle: "none" }}>
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
          <li style={{ listStyle: "none" }}>
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
          <li style={{ listStyle: "none" }}>
            <Link
              to="/sobre"
              style={{
                color: "inherit",
                textDecoration: "none",
                fontWeight: location.pathname === "/sobre" ? "bold" : "normal",
              }}
            >
              Sobre Nós
            </Link>
          </li>
          <li style={{ listStyle: "none" }}>
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
        {/* Pequeno menu dropdown abaixo da navbar quando o icone hamburger estiver ativo/aberto */}
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
                    <div className="navbar-user-label">UserN</div>
                  </div>
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
                  <button
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
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span style={{ marginRight: "0.4em", fontSize: "1.2em" }}>
                      🔔
                    </span>
                    Notificações
                  </button>
                  <Link
                    to="/menu"
                    style={{
                      padding: "0.5rem 1rem",
                      borderRadius: "20px",
                      border: "none",
                      background: darkMode ? "#444" : "#eee",
                      color: darkMode ? "#fff" : "#222",
                      cursor: "pointer",
                      marginTop: "0.5rem",
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      fontWeight: "500",
                      textDecoration: "none",
                    }}
                  >
                    <span style={{ marginRight: "0.4em", fontSize: "1.2em" }}>
                      ⚙️
                    </span>
                    Configurações
                  </Link>
                </div>
                <button
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
                    width: "100%",
                    marginTop: "auto",
                  }}
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <div style={{ width: "100%" }}>
                  <ul className="navbar-links-dropdown">
                    <li style={{ listStyle: "none" }}>
                      <Link
                        to="/"
                        style={{
                          color: "inherit",
                          textDecoration: "none",
                          fontWeight:
                            location.pathname === "/" ? "bold" : "normal",
                        }}
                      >
                        Cardápio
                      </Link>
                    </li>
                    <li style={{ listStyle: "none" }}>
                      <Link
                        to="/perfil/1"
                        style={{
                          color: "inherit",
                          textDecoration: "none",
                          fontWeight:
                            location.pathname === "/perfil/1"
                              ? "bold"
                              : "normal",
                        }}
                      >
                        Perfil
                      </Link>
                    </li>
                    <li style={{ listStyle: "none" }}>
                      <Link
                        to="/sobre"
                        style={{
                          color: "inherit",
                          textDecoration: "none",
                          fontWeight:
                            location.pathname === "/sobre" ? "bold" : "normal",
                        }}
                      >
                        Sobre
                      </Link>
                    </li>
                    <li style={{ listStyle: "none" }}>
                      <Link
                        to="/restaurante"
                        style={{
                          color: "inherit",
                          textDecoration: "none",
                          fontWeight:
                            location.pathname === "/restaurante"
                              ? "bold"
                              : "normal",
                        }}
                      >
                        Restaurante
                      </Link>
                    </li>
                  </ul>
                </div>
                <div style={{ width: "100%" }}>
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
                    <div className="navbar-user-label">UserN</div>
                  </div>
                  <button
                    onClick={toggleDarkMode}
                    className="navbar-dropdown-btn"
                    style={{
                      background: darkMode ? "#444" : "#eee",
                      color: darkMode ? "#fff" : "#222",
                    }}
                  >
                    {darkMode ? "☀ Tema Claro" : "☽ Tema Escuro"}
                  </button>
                  <button
                    className="navbar-dropdown-btn"
                    style={{
                      background: darkMode ? "#444" : "#eee",
                      color: darkMode ? "#fff" : "#222",
                      borderRadius: "20px",
                      border: "none",
                      padding: "0.5rem 1rem",
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "500",
                      cursor: "pointer",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <span style={{ marginRight: "0.4em", fontSize: "1.2em" }}>
                      🔔
                    </span>
                    Notificações
                  </button>
                  <Link
                    to="/menu"
                    className="navbar-dropdown-btn navbar-dropdown-link"
                    style={{
                      background: darkMode ? "#444" : "#eee",
                      color: darkMode ? "#fff" : "#222",
                      borderRadius: "20px",
                      border: "none",
                      padding: "0.5rem 1rem",
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      fontWeight: "500",
                      cursor: "pointer",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <span style={{ marginRight: "0.4em", fontSize: "1.2em" }}>
                      ⚙️
                    </span>
                    Configurações
                  </Link>
                  <button
                    className="navbar-dropdown-btn navbar-dropdown-logout"
                    style={{
                      background: darkMode ? "#444" : "#eee",
                      color: darkMode ? "#fff" : "#222",
                    }}
                  >
                    Sair
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
      {/* Logo na direita */}
      <div
        className="navbar-logo"
        style={{ fontWeight: "bold", fontSize: "1.5rem" }}
      >
        We<span></span>Food
      </div>
    </nav>
  );
};

export default Navbar;

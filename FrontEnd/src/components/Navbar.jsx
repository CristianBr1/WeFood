import React, { useContext, useState, useEffect, useRef } from "react";
import { ThemeContext } from "../context/ThemeProvider";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 1224);
  const dropdownRef = useRef(null);
  const hamburgerRef = useRef(null);

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
            <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
              Cardápio
            </Link>
          </li>
          <li style={{ listStyle: "none" }}>
            <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
              Favoritos
            </Link>
          </li>
          <li style={{ listStyle: "none" }}>
            <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
              Sobre
            </Link>
          </li>
          <li style={{ listStyle: "none" }}>
            <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
              Suporte
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
                  <div className="navbar-user-label">USUÁRIO</div>
                  <Link
                    to="/perfil"
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
                      justifyContent: "center",
                      fontWeight: "500",
                      textDecoration: "none",
                    }}
                  >
                    <span style={{ marginRight: "0.4em", fontSize: "1.2em" }}>
                      {darkMode ? "☻" : "☺︎"}
                    </span>
                    Seu Perfil
                  </Link>
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
                        style={{ color: "inherit", textDecoration: "none" }}
                      >
                        Cardápio
                      </Link>
                    </li>
                    <li style={{ listStyle: "none" }}>
                      <Link
                        to="/"
                        style={{ color: "inherit", textDecoration: "none" }}
                      >
                        Favoritos
                      </Link>
                    </li>
                    <li style={{ listStyle: "none" }}>
                      <Link
                        to="/"
                        style={{ color: "inherit", textDecoration: "none" }}
                      >
                        Sobre
                      </Link>
                    </li>
                    <li style={{ listStyle: "none" }}>
                      <Link
                        to="/"
                        style={{ color: "inherit", textDecoration: "none" }}
                      >
                        Suporte
                      </Link>
                    </li>
                  </ul>
                </div>
                <div style={{ width: "100%" }}>
                  <div
                    style={{
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                      marginBottom: "1rem",
                      width: "100%",
                      textAlign: "left",
                    }}
                  >
                    USUÁRIO
                  </div>
                  <button
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
                      justifyContent: "center",
                      textAlign: "center",
                      fontWeight: "500",
                      cursor: "pointer",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <span style={{ marginRight: "0.4em", fontSize: "1.2em" }}>
                      {darkMode ? "☻" : "☺︎"}
                    </span>
                    Perfil
                  </button>
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
        Logo
      </div>
    </nav>
  );
};

export default Navbar;

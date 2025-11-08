import React, { useContext } from "react";
import { Box, Typography, Link, IconButton } from "@mui/material";
import { ThemeContext } from "../context/ThemeProvider";
import { FaInstagram, FaFacebookF, FaTwitter } from "react-icons/fa";

const Footer = () => {
  const { darkMode } = useContext(ThemeContext);

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: darkMode ? "#222" : "#f8f8f8",
        color: darkMode ? "#fff" : "#333",
        py: 4,
        px: { xs: 3, md: 8 },
        mt: 8,
        borderTop: darkMode ? "1px solid #444" : "1px solid #ddd",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "center" },
          gap: 2,
        }}
      >
        {/* Seção de Links */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: { xs: 1, sm: 4 },
            mb: { xs: 2, md: 0 },
          }}
        >
          <Link href="#" underline="hover" color="inherit">
            Sobre
          </Link>
          <Link href="#" underline="hover" color="inherit">
            Contato
          </Link>
          <Link href="#" underline="hover" color="inherit">
            Ajuda
          </Link>
          <Link href="#" underline="hover" color="inherit">
            Termos
          </Link>
        </Box>

        {/* Redes sociais */}
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton
            href="#"
            sx={{ color: darkMode ? "#fff" : "#333" }}
            size="small"
          >
            <FaInstagram />
          </IconButton>
          <IconButton
            href="#"
            sx={{ color: darkMode ? "#fff" : "#333" }}
            size="small"
          >
            <FaFacebookF />
          </IconButton>
          <IconButton
            href="#"
            sx={{ color: darkMode ? "#fff" : "#333" }}
            size="small"
          >
            <FaTwitter />
          </IconButton>
        </Box>
      </Box>

      {/* Copyright */}
      <Typography
        variant="body2"
        sx={{
          mt: 2,
          textAlign: { xs: "center", md: "right" },
          fontSize: "0.8rem",
        }}
      >
        © {new Date().getFullYear()} WeFood. Todos os direitos reservados.
      </Typography>
    </Box>
  );
};

export default Footer;

import React, { useState, useContext } from "react";
import { ThemeContext } from "../context/ThemeProvider";
import AuthContext from "../context/AuthContext";
import { BannerService } from "../services/endpoints/banner.Service";
import { Button, TextField, Box, Typography } from "@mui/material";
import Loading from "../components/Loading";

const AddBanners = () => {
  const { darkMode } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);

  const [imageFile, setImageFile] = useState(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!imageFile) {
      setError("Selecione uma imagem para o banner.");
      return;
    }

    try {
      setLoading(true);

      // 🔹 Usa token do usuário
      await BannerService.createBanner(title, imageFile, user?.token);

      setSuccess("✅ Banner enviado com sucesso!");
      setTitle("");
      setImageFile(null);

      // Limpa mensagem após 3 segundos
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      // 🔹 Tratamento detalhado do erro
      console.error("Erro ao enviar banner:", err);
      setError(err.message || "Erro ao enviar banner.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        p: 6,
        borderRadius: 3,
        boxShadow: 3,
        bgcolor: darkMode ? "grey.900" : "background.paper",
        color: darkMode ? "white" : "black",
        maxWidth: 600,
        mx: "auto",
      }}
    >
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Adicionar Banner
      </Typography>

      {error && (
        <Typography color="error" mb={2}>
          {error}
        </Typography>
      )}
      {success && (
        <Typography color="success.main" mb={2}>
          {success}
        </Typography>
      )}

      {loading ? (
        <Loading text="Enviando banner..." />
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <TextField
            label="Título do Banner (opcional)"
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            sx={{
              backgroundColor: darkMode ? "#374151" : "#fff",
              input: { color: darkMode ? "#fff" : "#000" },
              label: { color: darkMode ? "#fff" : "#000" },
            }}
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            className={`p-2 rounded-md ${
              darkMode ? "bg-gray-800 text-white" : "bg-gray-100"
            }`}
          />

          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              backgroundColor: "#16a34a",
              "&:hover": { backgroundColor: "#10b981" },
              py: 1.2,
              fontWeight: 600,
            }}
          >
            Adicionar Banner
          </Button>
        </form>
      )}
    </Box>
  );
};

export default AddBanners;

import React, { useState, useContext } from "react";
import { ThemeContext } from "../context/ThemeProvider";
import { AuthContext } from "../context/AuthProvider";
import { CategoryService } from "../services/endpoints/category.Service";
import { Button, TextField, Box, Typography } from "@mui/material";
import Loading from "../components/Loading";

const AddCategories = () => {
  const { darkMode } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !image) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      // ✅ Não precisa passar token manualmente
      await CategoryService.createCategory(name, image);

      setSuccess("✅ Categoria adicionada com sucesso!");
      setName("");
      setImage(null);

      // Limpa mensagem de sucesso após 3 segundos
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Erro ao adicionar categoria:", err);
      setError(err.message || "Erro ao adicionar categoria.");
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
        Adicionar Categoria
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
        <Loading text="Enviando categoria..." />
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <TextField
            label="Nome da Categoria"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
            sx={{
              backgroundColor: darkMode ? "#374151" : "#fff",
              input: { color: darkMode ? "#fff" : "#000" },
              label: { color: darkMode ? "#fff" : "#000" },
            }}
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className={`p-2 rounded-md ${
              darkMode ? "bg-gray-800 text-white" : "bg-gray-100"
            }`}
            required
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
              textTransform: "none",
            }}
          >
            Adicionar Categoria
          </Button>
        </form>
      )}
    </Box>
  );
};

export default AddCategories;

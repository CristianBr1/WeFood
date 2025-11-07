import React, { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../context/ThemeProvider";
import { Box, Button, Typography, TextField } from "@mui/material";
import { CategoryService } from "../services/endpoints/category.Service";

import { getImageUrl } from "../services/config";

const CategoryModal = ({ category, onClose, onSave }) => {
  const { darkMode } = useContext(ThemeContext);

  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🧠 Atualiza campos quando a categoria muda
  useEffect(() => {
    setName(category?.name || "");
    setImage(null);
    setPreview(category?.image || null);
    setError("");
  }, [category]);

  // 📸 Preview da imagem
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(file ? URL.createObjectURL(file) : category?.image || null);
  };

  // 💾 Criar ou editar categoria
  const handleSave = async () => {
    if (!name.trim()) {
      setError("O nome da categoria é obrigatório.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let result;

      if (category?._id) {
        // 🟢 Atualizar categoria
        result = await CategoryService.updateCategory(
          category._id,
          name,
          image
        );
      } else {
        // 🆕 Criar categoria
        result = await CategoryService.createCategory(name, image);
      }

      onSave(result);
      onClose();
    } catch (err) {
      console.error("Erro ao salvar categoria:", err);
      setError(err?.message || "Erro ao salvar categoria.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm">
      <Box
        sx={{
          p: 5,
          borderRadius: 3,
          boxShadow: 5,
          bgcolor: darkMode ? "grey.900" : "white",
          color: darkMode ? "white" : "black",
          width: "100%",
          maxWidth: 420,
          transition: "all 0.3s ease",
        }}
      >
        <Typography variant="h6" fontWeight="bold" mb={3}>
          {category ? "Editar Categoria" : "Adicionar Categoria"}
        </Typography>

        {error && (
          <Typography color="error" mb={2} fontSize={14}>
            {error}
          </Typography>
        )}

        <TextField
          label="Nome da Categoria"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          variant="outlined"
          sx={{ mb: 2 }}
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="mb-3"
        />

        {preview && (
          <img
            src={preview.startsWith("blob:") ? preview : getImageUrl(preview)}
            alt="Preview"
            className="w-full h-36 object-cover rounded-lg mb-3 shadow"
          />
        )}

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button variant="outlined" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default CategoryModal;

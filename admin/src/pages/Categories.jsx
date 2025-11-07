import React, { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../context/ThemeProvider";
import AuthContext from "../context/AuthContext";
import Button from "@mui/material/Button";
import CategoryModal from "../components/CategoryModal";
import { CategoryService } from "../services/endpoints/category.Service";
import { Box, Typography } from "@mui/material";
import Loading from "../components/Loading";

import { getImageUrl } from "../services/config";

const Categories = () => {
  const { darkMode } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // 🔹 Carregar categorias
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const data = await CategoryService.getCategories();
        setCategories(data);
      } catch (err) {
        setError(err.message || "Erro ao carregar categorias");
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  // 🔹 Abrir modal de edição
  const handleEdit = (category) => {
    setSelectedCategory(category);
    setModalOpen(true);
  };

  // 🔹 Callback ao salvar categoria
  const handleSaveCategory = (updatedCategory) => {
    setCategories((prev) =>
      prev.map((c) => (c._id === updatedCategory._id ? updatedCategory : c))
    );
  };

  // 🔹 Excluir categoria
  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir esta categoria?"))
      return;
    try {
      await CategoryService.deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      setError(err.message || "Erro ao excluir categoria");
    }
  };

  return (
    <Box
      sx={{
        p: 4,
        borderRadius: 2,
        boxShadow: 3,
        bgcolor: darkMode ? "grey.900" : "white",
        color: darkMode ? "white" : "black",
        minHeight: "100vh",
      }}
    >
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Categorias
      </Typography>

      {error && (
        <Typography color="error" mb={2}>
          {error}
        </Typography>
      )}

      {loading ? (
        <Loading text="Carregando categorias..." />
      ) : categories.length === 0 ? (
        <Typography color="textSecondary">
          Nenhuma categoria encontrada.
        </Typography>
      ) : (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <div
              key={c._id}
              className={`flex flex-col p-4 rounded-lg shadow transition-all duration-200 ${
                darkMode
                  ? "bg-gray-800 hover:bg-gray-700"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <div className="flex items-center gap-4 mb-2">
                {c.image ? (
                  <img
                    src={getImageUrl(c.image)}
                    alt={c.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-300 rounded flex items-center justify-center text-gray-600">
                    -
                  </div>
                )}
                <Typography fontWeight={600} fontSize="1.1rem">
                  {c.name}
                </Typography>
              </div>

              <div className="mt-auto flex gap-2">
                <Button
                  variant="contained"
                  size="small"
                  color="success"
                  onClick={() => handleEdit(c)}
                  sx={{ flex: 1, textTransform: "none" }}
                >
                  Editar
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  color="error"
                  onClick={() => handleDelete(c._id)}
                  sx={{ flex: 1, textTransform: "none" }}
                >
                  Excluir
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <CategoryModal
          category={selectedCategory}
          onClose={() => setModalOpen(false)}
          onSave={handleSaveCategory}
        />
      )}
    </Box>
  );
};

export default Categories;

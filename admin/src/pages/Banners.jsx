import React, { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../context/ThemeProvider";
import { AuthContext } from "../context/AuthProvider";
import { BannerService } from "../services/endpoints/banner.Service";
import { Box, Typography, Button } from "@mui/material";
import Loading from "../components/Loading";

import { getImageUrl } from "../services/config";

const Banners = () => {
  const { darkMode } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);

  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  // 🔹 Carregar banners
  useEffect(() => {
    const loadBanners = async () => {
      try {
        setLoading(true);
        const data = await BannerService.getBanners();
        setBanners(data);
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            err.message ||
            "Erro ao carregar banners."
        );
      } finally {
        setLoading(false);
      }
    };
    loadBanners();
  }, []);

  // 🔹 Excluir banner
  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este banner?")) return;

    try {
      setDeletingId(id);
      await BannerService.deleteBanner(id, user?.token);
      setBanners((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      setError(
        err?.response?.data?.message || err.message || "Erro ao excluir banner."
      );
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <Loading text="Carregando banners..." />;

  return (
    <Box
      sx={{
        p: 6,
        minHeight: "100vh",
        bgcolor: darkMode ? "grey.900" : "grey.50",
        color: darkMode ? "white" : "black",
      }}
    >
      <Typography variant="h5" fontWeight="bold" mb={4}>
        Banners da Home
      </Typography>

      {error && (
        <Typography color="error" mb={3}>
          {error}
        </Typography>
      )}

      {banners.length === 0 ? (
        <Typography color="textSecondary">Nenhum banner encontrado.</Typography>
      ) : (
        <div className="grid gap-6">
          {banners.map((b) => (
            <div
              key={b._id}
              className={`relative rounded-xl overflow-hidden shadow-md border ${
                darkMode ? "border-gray-700 bg-gray-800" : "bg-white"
              }`}
            >
              {b.image ? (
                <img
                  src={getImageUrl(b.image)}
                  alt={b.title || "Banner"}
                  className="w-full h-64 object-cover"
                />
              ) : (
                <div className="w-full h-64 flex items-center justify-center text-gray-400">
                  Sem imagem
                </div>
              )}

              <Button
                variant="contained"
                color="error"
                size="small"
                onClick={() => handleDelete(b._id)}
                disabled={deletingId === b._id}
                sx={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  textTransform: "none",
                }}
              >
                {deletingId === b._id ? "Excluindo..." : "Excluir"}
              </Button>
            </div>
          ))}
        </div>
      )}
    </Box>
  );
};

export default Banners;

import React, { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../context/ThemeProvider";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { StoreManageService } from "../services/endpoints/storeManage.Service";
import { getImageUrl } from "../services/config";

const LogoManage = () => {
  const { darkMode } = useContext(ThemeContext);

  const [storeName, setStoreName] = useState("");
  const [logoFile, setLogoFile] = useState(null);
  const [currentLogo, setCurrentLogo] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // 🔹 Buscar dados existentes
  useEffect(() => {
    const fetchStore = async () => {
      try {
        const data = await StoreManageService.getStore();
        setStoreName(data.name || "");
        setCurrentLogo(data.logo || "");
      } catch (err) {
        console.error(err);
        setError(err.message || "Erro ao carregar dados da loja");
      }
    };
    fetchStore();
  }, []);

  // 🔹 Submeter formulário (nome + logo)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!storeName.trim()) {
      setError("Informe o nome da loja.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const data = await StoreManageService.updateStore(storeName, logoFile);
      setCurrentLogo(data.logo || "");
      setLogoFile(null);
      setSuccess("Informações da loja salvas com sucesso!");
    } catch (err) {
      console.error(err);
      setError(err.message || "Erro ao salvar dados da loja");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Deletar logo
  const handleDeleteLogo = async () => {
    try {
      await StoreManageService.deleteLogo();
      setCurrentLogo("");
      setSuccess("Logo excluída com sucesso!");
    } catch (err) {
      console.error(err);
      setError(err.message || "Erro ao excluir logo");
    }
  };

  return (
    <div
      className={`p-6 rounded-md shadow-md ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <h2 className="text-2xl font-bold mb-4">Gerenciar Loja</h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}
      {success && <p className="text-green-500 mb-2">{success}</p>}

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {/* Nome da loja */}
        <TextField
          label="Nome da Loja"
          variant="outlined"
          value={storeName}
          onChange={(e) => setStoreName(e.target.value)}
          required
          fullWidth
          sx={{ backgroundColor: darkMode ? "#374151" : "#fff" }}
          InputLabelProps={{ style: { color: darkMode ? "#fff" : "#000" } }}
          InputProps={{ style: { color: darkMode ? "#fff" : "#000" } }}
        />

        {/* Logo atual */}
        <div className="flex items-center gap-4 mt-2">
          <img
            src={
              currentLogo
                ? currentLogo.startsWith("http")
                  ? currentLogo
                  : getImageUrl(currentLogo)
                : "/placeholder.jpg"
            }
            alt="Logo atual"
            className="w-24 h-24 object-cover rounded-md border"
          />
          {currentLogo && (
            <Button
              variant="outlined"
              color="error"
              onClick={handleDeleteLogo}
              sx={{ fontWeight: 600 }}
            >
              Excluir Logo
            </Button>
          )}
        </div>

        {/* Upload nova logo */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setLogoFile(e.target.files[0])}
          className="p-2 border rounded-md mt-2"
        />

        {/* Preview da nova imagem */}
        {logoFile && (
          <img
            src={URL.createObjectURL(logoFile)}
            alt="Preview da nova logo"
            className="w-24 h-24 object-cover rounded-md mt-2 border"
          />
        )}

        {/* Botão salvar */}
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
          {loading ? "Salvando..." : "Salvar Loja"}
        </Button>
      </form>
    </div>
  );
};

export default LogoManage;

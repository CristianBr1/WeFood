import React, { useState, useContext, useEffect } from "react";
import { ThemeContext } from "../context/ThemeProvider";
import AuthContext from "../context/AuthContext";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

const LogoManage = () => {
  const { darkMode } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);

  const [storeName, setStoreName] = useState("");
  const [logoFile, setLogoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Opcional: carregar informações existentes do backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/store", {
          headers: { Authorization: user?.token ? `Bearer ${user.token}` : "" },
        });
        if (!res.ok) throw new Error("Erro ao buscar dados da loja");
        const data = await res.json();
        setStoreName(data.name || "");
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!storeName) {
      setError("Informe o nome da loja.");
      return;
    }

    const formData = new FormData();
    formData.append("name", storeName);
    if (logoFile) formData.append("logo", logoFile);

    try {
      setLoading(true);
      const res = await fetch("/api/store", {
        method: "POST",
        headers: { Authorization: user?.token ? `Bearer ${user.token}` : "" },
        body: formData,
      });

      if (!res.ok) throw new Error("Erro ao salvar dados da loja");

      setSuccess("Informações da loja salvas com sucesso!");
      setError("");
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`p-6 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"} rounded-md shadow-md`}>
      <h2 className="text-2xl font-bold mb-4">Gerenciar Loja</h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}
      {success && <p className="text-green-500 mb-2">{success}</p>}

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setLogoFile(e.target.files[0])}
          className="p-2 border rounded-md"
        />

        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          sx={{ backgroundColor: "#16a34a", "&:hover": { backgroundColor: "#10b981" }, py: 1.2, fontWeight: 600 }}
        >
          {loading ? "Salvando..." : "Salvar Loja"}
        </Button>
      </form>
    </div>
  );
};

export default LogoManage;

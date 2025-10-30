import React, { useState, useContext } from "react";
import { ThemeContext } from "../context/ThemeProvider";
import AuthContext from "../context/AuthContext";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

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
    if (!imageFile) {
      setError("Selecione uma imagem para o banner.");
      return;
    }

    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("title", title);

    try {
      setLoading(true);
      const res = await fetch("/api/banners", {
        method: "POST",
        headers: {
          Authorization: user?.token ? `Bearer ${user.token}` : "",
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Erro ao enviar o banner");

      setSuccess("Banner enviado com sucesso!");
      setTitle("");
      setImageFile(null);
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
      <h2 className="text-2xl font-bold mb-4">Adicionar Banner</h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}
      {success && <p className="text-green-500 mb-2">{success}</p>}

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <TextField
          label="Título do Banner (opcional)"
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          sx={{ backgroundColor: darkMode ? "#374151" : "#fff" }}
          InputLabelProps={{ style: { color: darkMode ? "#fff" : "#000" } }}
          InputProps={{ style: { color: darkMode ? "#fff" : "#000" } }}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
          className="p-2 border rounded-md"
        />

        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          sx={{ backgroundColor: "#16a34a", "&:hover": { backgroundColor: "#10b981" }, py: 1.2, fontWeight: 600 }}
        >
          {loading ? "Enviando..." : "Adicionar Banner"}
        </Button>
      </form>
    </div>
  );
};

export default AddBanners;

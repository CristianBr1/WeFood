import React, { useState, useContext } from "react";
import { ThemeContext } from "../context/ThemeProvider";
import AuthContext from "../context/AuthContext";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const AddCategories = () => {
  const { darkMode } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name || !image) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("image", image);

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: {
          Authorization: user?.token ? `Bearer ${user.token}` : "",
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Erro ao criar categoria");

      setSuccess("Categoria adicionada com sucesso!");
      setName("");
      setImage(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={`p-6 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"} rounded-md shadow-md`}>
      <h2 className="text-2xl font-bold mb-4">Adicionar Categoria</h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}
      {success && <p className="text-green-500 mb-2">{success}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <TextField
          label="Nome da Categoria"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          required
        />

        <Button type="submit" variant="contained" color="primary">
          Adicionar Categoria
        </Button>
      </form>
    </div>
  );
};

export default AddCategories;

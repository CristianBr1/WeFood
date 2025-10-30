import React, { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../context/ThemeProvider";
import AuthContext from "../context/AuthContext";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";

const AddProducts = () => {
  const { darkMode } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [extras, setExtras] = useState([{ name: "", price: "" }]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Pegar categorias do backend
  useEffect(() => {
    fetch("/api/categories")
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error(err));
  }, []);

  const handleExtraChange = (index, field, value) => {
    const newExtras = [...extras];
    newExtras[index][field] = value;
    setExtras(newExtras);
  };

  const handleAddExtra = () => {
    setExtras([...extras, { name: "", price: "" }]);
  };

  const handleRemoveExtra = (index) => {
    const newExtras = extras.filter((_, i) => i !== index);
    setExtras(newExtras);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name || !price || !category || !image) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("image", image);
    formData.append("extras", JSON.stringify(extras));

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          Authorization: user?.token ? `Bearer ${user.token}` : "",
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erro ao criar produto");

      setSuccess("Produto adicionado com sucesso!");
      setName("");
      setPrice("");
      setCategory("");
      setImage(null);
      setExtras([{ name: "", price: "" }]);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={`p-6 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"} rounded-md shadow-md`}>
      <h2 className="text-2xl font-bold mb-4">Adicionar Produto</h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}
      {success && <p className="text-green-500 mb-2">{success}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <TextField label="Nome do Produto" value={name} onChange={(e) => setName(e.target.value)} required />
        <TextField label="Preço" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />

        <Select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          displayEmpty
          required
        >
          <MenuItem value="" disabled>Selecione a categoria</MenuItem>
          {categories.map((cat) => (
            <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
          ))}
        </Select>

        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} required />

        {/* Extras */}
        <div>
          <label className="font-semibold mb-2 block">Extras (opcionais)</label>
          {extras.map((extra, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <TextField
                label="Nome do extra"
                value={extra.name}
                onChange={(e) => handleExtraChange(index, "name", e.target.value)}
              />
              <TextField
                label="Preço do extra"
                type="number"
                value={extra.price}
                onChange={(e) => handleExtraChange(index, "price", e.target.value)}
              />
              <IconButton onClick={() => handleRemoveExtra(index)}><AiOutlineMinus /></IconButton>
            </div>
          ))}
          <Button onClick={handleAddExtra} startIcon={<AiOutlinePlus />}>Adicionar Extra</Button>
        </div>

        <Button type="submit" variant="contained" color="primary">Adicionar Produto</Button>
      </form>
    </div>
  );
};

export default AddProducts;

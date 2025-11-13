import React, { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../context/ThemeProvider";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import Loading from "../components/Loading";

import { CategoryService } from "../services/endpoints/category.Service";
import { ProductService } from "../services/endpoints/product.Service";

const AddProducts = () => {
  const { darkMode } = useContext(ThemeContext);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [extras, setExtras] = useState([{ name: "", price: "" }]);
  const [meatOptions, setMeatOptions] = useState({
    enabled: false,
    min: 1,
    max: 3,
    pricePerExtra: 5,
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      try {
        const data = await CategoryService.getCategories();
        setCategories(data);
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar categorias.");
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  const handleExtraChange = (index, field, value) => {
    const updated = [...extras];
    updated[index][field] = value;
    setExtras(updated);
  };

  const handleAddExtra = () => setExtras([...extras, { name: "", price: "" }]);
  const handleRemoveExtra = (index) =>
    setExtras(extras.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name || !price || !category || !image || !description) {
      return setError("Preencha todos os campos obrigatórios.");
    }

    try {
      setLoading(true);

      // ✅ Converter extras e meatOptions para tipos corretos
      const preparedExtras = extras.map((ex) => ({
        name: ex.name,
        price: Number(ex.price) || 0,
      }));

      const preparedMeatOptions = meatOptions.enabled
        ? {
            ...meatOptions,
            min: Number(meatOptions.min),
            max: Number(meatOptions.max),
            pricePerExtra: Number(meatOptions.pricePerExtra),
          }
        : { enabled: false };

      await ProductService.createProduct(
        {
          name,
          price: Number(price),
          category,
          description,
          extras: preparedExtras,
          meatOptions: preparedMeatOptions,
        },
        image
      );

      setSuccess("✅ Produto adicionado com sucesso!");
      setName("");
      setPrice("");
      setCategory("");
      setImage(null);
      setExtras([{ name: "", price: "" }]);
      setMeatOptions({ enabled: false, min: 1, max: 3, pricePerExtra: 5 });
      setDescription("");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Erro ao adicionar produto:", err);
      setError(err.message || "Erro ao adicionar produto.");
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
        maxWidth: 800,
        mx: "auto",
      }}
    >
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Adicionar Produto
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
        <Loading text="Processando..." />
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <TextField
            label="Nome do Produto"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Preço"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            fullWidth
          />

          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            displayEmpty
            required
            fullWidth
          >
            <MenuItem value="" disabled>
              Selecione a categoria
            </MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat._id} value={cat._id}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            required
            className="p-2 border rounded-md"
          />

          <div>
            <label className="font-semibold mb-2 block">
              Descrição do Produto
            </label>
            <textarea
              className={`w-full p-2 rounded-md ${
                darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-100"
              } border outline-none resize-none`}
              rows="3"
              placeholder="Ex: Hambúrguer artesanal com cheddar e bacon"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="font-semibold mb-2 block">
              Extras (opcionais)
            </label>
            {extras.map((extra, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <TextField
                  label="Nome do extra"
                  value={extra.name}
                  onChange={(e) =>
                    handleExtraChange(index, "name", e.target.value)
                  }
                />
                <TextField
                  label="Preço do extra"
                  type="number"
                  value={extra.price}
                  onChange={(e) =>
                    handleExtraChange(index, "price", e.target.value)
                  }
                />
                <IconButton onClick={() => handleRemoveExtra(index)}>
                  <AiOutlineMinus />
                </IconButton>
              </div>
            ))}
            <Button onClick={handleAddExtra} startIcon={<AiOutlinePlus />}>
              Adicionar Extra
            </Button>
          </div>

          <div>
            <label className="font-semibold mb-2 block">
              Opções de Carne (opcional)
            </label>
            <div className="flex items-center gap-3 mb-2">
              <label>
                <input
                  type="checkbox"
                  checked={meatOptions.enabled}
                  onChange={(e) =>
                    setMeatOptions({
                      ...meatOptions,
                      enabled: e.target.checked,
                    })
                  }
                />{" "}
                Habilitar seleção de carnes
              </label>
            </div>
            {meatOptions.enabled && (
              <div className="grid grid-cols-3 gap-3">
                <TextField
                  label="Mínimo"
                  type="number"
                  value={meatOptions.min}
                  onChange={(e) =>
                    setMeatOptions({
                      ...meatOptions,
                      min: Number(e.target.value),
                    })
                  }
                />
                <TextField
                  label="Máximo"
                  type="number"
                  value={meatOptions.max}
                  onChange={(e) =>
                    setMeatOptions({
                      ...meatOptions,
                      max: Number(e.target.value),
                    })
                  }
                />
                <TextField
                  label="Preço adicional por carne extra"
                  type="number"
                  value={meatOptions.pricePerExtra}
                  onChange={(e) =>
                    setMeatOptions({
                      ...meatOptions,
                      pricePerExtra: Number(e.target.value),
                    })
                  }
                />
              </div>
            )}
          </div>

          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: "#16a34a",
              "&:hover": { backgroundColor: "#10b981" },
              py: 1.2,
              fontWeight: 600,
              textTransform: "none",
            }}
          >
            Adicionar Produto
          </Button>
        </form>
      )}
    </Box>
  );
};

export default AddProducts;

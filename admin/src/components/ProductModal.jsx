import React, { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../context/ThemeProvider";
import AuthContext from "../context/AuthContext";
import { ProductService } from "../services/endpoints/product.Service";
import { Button, TextField, Select, MenuItem, IconButton, FormControlLabel, Checkbox, Box, Typography } from "@mui/material";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import Loading from "./Loading";

const ProductModal = ({ product, onClose, isEdit, categories = [], refreshProducts }) => {
  const { darkMode } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);

  if (isEdit && !product) return null;

  const [name, setName] = useState(product?.name || "");
  const [price, setPrice] = useState(product?.price || "");
  const [category, setCategory] = useState(product?.category?._id || "");
  const [image, setImage] = useState(null);
  const [extras, setExtras] = useState(product?.extras || []);
  const [description, setDescription] = useState(product?.description || "");

  const [meatOptionsEnabled, setMeatOptionsEnabled] = useState(product?.meatOptions?.enabled || false);
  const [meatMin, setMeatMin] = useState(product?.meatOptions?.min || 1);
  const [meatMax, setMeatMax] = useState(product?.meatOptions?.max || 1);
  const [meatPricePerExtra, setMeatPricePerExtra] = useState(product?.meatOptions?.pricePerExtra || 0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEdit && product) {
      setName(product.name || "");
      setPrice(product.price || "");
      setCategory(product.category?._id || "");
      setExtras(product.extras || []);
      setDescription(product.description || "");
      setMeatOptionsEnabled(product.meatOptions?.enabled || false);
      setMeatMin(product.meatOptions?.min || 1);
      setMeatMax(product.meatOptions?.max || 1);
      setMeatPricePerExtra(product.meatOptions?.pricePerExtra || 0);
      setImage(null);
    }
  }, [isEdit, product]);

  // 🔹 Extras
  const handleExtraChange = (index, field, value) => {
    const newExtras = [...extras];
    newExtras[index][field] = field === "price" ? Number(value) : value;
    setExtras(newExtras);
  };
  const handleAddExtra = () => setExtras([...extras, { name: "", price: 0 }]);
  const handleRemoveExtra = (index) => setExtras(extras.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !price || !category) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }
    if (price < 0) {
      setError("O preço do produto não pode ser negativo.");
      return;
    }
    if (meatOptionsEnabled && (meatMin < 0 || meatMax < meatMin || meatPricePerExtra < 0)) {
      setError("Valores de carne inválidos.");
      return;
    }

    const data = {
      name,
      price,
      category,
      description,
      extras,
      meatOptions: {
        enabled: meatOptionsEnabled,
        min: meatMin,
        max: meatMax,
        pricePerExtra: meatPricePerExtra,
      },
    };

    try {
      setLoading(true);
      if (isEdit && product?._id) {
        await ProductService.updateProduct(product._id, data, image, user?.token);
      } else {
        await ProductService.createProduct(data, image, user?.token);
      }
      refreshProducts?.();
      onClose?.();
    } catch (err) {
      setError(err.message || "Erro ao salvar produto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal-overlay fixed inset-0 flex justify-center items-center z-50"
      style={{ background: darkMode ? "rgba(34,34,34,0.85)" : "rgba(0,0,0,0.4)" }}
      onClick={onClose}
    >
      <div
        className="modal p-6 rounded-md shadow-md relative w-full max-w-lg overflow-auto max-h-[90vh]"
        style={{ background: darkMode ? "#222" : "#fff", color: darkMode ? "#fff" : "#222" }}
        onClick={(e) => e.stopPropagation()}
      >
        <Typography variant="h6" fontWeight="bold" mb={2}>
          {isEdit ? "Editar Produto" : "Adicionar Produto"}
        </Typography>

        {error && <Typography color="error" mb={2}>{error}</Typography>}

        {loading ? <Loading text="Salvando produto..." /> : (
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <TextField label="Nome" value={name} onChange={e => setName(e.target.value)} required />
            <TextField label="Preço" type="number" value={price} onChange={e => setPrice(Number(e.target.value))} required />
            
            <Select value={category} onChange={e => setCategory(e.target.value)} required>
              <MenuItem value="" disabled>Selecione a categoria</MenuItem>
              {categories.map(c => <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>)}
            </Select>

            <TextField label="Descrição" value={description} onChange={e => setDescription(e.target.value)} multiline rows={3} />

            <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} />

            {/* Extras */}
            <Box>
              <Typography fontWeight="bold">Extras</Typography>
              {extras.map((extra, i) => (
                <Box key={i} display="flex" alignItems="center" gap={1} mb={1}>
                  <TextField label="Nome" value={extra.name} onChange={e => handleExtraChange(i, "name", e.target.value)} />
                  <TextField label="Preço" type="number" value={extra.price} onChange={e => handleExtraChange(i, "price", e.target.value)} />
                  <IconButton onClick={() => handleRemoveExtra(i)}><AiOutlineMinus /></IconButton>
                </Box>
              ))}
              <Button onClick={handleAddExtra} startIcon={<AiOutlinePlus />}>Adicionar Extra</Button>
            </Box>

            {/* Opções de carne */}
            <Box mt={2}>
              <FormControlLabel
                control={<Checkbox checked={meatOptionsEnabled} onChange={e => setMeatOptionsEnabled(e.target.checked)} />}
                label="Habilitar opções de carne"
              />
              {meatOptionsEnabled && (
                <Box display="flex" gap={2} flexWrap="wrap">
                  <TextField label="Mínimo" type="number" value={meatMin} onChange={e => setMeatMin(Number(e.target.value))} />
                  <TextField label="Máximo" type="number" value={meatMax} onChange={e => setMeatMax(Number(e.target.value))} />
                  <TextField label="Preço extra" type="number" value={meatPricePerExtra} onChange={e => setMeatPricePerExtra(Number(e.target.value))} />
                </Box>
              )}
            </Box>

            <Button type="submit" variant="contained" color="primary">
              {isEdit ? "Atualizar Produto" : "Adicionar Produto"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProductModal;

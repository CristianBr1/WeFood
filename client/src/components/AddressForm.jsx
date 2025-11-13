import { useState, useEffect, useContext } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { ThemeContext } from "../context/ThemeProvider";
import { useAddressContext } from "../hooks/useAddressContext";

const AddressForm = ({ onClose }) => {
  const { darkMode } = useContext(ThemeContext);
  const { selectedAddress, setSelectedAddress, createAddress, updateAddress } =
    useAddressContext();

  const [address, setAddress] = useState("");
  const [number, setNumber] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [cep, setCep] = useState("");
  const [complement, setComplement] = useState("");
  const [favoriteAs, setFavoriteAs] = useState("Casa");
  const [loading, setLoading] = useState(false);

  // ============================ VIA CEP =============================
  const fetchViaCep = async (cepValue) => {
    const cleanCep = cepValue.replace(/\D/g, "");

    if (cleanCep.length !== 8) return;

    try {
      const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setAddress(data.logradouro || "");
        setNeighborhood(data.bairro || "");
        setCity(data.localidade || "");
      }
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
    }
  };

  const handleCepChange = (v) => {
    const mask = v.replace(/\D/g, "").replace(/(\d{5})(\d)/, "$1-$2");
    setCep(mask);
    fetchViaCep(mask);
  };

  // ============================ Inicialização =============================
  useEffect(() => {
    if (selectedAddress) {
      const line = selectedAddress.address_line || "";
      const [street, num] = line.split(",").map((s) => s.trim());

      setAddress(street || "");
      setNumber(num || "");
      setNeighborhood(selectedAddress.neighborhood || "");
      setCity(selectedAddress.city || "");
      setCep(selectedAddress.pincode || "");
      setComplement(selectedAddress.complement || "");
      setFavoriteAs(selectedAddress.favoriteAs || "Casa");
    } else {
      setAddress("");
      setNumber("");
      setNeighborhood("");
      setCity("");
      setCep("");
      setComplement("");
      setFavoriteAs("Casa");
    }
  }, [selectedAddress]);

  // ============================ Envio =============================
  const handleSubmit = async () => {
    if (!address || !number || !neighborhood || !city || !cep) {
      return alert("Preencha todos os campos obrigatórios.");
    }

    const payload = {
      address_line: `${address}, ${number}`,
      neighborhood,
      city,
      pincode: cep,
      complement,
      favoriteAs,
      // state removido — vem como default no schema
      // reference removido — não existe no schema
    };

    try {
      setLoading(true);

      let saved;
      if (selectedAddress?._id) {
        saved = await updateAddress(selectedAddress._id, payload);
      } else {
        saved = await createAddress(payload);
      }

      setSelectedAddress(saved);
      if (onClose) onClose();
    } catch (err) {
      console.error("Erro ao salvar endereço:", err);
      alert("Erro ao salvar endereço");
    } finally {
      setLoading(false);
    }
  };

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: darkMode ? "#222" : "#fff",
      color: darkMode ? "#fff" : "#000",
      "& fieldset": { borderColor: darkMode ? "#555" : "#d1d5db" },
      "&:hover fieldset": { borderColor: darkMode ? "#9ca3af" : "#16a34a" },
      "&.Mui-focused fieldset": {
        borderColor: darkMode ? "#4ade80" : "#16a34a",
      },
    },
    "& .MuiInputLabel-root": { color: darkMode ? "#fff" : "#000" },
  };

  return (
    <Box
      sx={{
        width: { xs: "90%", sm: 400 },
        mx: "auto",
        mt: 4,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        p: 3,
        borderRadius: 2,
        backgroundColor: darkMode ? "#222" : "#fff",
      }}
    >
      <Typography variant="h6" sx={{ textAlign: "center" }}>
        {selectedAddress ? "Editar Endereço" : "Novo Endereço"}
      </Typography>

      <TextField
        label="CEP"
        value={cep}
        onChange={(e) => handleCepChange(e.target.value)}
        fullWidth
        sx={inputSx}
      />

      <TextField
        label="Rua"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        fullWidth
        sx={inputSx}
      />

      <TextField
        label="Número"
        value={number}
        onChange={(e) => setNumber(e.target.value)}
        fullWidth
        sx={inputSx}
      />

      <TextField
        label="Bairro"
        value={neighborhood}
        onChange={(e) => setNeighborhood(e.target.value)}
        fullWidth
        sx={inputSx}
      />

      <TextField
        label="Cidade"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        fullWidth
        sx={inputSx}
      />

      <TextField
        label="Complemento"
        value={complement}
        onChange={(e) => setComplement(e.target.value)}
        fullWidth
        sx={inputSx}
      />

      <Box>
        <Typography variant="body2">Favoritar como:</Typography>
        <RadioGroup
          row
          value={favoriteAs}
          onChange={(e) => setFavoriteAs(e.target.value)}
        >
          <FormControlLabel value="Casa" control={<Radio />} label="Casa" />
          <FormControlLabel
            value="Trabalho"
            control={<Radio />}
            label="Trabalho"
          />
        </RadioGroup>
      </Box>

      <Button
        variant="contained"
        color="success"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Salvando..." : "Salvar Endereço"}
      </Button>
    </Box>
  );
};

export default AddressForm;

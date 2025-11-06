import { useState, useContext } from "react";
import {useAuthContext} from "../hooks/useAuthContext";
import { ThemeContext } from "../context/ThemeProvider";
import {
  Box,
  Button,
  TextField,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
// AddressForm delegates saving to parent via onSave

const AddressForm = ({ onSave, userAddress }) => {
  const { darkMode } = useContext(ThemeContext);
  const { user } = useAuthContext();

  const initialAddressLine = userAddress?.address_line || "";
  let initialStreet = initialAddressLine;
  let initialNumber = "";

  if (initialAddressLine.includes(",")) {
    const parts = initialAddressLine.split(",");
    initialStreet = parts[0].trim();
    initialNumber = parts[1]?.trim() || "";
  }

  const [address, setAddress] = useState(initialStreet);
  const [number, setNumber] = useState(initialNumber);
  const [neighborhood, setNeighborhood] = useState(userAddress?.neighborhood || "");
  const [cityState, setCityState] = useState(
    userAddress ? `${userAddress.city} - ${userAddress.state}` : ""
  );
  const [cep, setCep] = useState(userAddress?.pincode || "");
  const [complement, setComplement] = useState(userAddress?.complement || "");
  const [reference, setReference] = useState(userAddress?.reference || "");
  const [favoriteAs, setFavoriteAs] = useState(userAddress?.favoriteAs || "Casa");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!address || !number || !neighborhood || !cityState || !cep) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    const [city, state] = cityState.split("-").map((s) => s.trim());

    const payload = {
      address_line: `${address}, ${number}`,
      neighborhood,
      city: city || "",
      state: state || "",
      pincode: cep,
      complement,
      reference,
      favoriteAs,
      country: "Brasil",
      userId: user._id,
    };

    try {
      setLoading(true);

      // Delegate the actual save to the parent/context so it can update
      // centralized state (and avoid double-posting here).
      const toSave = userAddress?._id ? { ...payload, _id: userAddress._id } : payload;
      onSave(toSave);
    } catch (err) {
      console.error(err);
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
      "&.Mui-focused fieldset": { borderColor: darkMode ? "#4ade80" : "#16a34a" },
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
        Endereço de entrega
      </Typography>

      <TextField label="Rua" value={address} onChange={(e) => setAddress(e.target.value)} fullWidth sx={inputSx} />
      <TextField label="Número" value={number} onChange={(e) => setNumber(e.target.value)} fullWidth sx={inputSx} />
      <TextField label="Bairro" value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} fullWidth sx={inputSx} />
      <TextField label="Cidade - Estado (ex: São Paulo - SP)" value={cityState} onChange={(e) => setCityState(e.target.value)} fullWidth sx={inputSx} />
      <TextField label="CEP" value={cep} onChange={(e) => setCep(e.target.value)} fullWidth sx={inputSx} />
      <TextField label="Complemento" value={complement} onChange={(e) => setComplement(e.target.value)} fullWidth sx={inputSx} />
      <TextField label="Ponto de referência" value={reference} onChange={(e) => setReference(e.target.value)} fullWidth sx={inputSx} />

      <Box>
        <Typography variant="body2">Favoritar como:</Typography>
        <RadioGroup row value={favoriteAs} onChange={(e) => setFavoriteAs(e.target.value)}>
          <FormControlLabel value="Casa" control={<Radio />} label="Casa" />
          <FormControlLabel value="Trabalho" control={<Radio />} label="Trabalho" />
        </RadioGroup>
      </Box>

      <Button variant="contained" color="success" onClick={handleSubmit} disabled={loading}>
        {loading ? "Salvando..." : "Salvar Endereço"}
      </Button>
    </Box>
  );
};

export default AddressForm;

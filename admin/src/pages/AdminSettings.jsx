import { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, Divider, CircularProgress } from "@mui/material";
import { SettingsService } from "../services/endpoints/settings.Service";

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    serviceFee: 0,
    deliveryFee: 0,
    minOrderAmount: 0,
    restaurantOpen: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        const data = await SettingsService.getSettings();
        setSettings(data);
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar configurações");
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await SettingsService.updateSettings(settings);
      alert("Configurações salvas com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar configurações");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", p: 3, bgcolor: "#fff", borderRadius: 2, boxShadow: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Configurações do Sistema</Typography>
      <Divider sx={{ mb: 2 }} />

      <TextField
        label="Taxa de serviço (R$)"
        type="number"
        fullWidth
        sx={{ mb: 2 }}
        value={settings.serviceFee}
        onChange={(e) => handleChange("serviceFee", parseFloat(e.target.value))}
        inputProps={{ min: 0 }}
      />

      <TextField
        label="Taxa de entrega (R$)"
        type="number"
        fullWidth
        sx={{ mb: 2 }}
        value={settings.deliveryFee}
        onChange={(e) => handleChange("deliveryFee", parseFloat(e.target.value))}
        inputProps={{ min: 0 }}
      />

      <TextField
        label="Valor mínimo do pedido (R$)"
        type="number"
        fullWidth
        sx={{ mb: 2 }}
        value={settings.minOrderAmount}
        onChange={(e) => handleChange("minOrderAmount", parseFloat(e.target.value))}
        inputProps={{ min: 0 }}
      />

      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <input
          type="checkbox"
          checked={settings.restaurantOpen}
          onChange={(e) => handleChange("restaurantOpen", e.target.checked)}
          id="restaurantOpen"
        />
        <label htmlFor="restaurantOpen" style={{ marginLeft: 8 }}>Restaurante aberto</label>
      </Box>

      <Button
        variant="contained"
        color="success"
        fullWidth
        onClick={handleSave}
        disabled={saving}
      >
        {saving ? "Salvando..." : "Salvar Configurações"}
      </Button>

      {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
    </Box>
  );
};

export default AdminSettings;

import SettingsModel from "../models/settings.model.js";

export const getSettings = async (req, res) => {
  try {
    const settings = await SettingsModel.findOne();
    res.status(200).json(settings);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar configurações" });
  }
};

export const updateSettings = async (req, res) => {
  try {
    // Apenas admin pode acessar esta rota (middleware)
    const settings = await SettingsModel.findOneAndUpdate(
      {},
      { ...req.body },
      { new: true, upsert: true }
    );

    res.status(200).json(settings);
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar configurações" });
  }
};

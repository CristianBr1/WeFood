import AddressModel from "../models/address.model.js";

// 🔹 Listar endereços do usuário
export const getAddresses = async (req, res) => {
  try {
    const addresses = await AddressModel.find({ userId: req.user._id });
    res.json(addresses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔹 Adicionar novo endereço
export const createAddress = async (req, res) => {
  try {
    const newAddress = new AddressModel({ ...req.body, userId: req.user._id });
    await newAddress.save();
    res.status(201).json(newAddress);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 🔹 Atualizar endereço
export const updateAddress = async (req, res) => {
  try {
    const address = await AddressModel.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    if (!address) return res.status(404).json({ message: "Endereço não encontrado" });
    res.json(address);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 🔹 Excluir endereço
export const deleteAddress = async (req, res) => {
  try {
    const address = await AddressModel.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!address) return res.status(404).json({ message: "Endereço não encontrado" });
    res.json({ message: "Endereço removido" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// src/context/AddressProvider.jsx
import { createContext, useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { AddressService } from "../services/endpoints/address.Service";

export const AddressContext = createContext(null);

const AddressProvider = ({ children }) => {
  const { user } = useAuthContext(); // 🔹 pega o token automaticamente
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(false);

  // ===================== BUSCAR ENDEREÇOS =====================
  const fetchAddresses = async () => {
    if (!user?.token) return;
    setLoading(true);
    try {
      const data = await AddressService.getAddresses(user.token);
      setAddresses(data || []);
      if (data?.length > 0) setSelectedAddress(data[0]);
    } catch (err) {
      console.error("Erro ao buscar endereços:", err);
    } finally {
      setLoading(false);
    }
  };

  // ===================== CRIAR ENDEREÇO =====================
  const createAddress = async (addressData) => {
    try {
      const newAddress = await AddressService.createAddress(addressData, user.token);
      if (newAddress) {
        setAddresses((prev) => [...prev, newAddress]);
        return newAddress;
      }
    } catch (err) {
      console.error("Erro ao criar endereço:", err);
    }
  };

  // ===================== ATUALIZAR ENDEREÇO =====================
  const updateAddress = async (id, updates) => {
    try {
      const updated = await AddressService.updateAddress(id, updates, user.token);
      setAddresses((prev) =>
        prev.map((addr) => (addr._id === id ? updated : addr))
      );
      return updated;
    } catch (err) {
      console.error("Erro ao atualizar endereço:", err);
    }
  };

  // ===================== DELETAR ENDEREÇO =====================
  const deleteAddress = async (id) => {
    try {
      await AddressService.deleteAddress(id, user.token);
      setAddresses((prev) => prev.filter((addr) => addr._id !== id));
      if (selectedAddress?._id === id) setSelectedAddress(null);
    } catch (err) {
      console.error("Erro ao deletar endereço:", err);
    }
  };

  // 🔹 Atualiza automaticamente quando o usuário loga/desloga
  useEffect(() => {
    if (user?.token) fetchAddresses();
    else {
      setAddresses([]);
      setSelectedAddress(null);
    }
  }, [user?.token]);

  return (
    <AddressContext.Provider
      value={{
        addresses,
        selectedAddress,
        setSelectedAddress,
        fetchAddresses,
        createAddress,
        updateAddress,
        deleteAddress,
        loading,
      }}
    >
      {children}
    </AddressContext.Provider>
  );
};

export default AddressProvider;

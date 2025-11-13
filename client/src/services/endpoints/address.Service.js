import { fetchData, postData, putData, deleteData } from "../apiService";

/** ====================
 * AddressService
 * ==================== */
export const AddressService = {
  createAddress: (data) => postData("/addresses", data),
  /** 🔹 Buscar todos os endereços */
  getAddresses: () => fetchData("/addresses"),

  /** 🔹 Buscar endereço específico */
  getAddressById: (addressId) => fetchData(`/addresses/${addressId}`),

  /** 🔹 Adicionar novo endereço */
  addAddress: (address) => postData("/addresses", address),

  /** 🔹 Atualizar endereço existente */
  updateAddress: (addressId, address) =>
    putData(`/addresses/${addressId}`, address),

  /** 🔹 Remover endereço */
  removeAddress: (addressId) => deleteData(`/addresses/${addressId}`),
};

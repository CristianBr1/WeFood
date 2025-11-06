import { fetchData, postData, putData, deleteData } from "../apiService";

/** ====================
 * AddressService
 * ==================== */
export const AddressService = {
  /**
   * Busca todos os endereços
   * @param {string} token
   */
  getAddresses: (token) => fetchData("/addresses", {}, token),

  /**
   * Busca um endereço específico
   * @param {string} addressId
   * @param {string} token
   */
  getAddressById: (addressId, token) =>
    fetchData(`/addresses/${addressId}`, {}, token),

  /**
   * Adiciona um novo endereço
   * @param {object} address
   * @param {string} token
   */
  addAddress: (address, token) => postData("/addresses", address, token),

  /**
   * Atualiza um endereço
   * @param {string} addressId
   * @param {object} address
   * @param {string} token
   */
  updateAddress: (addressId, address, token) =>
    putData(`/addresses/${addressId}`, address, token),

  /**
   * Remove um endereço
   * @param {string} addressId
   * @param {string} token
   */
  removeAddress: (addressId, token) =>
    deleteData(`/addresses/${addressId}`, token),
};
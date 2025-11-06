import api from "./api";

/** ==========================
 *  Funções Genéricas da API
 * ========================== */

// GET genérico
export const fetchData = async (endpoint, params = {}) => {
  try {
    const { data } = await api.get(endpoint, { params });
    return data;
  } catch (error) {
    console.error(`❌ Erro ao buscar ${endpoint}:`, error);
    throw error.response?.data?.message || "Erro ao carregar dados";
  }
};

// POST genérico
export const postData = async (endpoint, body = {}) => {
  try {
    const { data } = await api.post(endpoint, body);
    return data;
  } catch (error) {
    console.error(`❌ Erro ao enviar dados para ${endpoint}:`, error);
    throw error.response?.data?.message || "Erro ao salvar dados";
  }
};

// PUT genérico
export const updateData = async (endpoint, body = {}) => {
  try {
    const { data } = await api.put(endpoint, body);
    return data;
  } catch (error) {
    console.error(`❌ Erro ao atualizar ${endpoint}:`, error);
    throw error.response?.data?.message || "Erro ao atualizar dados";
  }
};

// DELETE genérico
export const deleteData = async (endpoint) => {
  try {
    const { data } = await api.delete(endpoint);
    return data;
  } catch (error) {
    console.error(`❌ Erro ao excluir ${endpoint}:`, error);
    throw error.response?.data?.message || "Erro ao excluir item";
  }
};

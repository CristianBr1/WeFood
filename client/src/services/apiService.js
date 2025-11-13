import api from "./api";

/** ====================
 * Funções genéricas
 * ==================== */
const handleError = (err, endpoint) => {
  const message = err.response?.data?.message || err.message || err;
  console.error(`Erro ao acessar ${endpoint}:`, message);
  throw err;
};

/**
 * GET genérico
 */
export const fetchData = async (endpoint, params = {}) => {
  try {
    const { data } = await api.get(endpoint, { params });
    return data;
  } catch (err) {
    return handleError(err, endpoint);
  }
};

/**
 * POST genérico
 */
export const postData = async (endpoint, body = {}) => {
  try {
    const { data } = await api.post(endpoint, body);
    return data;
  } catch (err) {
    return handleError(err, endpoint);
  }
};

/**
 * PUT genérico
 */
export const putData = async (endpoint, body = {}) => {
  try {
    const { data } = await api.put(endpoint, body);
    return data;
  } catch (err) {
    return handleError(err, endpoint);
  }
};

/**
 * DELETE genérico
 */
export const deleteData = async (endpoint) => {
  try {
    const { data } = await api.delete(endpoint);
    return data;
  } catch (err) {
    return handleError(err, endpoint);
  }
};

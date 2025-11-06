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
 * @param {string} endpoint
 * @param {object} params
 * @param {string} token opcional
 */
export const fetchData = async (endpoint, params = {}, token) => {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const { data } = await api.get(endpoint, { params, headers });
    return data;
  } catch (err) {
    return handleError(err, endpoint);
  }
};

/**
 * POST genérico
 */
export const postData = async (endpoint, body, token) => {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const { data } = await api.post(endpoint, body, { headers });
    return data;
  } catch (err) {
    return handleError(err, endpoint);
  }
};

/**
 * PUT genérico
 */
export const putData = async (endpoint, body, token) => {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const { data } = await api.put(endpoint, body, { headers });
    return data;
  } catch (err) {
    return handleError(err, endpoint);
  }
};

/**
 * DELETE genérico
 */
export const deleteData = async (endpoint, token) => {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const { data } = await api.delete(endpoint, { headers });
    return data;
  } catch (err) {
    return handleError(err, endpoint);
  }
};
import api from "./api";

const handleError = (error, endpoint) => {
  const status = error?.response?.status;

  // 🔸 Se for 401, não loga nada — isso é esperado quando o usuário não está logado
  if (status === 401) {
    return Promise.reject({ unauthorized: true });
  }

  // 🔸 Loga erros reais
  console.error(`❌ Erro ao acessar ${endpoint}:`, error.response?.data || error.message);
  return Promise.reject(error);
};

/** =============================
 *     GET
 * =============================
 */
export const fetchData = async (endpoint, params = {}) => {
  try {
    const res = await api.get(endpoint, { params });
    return res.data;
  } catch (err) {
    return handleError(err, endpoint);
  }
};

/** =============================
 *     POST
 * =============================
 */
export const postData = async (endpoint, body = {}) => {
  try {
    const res = await api.post(endpoint, body);
    return res.data;
  } catch (err) {
    return handleError(err, endpoint);
  }
};

/** =============================
 *     PUT / PATCH
 * =============================
 */
export const updateData = async (endpoint, body = {}) => {
  try {
    const res = await api.put(endpoint, body);
    return res.data;
  } catch (err) {
    return handleError(err, endpoint);
  }
};

/** =============================
 *     DELETE
 * =============================
 */
export const deleteData = async (endpoint) => {
  try {
    const res = await api.delete(endpoint);
    return res.data;
  } catch (err) {
    return handleError(err, endpoint);
  }
};

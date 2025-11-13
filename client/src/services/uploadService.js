import api from "./api";

/**
 * Envia FormData (upload de arquivos) — compatível com cookies httpOnly
 * @param {string} endpoint
 * @param {FormData} formData
 */
export const uploadFormData = async (endpoint, formData) => {
  try {
    const { data } = await api.post(endpoint, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  } catch (err) {
    console.error(`Erro ao enviar arquivo para ${endpoint}:`, err);
    throw err;
  }
};

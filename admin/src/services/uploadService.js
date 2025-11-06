import api from "./api";

/**
 * Envia dados via FormData (para endpoints que aceitam upload de imagem + texto)
 * 
 * @param {string} endpoint - Ex: "/categories" ou "/banners"
 * @param {Object} fields - Campos de texto simples
 * @param {File|File[]|null} file - Arquivo único ou array de arquivos
 * @param {string} fileKey - Nome do campo do arquivo (ex: "image" ou "images[]")
 * @param {string} method - Método HTTP (POST, PUT ou PATCH)
 * @returns {Promise<Object>} - Dados retornados pela API
 */
export const uploadFormData = async ({
  endpoint,
  fields = {},
  file = null,
  fileKey = "image",
  method = "POST",
}) => {
  if (!endpoint) throw new Error("O endpoint não pode ser undefined");

  try {
    const formData = new FormData();

    // Adiciona campos comuns
    Object.entries(fields).forEach(([key, value]) => {
      if (value !== undefined && value !== null) formData.append(key, value);
    });

    // Adiciona arquivo único ou múltiplos arquivos
    if (file) {
      if (Array.isArray(file)) {
        file.forEach((f) => formData.append(fileKey, f));
      } else {
        formData.append(fileKey, file);
      }
    }

    // Chamada API com método dinâmico
    const { data } = await api.request({
      url: endpoint,
      method,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  } catch (error) {
    console.error(`❌ Erro ao enviar dados para ${endpoint}:`, error);
    throw error.response?.data?.message || "Erro ao enviar FormData";
  }
};

import api from "./services/api";

export async function testConnection() {
  try {
    const { data } = await api.get("/test");
    console.log("✅ Conectado ao backend:", data);
    return data;
  } catch (err) {
    console.error(
      "❌ Erro ao conectar com o backend:",
      err.response?.data || err.message
    );
    return null;
  }
}

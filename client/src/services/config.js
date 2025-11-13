export const API_BASE =
  import.meta.env.VITE_API_BASE || "http://localhost:8000";
export const API_URL = import.meta.env.VITE_API_URL || `${API_BASE}/api`;

// Helper para gerar URL completa de imagens
export const getImageUrl = (path) => {
  if (!path) return "/placeholder.jpg";
  if (path.startsWith("http")) return path;
  return `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
};

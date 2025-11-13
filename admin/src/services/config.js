export const API_BASE =
  import.meta.env.VITE_API_BASE || "http://localhost:8000";
export const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

// Helper para gerar URL completa de imagens
export const getImageUrl = (path) => {
  if (!path) return "/placeholder.jpg";
  if (path.startsWith("http")) return path; // já é URL completa (ex: S3, Cloudinary)
  return `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
};

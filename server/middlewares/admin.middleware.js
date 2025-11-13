// middlewares/admin.middleware.js
export function adminMiddleware(req, res, next) {
  try {
    // Se o middleware de autenticação não populou req.user ou req.userRole
    if (!req.user || !req.userRole) {
      return res.status(401).json({
        message: "Usuário não autenticado.",
        error: true,
        success: false,
      });
    }

    // Se o usuário não for admin
    if (req.userRole !== "ADMIN") {
      return res.status(403).json({
        message: "Acesso negado. Requer privilégios de administrador.",
        error: true,
        success: false,
      });
    }

    // ✅ Acesso autorizado
    next();
  } catch (error) {
    console.error("Erro no adminMiddleware:", error);
    return res.status(500).json({
      message: "Erro interno no controle de permissões.",
      error: true,
      success: false,
    });
  }
}

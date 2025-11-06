export function adminMiddleware(req, res, next) {
  if (req.userRole !== "ADMIN") {
    return res.status(403).json({
      message: "Acesso negado. Requer privilégios de administrador.",
      error: true,
      success: false,
    });
  }
  next();
}

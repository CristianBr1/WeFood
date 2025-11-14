import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export async function authMiddleware(req, res, next) {
  try {
    const token =
      req.cookies?.token ||
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null);

    if (!token) {
      return res.status(401).json({
        message: "Token não fornecido.",
        error: true,
        success: false,
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "Usuário não encontrado.",
        error: true,
        success: false,
      });
    }

    req.user = user;
    req.userRole = user.role || "USER";

    next();
  } catch (error) {
    console.error("Erro no authMiddleware:", error.message);
    const message =
      error.name === "TokenExpiredError"
        ? "Sessão expirada. Faça login novamente."
        : "Token inválido.";
    return res.status(401).json({ message, error: true, success: false });
  }
}

import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

/**
 * 🔒 Middleware de autenticação
 * - Prioriza cookies httpOnly
 * - Aceita também Authorization: Bearer <token>
 * - Valida token e injeta req.user e req.userRole
 */
export async function authMiddleware(req, res, next) {
  try {
    // 🍪 1. Extrair token (prioriza cookie, fallback pra Bearer)
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

    // 🔍 2. Verificar validade e assinatura
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.id) {
      return res.status(401).json({
        message: "Token inválido.",
        error: true,
        success: false,
      });
    }

    // 🔎 3. Buscar usuário correspondente
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({
        message: "Usuário não encontrado.",
        error: true,
        success: false,
      });
    }

    // ✅ 4. Anexar dados ao request
    req.user = user;
    req.userRole = user.role || "USER";

    next();
  } catch (error) {
    console.error("❌ Erro no authMiddleware:", error.message);

    // ⚠️ Respostas específicas conforme o tipo de erro JWT
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Sessão expirada. Faça login novamente.",
        error: true,
        success: false,
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Token inválido.",
        error: true,
        success: false,
      });
    }

    return res.status(500).json({
      message: "Erro interno na autenticação.",
      error: true,
      success: false,
    });
  }
}

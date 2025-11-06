// middlewares/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Token não fornecido",
      error: true,
      success: false,
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        message: "Usuário não encontrado",
        error: true,
        success: false,
      });
    }

    req.user = user;
    req.userRole = user.role; // ADMIN ou USER
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Token inválido ou expirado",
      error: true,
      success: false,
    });
  }
}

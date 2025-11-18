// Importa o modelo de usuário do MongoDB
import User from "../models/user.model.js";

// Importa biblioteca para gerar e validar tokens JWT
import jwt from "jsonwebtoken";

// Importa biblioteca para criptografar e comparar senhas
import bcrypt from "bcryptjs";

// Importa biblioteca para fazer requisições HTTP externas (Google OAuth)
import axios from "axios";

// Chave secreta para assinar o JWT
const JWT_SECRET = process.env.JWT_SECRET;

// Client ID da aplicação Google (usado no login OAuth)
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

// Flag para identificar se estamos em produção
const isProd = process.env.NODE_ENV === "production";

/** =====================
 * CONFIG COOKIE
 * ===================== */
// Configurações dos cookies usados para autenticação
const cookieOptions = {
  httpOnly: true, // 🔒 impede que JS do front-end acesse o cookie
  secure: isProd, // 🔥 cookie só via HTTPS em produção
  sameSite: isProd ? "none" : "lax", // 🔥 'none' permite cross-domain em produção
};

/** =====================
 * GERAR TOKEN JWT
 * ===================== */
const createToken = (user) => {
  // Cria um JWT com id, email e nome do usuário
  // Expira em 7 dias
  return jwt.sign(
    { id: user._id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
};

/** =====================
 * REGISTER
 * ===================== */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Verifica se já existe usuário com o mesmo email
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "E-mail já existe." });

    // Cria novo usuário
    const newUser = await User.create({ name, email, password });

    // Gera token JWT
    const token = createToken(newUser);

    // Salva o token em cookie
    res.cookie("token", token, cookieOptions);

    // Retorna sucesso e dados do usuário
    res.json({
      message: "Registrado com sucesso!",
      user: newUser.toJSON(),
    });
  } catch (err) {
    console.error("Erro ao registrar:", err);
    res.status(500).json({ message: "Erro ao registrar" });
  }
};

/** =====================
 * LOGIN NORMAL
 * ===================== */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Busca usuário pelo email e inclui senha
    const user = await User.findOne({ email }).select("+password");
    if (!user)
      return res.status(400).json({ message: "Usuário não encontrado." });

    // Compara senha informada com a hash no banco
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Senha incorreta." });

    // Gera token JWT
    const token = createToken(user);

    // Salva token em cookie
    res.cookie("token", token, cookieOptions);

    // Retorna sucesso e dados do usuário
    res.json({
      message: "Login realizado!",
      user: user.toJSON(),
    });
  } catch (err) {
    console.error("Erro no loginUser:", err);
    res.status(500).json({ message: "Erro ao logar" });
  }
};

/** =====================
 * LOGIN COM GOOGLE
 * ===================== */
export const googleOAuth = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential)
      return res.status(400).json({ message: "Credential não informado." });

    // Verifica o token do Google
    const googleRes = await axios.get(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`
    );

    const info = googleRes.data;

    // Verifica se o token é válido para nosso CLIENT_ID
    if (info.aud !== CLIENT_ID)
      return res.status(400).json({ message: "Token Google inválido." });

    // Busca usuário pelo email do Google
    let user = await User.findOne({ email: info.email });

    // Se não existir, cria um novo usuário
    if (!user) {
      user = await User.create({
        name: info.name,
        email: info.email,
        avatar: info.picture,
        googleId: info.sub,
      });
    }

    // Gera token JWT
    const token = createToken(user);
    res.cookie("token", token, cookieOptions);

    // Retorna sucesso e dados do usuário
    res.json({ message: "Google login OK", user: user.toJSON() });
  } catch (err) {
    console.error("Erro no login Google:", err);
    res.status(500).json({ message: "Erro no login Google" });
  }
};

/** =====================
 * PERFIL
 * ===================== */
export const getUserProfile = async (req, res) => {
  try {
    // Busca usuário pelo ID do token
    const user = await User.findById(req.user.id).select("-password");
    res.json({ user });
  } catch {
    res.status(500).json({ message: "Erro ao buscar perfil" });
  }
};

/** =====================
 * LOGOUT
 * ===================== */
export const logoutUser = async (req, res) => {
  // Limpa o cookie do token
  res.clearCookie("token", {
    ...cookieOptions,
    expires: new Date(0),
  });
  res.json({ message: "Logout feito!" });
};

/** =====================
 * Atualizar perfil
 * ===================== */
export const updateUserProfile = async (req, res) => {
  try {
    // Extrai apenas campos que podem ser atualizados
    const updates = (({ name, mobile, email }) => ({ name, mobile, email }))(
      req.body
    );

    // Atualiza usuário no banco
    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
    });

    if (!user)
      return res.status(404).json({ message: "Usuário não encontrado." });

    res.json({
      success: true,
      user: user.toJSON(),
      message: "Perfil atualizado com sucesso.",
    });
  } catch (err) {
    console.error("Erro ao atualizar perfil:", err);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
};

/** =====================
 * Atualizar avatar
 * ===================== */
export const updateUserAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;

    if (!avatar)
      return res.status(400).json({ message: "Avatar é obrigatório." });

    // Atualiza campo avatar do usuário
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true }
    );

    res.json({
      success: true,
      user: user.toJSON(),
      message: "Avatar atualizado com sucesso.",
    });
  } catch (err) {
    console.error("Erro ao atualizar avatar:", err);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
};

/** =====================
 * Listar usuários (Admin)
 * ===================== */
export const getAllUsers = async (req, res) => {
  try {
    // Busca todos os usuários, ordenando pelo mais recente
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (err) {
    console.error("Erro ao listar usuários:", err);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
};

/** =====================
 * Deletar usuário (Admin)
 * ===================== */
export const deleteUser = async (req, res) => {
  try {
    // Deleta usuário pelo ID
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user)
      return res.status(404).json({ message: "Usuário não encontrado." });

    res.json({
      success: true,
      message: "Usuário deletado com sucesso.",
    });
  } catch (err) {
    console.error("Erro ao deletar usuário:", err);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
};

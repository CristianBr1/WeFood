import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

/* ============================================================
   🔵 GOOGLE OAUTH LOGIN
============================================================ */
export const googleOAuth = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential)
      return res.status(400).json({ message: "Credencial não enviada." });

    // 📌 Verifica token vindo do Google
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, name, email, picture } = payload;

    // 📌 Procura usuário por e-mail
    let user = await User.findOne({ email });

    if (!user) {
      // ▶ Criar usuário automaticamente
      user = await User.create({
        name,
        email,
        googleId,
        avatar: picture,
        verify_email: true,
      });
    } else if (!user.googleId) {
      // ▶ Usuário existe mas não tem googleId → vincula agora
      user.googleId = googleId;
      await user.save();
    }

    const token = generateToken(user._id);

    res
      .cookie("token", token, cookieOptions)
      .json({ success: true, user: user.toJSON() });
  } catch (err) {
    console.error("🔥 Erro no Google OAuth:", err);
    res.status(500).json({ message: "Erro ao autenticar com Google." });
  }
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "Preencha todos os campos." });

    if (await User.findOne({ email }))
      return res.status(400).json({ message: "E-mail já cadastrado." });

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    res.status(201).cookie("token", token, cookieOptions).json({
      success: true,
      user,
      message: "Registro concluído com sucesso.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: "Credenciais inválidas." });

    const token = generateToken(user._id);
    res.cookie("token", token, cookieOptions).json({
      success: true,
      user,
      message: "Login realizado com sucesso.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token", { ...cookieOptions, maxAge: 0 });
    res.json({ success: true, message: "Logout realizado com sucesso." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    res.json({ success: true, user: req.user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
};

/** =====================================
 * ✏️ Atualizar perfil
 * ===================================== */
export const updateUserProfile = async (req, res) => {
  try {
    const updates = (({ name, mobile, email }) => ({ name, mobile, email }))(
      req.body
    );
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

/** =====================================
 * 🖼️ Atualizar avatar
 * ===================================== */
export const updateUserAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    if (!avatar)
      return res.status(400).json({ message: "Avatar é obrigatório." });

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

/** =====================================
 * 📋 Listar todos os usuários (Admin)
 * ===================================== */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (err) {
    console.error("Erro ao listar usuários:", err);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
};

/** =====================================
 * ❌ Deletar usuário (Admin)
 * ===================================== */
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user)
      return res.status(404).json({ message: "Usuário não encontrado." });

    res.json({ success: true, message: "Usuário deletado com sucesso." });
  } catch (err) {
    console.error("Erro ao deletar usuário:", err);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
};

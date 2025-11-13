import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

/** =====================================
 * 🔑 Gera JWT
 * ===================================== */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

/** =====================================
 * ⚙️ Opções do cookie seguro
 * ===================================== */
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
};

/** =====================================
 * 🧾 Registrar usuário
 * ===================================== */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, avatar, mobile } = req.body;

    if (!name || !email || !password)
      return res
        .status(400)
        .json({ message: "Preencha todos os campos obrigatórios." });

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "E-mail já cadastrado." });

    const user = await User.create({ name, email, password, avatar, mobile });
    const token = generateToken(user._id);

    res.status(201).cookie("token", token, cookieOptions).json({
      success: true,
      user: user.toJSON(),
      message: "Registro concluído com sucesso.",
    });
  } catch (err) {
    console.error("Erro no registro:", err);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
};

/** =====================================
 * 🔐 Login
 * ===================================== */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Preencha todos os campos obrigatórios." });

    const user = await User.findOne({ email }).select("+password");
    if (!user)
      return res.status(401).json({ message: "Credenciais inválidas." });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(401).json({ message: "Credenciais inválidas." });

    await user.updateLastLogin();

    const token = generateToken(user._id);
    res.cookie("token", token, cookieOptions).json({
      success: true,
      user: user.toJSON(),
      message: "Login realizado com sucesso.",
    });
  } catch (err) {
    console.error("Erro no login:", err);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
};

/** =====================================
 * 🚪 Logout
 * ===================================== */
export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token", { ...cookieOptions, maxAge: 0 });
    res.json({ success: true, message: "Logout realizado com sucesso." });
  } catch (err) {
    console.error("Erro no logout:", err);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
};

/** =====================================
 * 👤 Obter perfil
 * ===================================== */
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user)
      return res.status(404).json({ message: "Usuário não encontrado." });

    res.json({ success: true, user: user.toJSON() });
  } catch (err) {
    console.error("Erro ao obter perfil:", err);
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

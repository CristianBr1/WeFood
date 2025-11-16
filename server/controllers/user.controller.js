import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import axios from "axios";

const JWT_SECRET = process.env.JWT_SECRET;
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

// =======================
//   GERAR TOKEN
// =======================
const createToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// =======================
//   REGISTER
// =======================
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "E-mail já existe." });

    const newUser = await User.create({
      name,
      email,
      password, // 🔥 DEIXA O SCHEMA FAZER O HASH
    });

    const token = createToken(newUser);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });

    res.json({ message: "Registrado com sucesso!", user: newUser });
  } catch (err) {
    res.status(500).json({ message: "Erro ao registrar" });
  }
};

// =======================
//   LOGIN NORMAL
// =======================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user)
      return res.status(400).json({ message: "Usuário não encontrado." });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Senha incorreta." });

    const token = createToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax", // 🔥 FUNCIONA EM LOCALHOST
      secure: false, // 🔥 localhost NÃO aceita secure:true
    });

    return res.json({
      message: "Login realizado!",
      user: user.toJSON(),
    });
  } catch (err) {
    console.error("Erro no loginUser:", err);
    return res.status(500).json({ message: "Erro ao logar" });
  }
};

// =======================
//   LOGIN COM GOOGLE
// =======================
export const googleOAuth = async (req, res) => {
  try {
    const { credential } = req.body; // token do Google (frontend)

    // 1) Validar token no Google
    const response = await axios.get(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`
    );

    const data = response.data;

    if (data.aud !== CLIENT_ID) {
      return res.status(400).json({ message: "Token inválido." });
    }

    // 2) Verificar se usuário existe
    let user = await User.findOne({ email: data.email });

    // 3) Criar se não existir
    if (!user) {
      user = await User.create({
        name: data.name,
        email: data.email,
        avatar: data.picture,
        password: null, // usuário Google não tem senha
      });
    }

    // 4) Gerar JWT
    const token = createToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });

    res.json({ message: "Google login OK", user });
  } catch (err) {
    res.status(500).json({ message: "Erro no login Google" });
  }
};

// =======================
//   PERFIL
// =======================
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ user });
  } catch {
    res.status(500).json({ message: "Erro ao buscar perfil" });
  }
};

// =======================
//   LOGOUT
// =======================
export const logoutUser = async (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logout feito!" });
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

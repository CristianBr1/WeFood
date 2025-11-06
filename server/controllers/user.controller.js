import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

// 🔑 Gera JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// ========================================
// 📌 Registrar usuário
// ========================================
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, avatar, mobile } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "Preencha todos os campos." });

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "E-mail já cadastrado." });

    const user = await User.create({ name, email, password, avatar, mobile });
    const token = generateToken(user._id);

    res.status(201).json({ user: user.toJSON(), token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro no servidor." });
  }
};

// ========================================
// 📌 Login usuário
// ========================================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Preencha todos os campos." });

    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(401).json({ message: "Credenciais inválidas." });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: "Credenciais inválidas." });

    await user.updateLastLogin();

    const token = generateToken(user._id);
    res.json({ user: user.toJSON(), token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro no servidor." });
  }
};

// ========================================
// 📌 Logout
// ========================================
export const logoutUser = async (req, res) => {
  try {
    const userId = req.user._id;
    await User.findByIdAndUpdate(userId, { refresh_token: "" });
    res.json({ message: "Logout realizado com sucesso." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro no servidor." });
  }
};

// ========================================
// 📌 Obter perfil do usuário
// ========================================
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "Usuário não encontrado." });
    res.json({ user: user.toJSON() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro no servidor." });
  }
};

// ========================================
// 📌 Listar todos usuários (ADMIN)
// ========================================
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users.map(u => u.toJSON()));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro no servidor." });
  }
};

// ========================================
// 📌 Deletar usuário (ADMIN)
// ========================================
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "Usuário não encontrado." });
    res.json({ message: "Usuário deletado com sucesso." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro no servidor." });
  }
};

// ========================================
// 📌 Enviar OTP para reset de senha
// ========================================
export const sendResetPasswordOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Informe o e-mail." });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Usuário não encontrado." });

    const otp = crypto.randomInt(100000, 999999).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    user.forgot_password_otp = otp;
    user.forgot_password_expiry = expiry;
    await user.save();

    console.log(`OTP para ${email}: ${otp}`);
    res.json({ message: "OTP enviado para o e-mail." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro no servidor." });
  }
};

// ========================================
// 📌 Resetar senha usando OTP
// ========================================
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword)
      return res.status(400).json({ message: "Todos os campos são obrigatórios." });

    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(404).json({ message: "Usuário não encontrado." });

    if (user.forgot_password_otp !== otp)
      return res.status(400).json({ message: "OTP inválido." });

    if (new Date() > user.forgot_password_expiry)
      return res.status(400).json({ message: "OTP expirado." });

    user.password = newPassword;
    user.forgot_password_otp = null;
    user.forgot_password_expiry = null;
    await user.save();

    res.json({ message: "Senha alterada com sucesso." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro no servidor." });
  }
};

// ========================================
// 📌 Atualizar avatar do usuário
// ========================================
export const updateUserAvatar = async (req, res) => {
  try {
    const { id } = req.params;
    const { avatar } = req.body;

    if (!avatar) {
      return res.status(400).json({ message: "A URL do avatar é obrigatória." });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { avatar },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    res.status(200).json({
      message: "Avatar atualizado com sucesso!",
      user: user.toJSON(),
    });
  } catch (error) {
    console.error("Erro ao atualizar avatar:", error);
    res.status(500).json({ message: "Erro ao atualizar avatar." });
  }
};

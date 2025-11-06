import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    // 🔹 Nome completo do usuário
    name: {
      type: String,
      required: [true, "O nome é obrigatório."],
      trim: true,
    },

    // 🔹 E-mail único e validado
    email: {
      type: String,
      required: [true, "O e-mail é obrigatório."],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "E-mail inválido."],
    },

    // 🔹 Senha criptografada
    password: {
      type: String,
      required: [true, "A senha é obrigatória."],
      minlength: [6, "A senha deve ter no mínimo 6 caracteres."],
      select: false, // não retorna por padrão nas queries
    },

    // 🔹 Avatar do usuário (URL de imagem)
    avatar: {
      type: String,
      default: "",
    },

    // 🔹 Telefone ou celular
    mobile: {
      type: String,
      default: "",
    },

    // 🔹 Token de atualização (refresh token JWT)
    refresh_token: {
      type: String,
      default: "",
    },

    // 🔹 E-mail verificado (confirmação)
    verify_email: {
      type: Boolean,
      default: false,
    },

    // 🔹 Data do último login
    last_login_date: {
      type: Date,
      default: null,
    },

    // 🔹 Status do usuário
    status: {
      type: String,
      enum: ["Active", "Inactive", "Suspended"],
      default: "Active",
    },

    // 🔹 Endereços do usuário (referência)
    address_details: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Address",
      },
    ],

    // 🔹 Carrinho de compras
    shopping_cart: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "CartProduct",
      },
    ],

    // 🔹 Histórico de pedidos
    order_history: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Order",
      },
    ],

    // 🔹 Token de recuperação de senha (OTP)
    forgot_password_otp: {
      type: String,
      default: null,
    },

    // 🔹 Validade do OTP
    forgot_password_expiry: {
      type: Date,
      default: null,
    },

    // 🔹 Papel do usuário
    role: {
      type: String,
      enum: ["ADMIN", "USER"],
      default: "USER",
    },
  },
  {
    timestamps: true,
  }
);

//
// 🔐 Criptografia da senha antes de salvar
//
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//
// 🔑 Método para comparar senha inserida com a salva no banco
//
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//
// 🔄 Atualiza data do último login
//
userSchema.methods.updateLastLogin = async function () {
  this.last_login_date = new Date();
  await this.save();
};

//
// 🧠 Formata a saída JSON removendo campos sensíveis
//
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refresh_token;
  delete obj.forgot_password_otp;
  delete obj.forgot_password_expiry;
  return obj;
};

const User = mongoose.model("User", userSchema);
export default User;

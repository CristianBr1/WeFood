// models/user.model.js
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
      required: function () {
        // Senha é obrigatória apenas para usuários que NÃO são Google
        return !this.googleId;
      },
      minlength: [6, "A senha deve ter no mínimo 6 caracteres."],
      select: false,
    },

    googleId: {
      type: String,
      default: null,
    },

    // 🔹 Avatar do usuário (URL)
    avatar: {
      type: String,
      default: "",
    },

    // 🔹 Telefone (opcional)
    mobile: {
      type: String,
      validate: {
        validator: (v) => !v || /^(\+?\d{1,3})?\d{8,14}$/.test(v),
        message: "Número de telefone inválido.",
      },
      default: "",
    },

    // 🔹 Token de atualização (caso implemente refresh tokens)
    refresh_token: {
      type: String,
      default: "",
    },

    // 🔹 E-mail verificado
    verify_email: {
      type: Boolean,
      default: false,
    },

    // 🔹 Data do último login
    last_login_date: {
      type: Date,
      default: null,
    },

    // 🔹 Status da conta
    status: {
      type: String,
      enum: {
        values: ["Active", "Inactive", "Suspended"],
        message: "Status inválido. Use Active, Inactive ou Suspended.",
      },
      default: "Active",
    },

    // 🔹 Endereços do usuário
    address_details: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Address",
      },
    ],

    // 🔹 Carrinho
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

    // 🔹 Recuperação de senha
    forgot_password_otp: {
      type: String,
      default: null,
    },
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
    toJSON: { virtuals: true },
  }
);

//
// 🔐 Criptografa a senha antes de salvar
//
userSchema.pre("save", async function (next) {
  if (!this.password) return next();
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//
// 🔑 Compara senha inserida com a salva no banco
//
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) {
    throw new Error("Senha não carregada. Use .select('+password')");
  }
  return bcrypt.compare(enteredPassword, this.password);
};

//
// 🔄 Atualiza a data do último login
//
userSchema.methods.updateLastLogin = async function () {
  this.last_login_date = new Date();
  await this.save();
};

//
// 🧠 Remove dados sensíveis ao retornar JSON
//
userSchema.methods.toJSON = function () {
  const obj = this.toObject({ virtuals: true });
  delete obj.password;
  delete obj.refresh_token;
  delete obj.forgot_password_otp;
  delete obj.forgot_password_expiry;
  delete obj.__v;
  return obj;
};

//
// 👑 Virtual para verificar admin
//
userSchema.virtual("isAdmin").get(function () {
  return this.role === "ADMIN";
});

const User = mongoose.model("User", userSchema);
export default User;

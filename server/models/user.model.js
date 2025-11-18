import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "O nome é obrigatório."],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "O e-mail é obrigatório."],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "E-mail inválido."],
    },

    // Senha opcional para usuários Google
    password: {
      type: String,
      required: function () {
        return !this.googleId;
      },
      minlength: [6, "A senha deve ter no mínimo 6 caracteres."],
      select: false,
    },

    googleId: {
      type: String,
      default: null,
    },

    avatar: {
      type: String,
      default: "",
    },

    mobile: {
      type: String,
      validate: {
        validator: (v) => !v || /^(\+?\d{1,3})?\d{8,14}$/.test(v),
        message: "Número de telefone inválido.",
      },
      default: "",
    },

    refresh_token: {
      type: String,
      default: "",
    },

    verify_email: {
      type: Boolean,
      default: false,
    },

    last_login_date: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: ["Active", "Inactive", "Suspended"],
      default: "Active",
    },

    address_details: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Address",
      },
    ],

    shopping_cart: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "CartProduct",
      },
    ],

    order_history: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Order",
      },
    ],

    forgot_password_otp: {
      type: String,
      default: null,
    },

    forgot_password_expiry: {
      type: Date,
      default: null,
    },

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

/* ---------------------------------------
   🔐 Criptografar senha apenas se existir
----------------------------------------- */
userSchema.pre("save", async function (next) {
  if (!this.password) return next();
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

/* ---------------------------------------
   🔑 Comparar senha
----------------------------------------- */
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) {
    throw new Error("Senha não carregada. Use .select('+password')");
  }
  return bcrypt.compare(enteredPassword, this.password);
};

/* ---------------------------------------
   📅 Atualizar último login
----------------------------------------- */
userSchema.methods.updateLastLogin = async function () {
  this.last_login_date = new Date();
  await this.save();
};

/* ---------------------------------------
   🧼 Remover dados sensíveis no JSON
----------------------------------------- */
userSchema.methods.toJSON = function () {
  const obj = this.toObject({ virtuals: true });

  delete obj.password;
  delete obj.refresh_token;
  delete obj.forgot_password_otp;
  delete obj.forgot_password_expiry;
  delete obj.__v;

  return obj;
};

/* ---------------------------------------
   👑 Virtual Admin
----------------------------------------- */
userSchema.virtual("isAdmin").get(function () {
  return this.role === "ADMIN";
});

const User = mongoose.model("User", userSchema);
export default User;

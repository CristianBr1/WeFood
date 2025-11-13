import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    // 🔹 Endereço (rua + número)
    address_line: {
      type: String,
      required: [true, "O endereço é obrigatório."],
      trim: true,
    },

    // 🔹 Complemento
    complement: {
      type: String,
      default: "",
      trim: true,
    },

    // 🔹 Bairro
    neighborhood: {
      type: String,
      default: "",
      trim: true,
    },

    // 🔹 Cidade
    city: {
      type: String,
      required: [true, "A cidade é obrigatória."],
      trim: true,
    },

    // 🔹 CEP
    pincode: {
      type: String,
      required: [true, "O CEP é obrigatório."],
      match: [/^\d{5}-?\d{3}$/, "CEP inválido."],
      trim: true,
    },

    // 🔹 País
    country: {
      type: String,
      default: "Brasil",
      trim: true,
    },

    // 🔹 Telefone
    mobile: {
      type: String,
      default: null,
      trim: true,
    },

    // 🔹 Identificador (Casa, Trabalho, etc.)
    favoriteAs: {
      type: String,
      default: "Casa",
      trim: true,
    },

    // 🔹 Status do endereço
    status: {
      type: Boolean,
      default: true,
    },

    // 🔹 Dono do endereço
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

//
// 🧠 Limpa saída JSON (remove __v e timestamps se quiser enxugar o payload)
//
addressSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

const AddressModel = mongoose.model("Address", addressSchema);
export default AddressModel;
